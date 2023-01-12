<script lang="ts">
  import "../app.postcss";
	import Navbar from '$lib/components/navbar.svelte';
  import { dev } from '$app/environment';
  import { onMount } from 'svelte';

  export let data:any;
  export const prerender = true;

  onMount(() => {
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

<Navbar />
<slot></slot>
