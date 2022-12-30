import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function toNeutralinoStorage(store: any, storageKey: string) {
	if (!browser) return
	store.subscribe((value: any) => {
		let storageValue = typeof value === 'object' ? JSON.stringify(value) : value;
		Neutralino.storage.setData(storageKey, storageValue);
	});
}

async function fromNeutralinoStorage(storageKey: string, fallbackValue: any) {
	if (!browser) return fallbackValue;
	try {
		let storedValue = await Neutralino.storage.getData(storageKey);
		if (storedValue !== 'undefined' && storedValue !== null) {
			return typeof fallbackValue === 'object' ? JSON.parse(storedValue) : storedValue;
		}
	} catch (error) {
		return fallbackValue;
	}
}

export const db = (key: string, fallbackValue: any, cb:any = ()=>{}) => {
	let _db = writable(fallbackValue);
	fromNeutralinoStorage(key, fallbackValue).then((value) => {
		_db.set(value);
		toNeutralinoStorage(_db, key);
		_db.subscribe(cb);
	});
	return _db;
};
