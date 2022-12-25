<script lang="ts">
  import "../app.postcss";
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
      Neutralino.events.on('ready', async () => {
        //   let stats = await Neutralino.filesystem.getStats('./app/build/index.html');
        //   console.log(stats)
          let entries = await Neutralino.os.showOpenDialog('Open a file', {
              // defaultPath: '/home/my/directory/',
              filters: [
                  {name: 'Images', extensions: ['jpg', 'png']},
                  {name: 'All files', extensions: ['*']}
              ]
          });
          console.log('You have selected:', entries);
      });
  });
</script>

<slot></slot>
