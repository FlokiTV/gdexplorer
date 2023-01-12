<script lang="ts">
	import IconError from '$lib/icons/iconError.svelte';

	import { browser } from '$app/environment';
	import GDExplorer from '$lib/GDExplorer';
	import { db } from '$lib/store';

	let error = '';
	let loaded = false;
	let lastFile = '';
	let _lastFile = db('lastFile', '', (value: any) => {
		lastFile = value;
	});
	let resourceList: any; //files used in games
	let folderList: any = [];

	const openProject = async () => {
		let res = await GDExplorer.pickGameFile();
		if (res) await readGameFile();
	};
	const loadLast = async () => {
		GDExplorer.gameFilePath = lastFile;
		GDExplorer.setupPaths();
		await readGameFile();
	};
	const readGameFile = async () => {
		let load = await GDExplorer.readGameFile();
		if ('error' in load) return (error = load.error);
		error = '';
		_lastFile.set(GDExplorer.gameFilePath);
		loaded = true;
		/**
		 * TODO:
		 * 	- add layouts
		 * 	- add externalLayout
		 * 	- add eventsFunctionsExtensions
		 * */
		resourceList = GDExplorer.getData().resources.resources;
	};
	/**
	 * TODO:
	 * 	- extract function to GDExplorer class
	 * */
	const resCleaner = async () => {
		// let res = await GDExplorer.readFullFolder();
		// folderList = res;
		let res = await GDExplorer.resourceCleaner();
		folderList = res;
		return;
	};
	const doCancel = () => {
		loaded = false;
		folderList = [];
		resourceList = [];
	};
	if (browser)
		Neutralino.events.on('ready', async () => {
			console.log('Neutralino ready', lastFile);
		});
</script>

{#if !loaded}
	<div class="p-2">
		<div class="flex justify-center space-x-2">
			<span class="text-lg font-bold"> Load project </span>
			<button class="btn btn-success btn-sm" on:click={openProject}>Open</button>
		</div>
		{#if lastFile}
			<div class="w-[500px] m-auto mt-2">
				<span class="text-lg font-bold">Last project </span>
				<button class="btn w-full mt-2" on:click={loadLast}>{lastFile}</button>
			</div>
		{/if}
		{#if error}
			<div class="alert alert-error shadow-lg flex-1 w-[300px] m-auto mt-2">
				<div>
					<IconError />
					<span>{error}</span>
				</div>
			</div>
		{/if}
	</div>
{:else if GDExplorer.getData()}
	<div class="p-2">
		<div class="flex justify-center space-x-2">
			<span class="text-lg font-bold">Project information</span>
		</div>
		<div class="w-[500px] m-auto my-2">
			<div class="flex">
				<span class="text-lg font-bold w-[100px]">name</span>
				{GDExplorer.getProperties().name}
			</div>
			<div class="flex">
				<span class="text-lg font-bold w-[100px]">package</span>
				{GDExplorer.getProperties().packageName}
			</div>
			<div class="flex">
				<span class="text-lg font-bold w-[100px]">version</span>
				{GDExplorer.getProperties().version}
			</div>
			<div class="flex">
				<span class="text-lg font-bold w-[100px]">folder</span>
				{GDExplorer.getProperties().folderProject}
			</div>
			<div class="flex">
				<span class="text-lg font-bold w-[100px]">resources</span>
				{GDExplorer.getData().resources.resources.length}
			</div>
		</div>
		<div class="flex w-[500px] m-auto space-x-2 my-2 flex-wrap">
			<button class="btn btn-sm btn-info" on:click={doCancel}>back</button>
			<!-- <a class="btn btn-sm btn-info" href="file-explorer">File Explorer</a> -->
			<button
				class="btn btn-sm btn-success"
				on:click={resCleaner}>Resource Cleaner</button
			>
			{#if folderList.length}
				<button class="btn btn-sm btn-error" on:click={() => GDExplorer.moveToTrash(folderList).then(resCleaner)}>move to trash</button>
			{/if}

			<!-- <button class="btn btn-sm btn-info">Objects</button>
			<button class="btn btn-sm btn-info">Groups</button>
			<button class="btn btn-sm btn-info">Layouts</button>
			<button class="btn btn-sm btn-info">Extensions</button>
			<button class="btn btn-sm btn-info">Events</button> -->
		</div>
		{#if folderList.length}
			<div class="overflow-x-auto">
				<table class="table table-compact w-full">
					<thead>
						<tr>
							<th />
							<th>Path</th>
							<th>File</th>
						</tr>
					</thead>
					<tbody>
						{#each folderList as folder}
							{#each folder.files as file}
								<tr>
									<th />
									<th>{folder.entry}</th>
									<th>
										{file.entry}
									</th>
								</tr>
							{/each}
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
{/if}
