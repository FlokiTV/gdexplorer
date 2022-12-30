## Creating a Desktop app with Svelte and Neutralino

```
neu create neutralinoApp --template neutralinojs/neutralinojs-zero
cd neutralinoApp
rm -rf www
npm create svelte@latest app
cd app
npm install
```

## Configuring Neutralinojs project

```json
{
  // ...
  "documentRoot": "/app/build/",
  "tokenSecurity": "one-time",
  "exportAuthInfo": true,
  // ...
  "modes": {
    "window": {
      // --- other options
      "icon": "/app/build/favicon.png"
    }
  },
  // ...
  "cli": {
    // --- other options
    "resourcesPath": "/app/build/",
    "clientLibrary": "/app/static/neutralino.js",
    "frontendLibrary": {
      "patchFile": "/app/build/index.html",
      "devUrl": "http://localhost:5173"
    }
  }
}
```
Updating client script
```
neu update
```

### Build front

```
cd app
npm run build
```

### Run Neutralino

```
cd ..
neu run
```

to develop with HRM use this

```
neu run --frontend-lib-dev
```

## Configuring the frontend app

add `@sveltejs/adapter-static` on svelte - https://kit.svelte.dev/docs/adapters#supported-environments-static-sites
install with npm i -D @sveltejs/adapter-static, then add the adapter to your svelte.config.ts...

```ts
// svelte.config.ts
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    alias:{
			"$tmp/*": "./../.tmp/*" //to get auth_info.json in future
		},
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: true
    })
  }
};
```

add Neutralino client script on `src/app.html`

```html
<head>
  ...
  <script src="%sveltekit.assets%/neutralino.js"></script>
  %sveltekit.head%
</head>
```
create on `src` folder a `src/routes/+layout.svelte` to init the Neutralino

```html
<script lang="ts">
  import { dev } from '$app/environment';
  import { onMount } from 'svelte';

  export let data:any; //to get auth_info.json in future
  export const prerender = true; // to generate static site

  onMount(() => {
    /*
      To use HRM with Neutralino API on development
      we need get port and token from .tmp/auth_info.json on +layout.ts
    */
      if(dev){
          // @ts-ignore
          window.NL_PORT = data.port
          // @ts-ignore
          window.NL_TOKEN = data.token
          // @ts-ignore
          window.NL_ARGS = []
      }
      Neutralino.init();
  });
</script>

<slot></slot>
```

and to get the port and token from Neutralino server, create a new file ``src/routes/+layout.ts`

```ts
import { dev } from "$app/environment";

interface IAuthInfo{
    accessToken: string;
    port: number;
}

export const load = async function () {
    /*
      on build for prodution the Neutralino automatic setup
      the variables to acess the API

      window.NL_PORT
      window.NL_TOKEN
      window.NL_ARGS
    */
    if(dev){
        let json = await import(`$tmp/auth_info.json`) as IAuthInfo;
        return {
            port: json.port,
            token: json.accessToken
        }
    }
};
```

## Using Neutralino

```html
<!-- src/+page.svelte -->
<script lang="ts">
  import { browser } from "$app/environment";
	
 	if(browser)
		Neutralino.events.on('ready', async () => {
      await Neutralino.os.showNotification('Hello world', 'It works! Have a nice day');
    })
</script>
```

## Sync Neutralino Store with Svelte Store

create a `store.ts` on `src/lib/`
```ts
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

export const db = (key: string, fallbackValue: any) => {
	let _db = writable(fallbackValue);
	fromNeutralinoStorage(key, fallbackValue).then((value) => {
		_db.set(value);
		toNeutralinoStorage(_db, key);
	});
	return _db;
};
```
using the store

```html
<!-- src/+page.svelte -->
<script lang="ts">
  import { browser } from "$app/environment";
	import { db } from "$lib/store";
 	if(browser)
		Neutralino.events.on('ready', async () => {
      await Neutralino.os.showNotification('Hello world', 'It works! Have a nice day');
    })
  let data = 0
  // object example
  let score = db('score', {
    value: data
  });

  // string example
  let user = db('username', 'teste');

  /*
    Listening the changes
  */
  user.subscribe((value: any) => {
    console.log(value)
  })

  score.subscribe((value: any) => {
    data = value.value
  })

  // saving new value
  const setData = () =>{
    score.set({
      value: data
    })
  }
</script>

<h1>Welcome to SvelteKits</h1>
<input type="text" bind:value={data}>
<button on:click={setData}>set</button>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentations</p>
```