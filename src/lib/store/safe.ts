import type {
	BaseTransaction,
	EIP712TypedData,
	OffChainSignMessageResponse,
	SafeInfo
} from '@rndlabs/safe-apps-sdk';
import type SafeAppsSDK from '@rndlabs/safe-apps-sdk';
import { Safe, EthersAdapter } from '@rndlabs/safe-protocol-kit';
import { derived, writable, type Readable, type Unsubscriber } from 'svelte/store';
import { connected, rpc, chainId } from './chain';
import { ethers } from 'ethers';
import { setError } from './error';

// safe
const safeApp = writable<SafeAppsSDK | undefined>(undefined);
const safeInfo = writable<SafeInfo | undefined>(undefined);

export type TransactionRecord = {
	readonly tx: BaseTransaction;
	// the description for the toolbox interface
	readonly description: string;
	// if this transaction is removed, all other transactions with a higher index will be removed as well
	wipeRemaining: boolean;
};

// This will be indexed by the safeTxHash
export type TransactionBatch = {
	// the transactions to send in a list (ordering is important!)
	readonly txs: TransactionRecord[];
};

export type TypedSignatureRecord = {
	// the typed message that is to be signed by the safe
	readonly msg: EIP712TypedData;
	// description for the toolbox interface
	readonly description: string;
	// if signed, then this will be populated with the off-chain signature
	offChainSignature?: string;
};

// Define a type where the type is a class that extends the Monitor class
export type MonitorRecords<T> = {
	pending: {
		[key: number]: {
			[key: string]: T;
		};
	};
	confirmed: {
		[key: number]: {
			[subKey: string]: T;
		};
	};
};

export type MonitorEventCallback = (event: string, hash: string) => void;
export type MonitorEventRecords = {
	[key: string]: MonitorEventCallback[];
};

const safe: Readable<Safe | undefined> = derived([safeInfo, rpc], ([$info, $rpc], set) => {
	if ($info && $rpc) {
		Safe.create({
			safeAddress: $info.safeAddress,
			ethAdapter: new EthersAdapter({ ethers, signerOrProvider: $rpc })
		})
			.then((safe) => {
				set(safe);
			})
			.catch((e) => {
				setError(e);
			});
	} else {
		set(undefined);
	}
});

const fallbackHandler: Readable<string | undefined> = derived([safe], ([$safe], set) => {
	if ($safe) {
		$safe
			.getFallbackHandler()
			.then((handler) => {
				set(handler);
			})
			.catch((e) => {
				throw new Error(e);
			});
	} else {
		set(undefined);
	}
});

const txMonitor = writable<TransactionMonitor | undefined>(undefined);
const sigMonitor = writable<SignatureMonitor | undefined>(undefined);

// As monitoring functionality is the same essentially for both tx and sigs, abstract it out
abstract class Monitor<T> {
	// static variables
	protected static safeApp: SafeAppsSDK | undefined = undefined;
	protected static chainId: number | undefined = undefined;
	protected static events: MonitorEventRecords = {};
	private static paused = false;
	private static safeAppHandler: Unsubscriber | undefined = undefined;
	private static chainIdHandler: Unsubscriber | undefined = undefined;

	// instance variables modifiable by subclasses
	protected records: MonitorRecords<T>; // an object containing pending and confirmed items
	protected tainted = false;
	// abstract variables that must be defined by subclasses
	abstract readonly localStoreKey: string;

	// instance variables
	private handle: NodeJS.Timeout | undefined = undefined;

	protected constructor(records: MonitorRecords<T>) {
		this.records = records;

		// subscribe to the safeApp
		if (!Monitor.safeAppHandler) {
			Monitor.safeAppHandler = safeApp.subscribe((safeApp) => {
				Monitor.safeApp = safeApp;
				Monitor.paused = safeApp ? false : true;
			});
		}

		// subscribe to the chainId
		if (!Monitor.chainIdHandler) {
			Monitor.chainIdHandler = chainId.subscribe((chainId) => {
				Monitor.chainId = chainId;
				Monitor.paused = chainId ? false : true;
			});
		}
	}

	async poll(): Promise<void> {
		// if paused, then do nothing
		if (Monitor.paused) {
			return;
		}

		if (!Monitor.safeApp || !Monitor.chainId) {
			throw new Error('SafeApp/chainId not initialized!');
		}

		// if the document is visible, then poll
		if (document.visibilityState === 'visible' && this.records.pending[Monitor.chainId]) {
			// iterate through all pending items
			for (const [k, o] of Object.entries(this.records.pending[Monitor.chainId])) {
				return this._poll(k, o);
			}
		}

		// if tainted (ie. something changed), then save
		if (this.tainted) {
			await this.save();
			this.tainted = false;
		}
	}

	protected abstract _poll(k: string, o: T): Promise<void>;

	async add(item: T): Promise<void> {
		// if paused, then throw an error
		if (Monitor.paused) {
			throw new Error('Cannot add an item to the monitor when paused!');
		}

		if (!Monitor.safeApp || !Monitor.chainId) {
			throw new Error('SafeApp/chainId not initialized!');
		}

		// add the item to the pending list
		await this._add(item);

		if (!this.tainted) {
			throw new Error('Added an item but did not taint the monitor!');
		}

		// save the pending list
		await this.save();
	}

	protected abstract _add(item: T): Promise<void>;

	// start the monitor
	start(numSecs: number): Monitor<T> {
		if (!this.handle) {
			console.log('Starting monitor', this.localStoreKey);
			this.handle = setInterval(() => {
				console.log('Polling monitor', this.localStoreKey);
				this.poll();
			}, numSecs * 1000);
		}

		return this;
	}

	// stop the monitor
	stop(): Monitor<T> {
		if (this.handle) {
			console.log('Stopping monitor', this.localStoreKey);
			clearInterval(this.handle);
			this.handle = undefined;
		}

		return this;
	}

	protected static addEvents(events: MonitorEventRecords): void {
		this.events = events;
	}

	// add an event listener
	addEventListener(event: string, callback: MonitorEventCallback): void {
		if (!Monitor.events[event]) {
			Monitor.events[event] = [];
		}

		Monitor.events[event].push(callback);
	}

	// remove an event listener
	removeEventListener(event: string, callback: MonitorEventCallback): void {
		if (!Monitor.events[event]) {
			return;
		}

		const index = Monitor.events[event].indexOf(callback);
		if (index > -1) {
			Monitor.events[event].splice(index, 1);
		}

		if (Monitor.events[event].length === 0) {
			delete Monitor.events[event];
		}
	}

	private async save(): Promise<void> {
		localStorage.setItem(this.localStoreKey, JSON.stringify(this.records));
		this.tainted = false;
	}
}

export class TransactionMonitor extends Monitor<TransactionBatch> {
	private static readonly _localStoreKey = 'txMonitor';
	private static singleton: TransactionMonitor | undefined = undefined;

	public get localStoreKey(): string {
		return TransactionMonitor._localStoreKey;
	}

	protected constructor(records: MonitorRecords<TransactionBatch>) {
		super(records);
	}

	static getSingleton(events: MonitorEventRecords = {}): TransactionMonitor {
		if (!this.singleton) {
			// get the pending and confirmed from local storage
			const local = localStorage.getItem(TransactionMonitor._localStoreKey);
			if (local) {
				const { records } = JSON.parse(local);
				this.singleton = new TransactionMonitor(records as MonitorRecords<TransactionBatch>);
			}

			// if there is no local storage, then create a new one
			if (!this.singleton) {
				this.singleton = new TransactionMonitor({ pending: {}, confirmed: {} });
			}

			TransactionMonitor.addEvents(events);
		}

		if (!TransactionMonitor.singleton) {
			throw new Error('Could not create singleton!');
		}

		return TransactionMonitor.singleton;
	}

	async _add(item: TransactionBatch): Promise<void> {
		// First try submitting the transaction to the safe
		// no need to check if safeApp is defined as it's guarded by monitor.add.
		const { safeTxHash } = await Monitor.safeApp!.txs.send({ txs: item.txs.map((tx) => tx.tx) });
		// if successful, then add it to the pending list
		this.records.pending[Monitor.chainId!][safeTxHash] = item;

		// if the `tx-added` event is defined, then dispatch it
		if (Monitor.events['tx-added']) {
			Monitor.events['tx-added'].forEach((callback) => {
				callback('tx-added', safeTxHash);
			});
		}

		// dispatch('tx-added', { chainId: Monitor.chainId!, safeTxHash });
		this.tainted = true;
	}

	protected async _poll(safeTxHash: string, batch: TransactionBatch): Promise<void> {
		// get the transaction details
		// no need to check if safeApp is defined as it's guarded by monitor.poll.
		const txDetails = await Monitor.safeApp!.txs.getBySafeTxHash(safeTxHash);

		// if the transaction is successful, then move it to the confirmed list
		if (txDetails.txStatus === 'SUCCESS') {
			this.records.confirmed[Monitor.chainId!][safeTxHash] = batch;
			delete this.records.pending[Monitor.chainId!][safeTxHash];
			// TODO: add extra support for pending execution (ie. all signatures
			// have been collected but the transaction has not been executed yet)
			// dispatch('tx-confirmed', { chainId: Monitor.chainId!, safeTxHash });
			if (Monitor.events['tx-confirmed']) {
				Monitor.events['tx-confirmed'].forEach((callback) => {
					callback('tx-confirmed', safeTxHash);
				});
			}
			this.tainted = true;
		}
	}
}

export class SignatureMonitor extends Monitor<TypedSignatureRecord> {
	private static readonly _localStoreKey = 'sigMonitor';
	private static singleton: SignatureMonitor | undefined = undefined;

	public get localStoreKey(): string {
		return SignatureMonitor._localStoreKey;
	}

	protected constructor(records: MonitorRecords<TypedSignatureRecord>) {
		super(records);
	}

	static getSingleton(events: MonitorEventRecords = {}): SignatureMonitor {
		if (!this.singleton) {
			// get the pending and confirmed from local storage
			const local = localStorage.getItem(SignatureMonitor._localStoreKey);
			if (local) {
				const { records } = JSON.parse(local);
				this.singleton = new SignatureMonitor(records as MonitorRecords<TypedSignatureRecord>);
			}

			// if there is no local storage, then create a new one
			if (!this.singleton) {
				this.singleton = new SignatureMonitor({ pending: {}, confirmed: {} });
			}

			TransactionMonitor.addEvents(events);
		}

		if (!SignatureMonitor.singleton) {
			throw new Error('Could not create singleton!');
		}

		return SignatureMonitor.singleton;
	}

	async _add(item: TypedSignatureRecord): Promise<void> {
		// First try submitting the signature for signing
		const { messageHash } = (await Monitor.safeApp!.txs.signTypedMessage(
			item.msg
		)) as OffChainSignMessageResponse;
		// If successful, then add it to the pending list
		this.records.pending[Monitor.chainId!][messageHash] = item;
		if (Monitor.events['sig-added']) {
			Monitor.events['sig-added'].forEach((callback) => {
				callback('sig-added', messageHash);
			});
		}
		this.tainted = true;
	}

	protected async _poll(messageHash: string, msg: TypedSignatureRecord): Promise<void> {
		// get the signature details
		const offChainSignature = await Monitor.safeApp!.safe.getOffChainSignature(messageHash);

		if (offChainSignature.length > 0) {
			// if the signature is successful, then move it to the confirmed list
			msg.offChainSignature = offChainSignature;
			this.records.confirmed[Monitor.chainId!][messageHash] = msg;
			delete this.records.pending[Monitor.chainId!][messageHash];
			if (Monitor.events['sig-confirmed']) {
				Monitor.events['sig-confirmed'].forEach((callback) => {
					callback('sig-confirmed', messageHash);
				});
			}
			this.tainted = true;
		}
	}
}

// Monitor for any change to connected
connected.subscribe(async (connected) => {
	// if connected, the set the txMonitor and sigMonitor
	if (connected) {
		txMonitor.set(TransactionMonitor.getSingleton().start(5) as TransactionMonitor);
		sigMonitor.set(SignatureMonitor.getSingleton().start(5) as SignatureMonitor);
	} else {
		txMonitor.set(undefined);
		sigMonitor.set(undefined);
	}
});

export { safe, safeApp, safeInfo, fallbackHandler, txMonitor, sigMonitor };
