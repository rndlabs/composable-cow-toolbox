import { derived, writable } from 'svelte/store';

export const error = writable<any>(undefined);
export const hasError = derived(error, ($error) => {
	return $error !== undefined;
});

export const setError = (e: any) => {
	error.set(e);
};
export const clearError = () => {
	error.set(undefined);
};
