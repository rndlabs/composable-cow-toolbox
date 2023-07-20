<script lang="ts">
	import { onMount } from 'svelte';
    import { init, rpc } from '$lib/store/chain';
	import { safe, safeInfo, safeSettings, connected, signerAddress } from '$lib/store/safe';
	import SafeAppsSDK, { type Opts } from '@safe-global/safe-apps-sdk';
	import Address from '../Address.svelte';
	import JazzIcon from './JazzIcon.svelte';

	let pending = false;

	// Attempt to connect to the safe
	const connect = async () => {
		pending = true;
		try {
			const opts: Opts = {
				allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
				debug: false
			};

			const _safe = new SafeAppsSDK(opts);

			// set the settings on the safe for off-chain signing
			const currentSettings = await _safe.eth.setSafeSettings([{
				offChainSigning: true
			}]);

			safe.set(_safe);
            safeSettings.set(currentSettings);

            // spawn a listener for the safe info
            // this is used to determine when to init the chain
            const unsubscriber = safeInfo.subscribe((info) => {
                if (info) {
                    init(info.chainId)
                }
            });

            // create a timer to watch for the safe to be connected
            // if it doesn't connect within 5 seconds, throw an error
            setTimeout(() => {
                if (!$connected) {
                    throw new Error('Safe not connected');
                }
                unsubscriber();
            }, 5000);
		} catch (e) {
			console.error(e);
		}
		pending = false;
	};

	const disconnect = async () => {};

    onMount(async () => {
        await connect();
    });
</script>

<div class="top-bar-connect">
    {#if $connected && $signerAddress}
      <div class="address-container">
        <div class="jazzicon-container">
          <JazzIcon size={24} address={$signerAddress} />
        </div>
        <Address address={$signerAddress} />
      </div>
    {:else}
      <button class="connect-button" on:click={() => connect()}>Connect Safe</button>
    {/if}
  </div>
  
  <style>
    .top-bar-connect {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
    }
  
    .address-container {
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-radius: 20px;
      padding: 5px 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
  
    .jazzicon-container {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 8px;
    }
  
    .jazzicon-container svg {
      width: 100%;
      height: 100%;
    }
  
    .address-text {
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
    .connect-button {
      background-color: #007bff;
      color: #ffffff;
      border: none;
      border-radius: 20px;
      padding: 8px 15px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
  
    .connect-button:hover {
      background-color: #0056b3;
    }
  </style>