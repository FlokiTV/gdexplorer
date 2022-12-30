<script>
	import { browser } from '$app/environment';
	import IconBurger from '$lib/icons/iconBurger.svelte';
	let canMoveWin = false;
	let overEl = false;
	let offset = {
		x: 0,
		y: 0
	};

	if (browser)
		Neutralino.events.on('ready', async () => {
			winLoop();
		});
	const winLoop = async () => {
		if (canMoveWin) {
			// let position = await Neutralino.window.getPosition();
			// check if mouse is in navbar area
			let pos = await Neutralino.computer.getMousePosition();
			await Neutralino.window.move(pos.x - offset.x, pos.y - offset.y);
		}
		requestAnimationFrame(winLoop);
	};
	const moveWin = async () => {
		let position = await Neutralino.window.getPosition();
		let mouse = await Neutralino.computer.getMousePosition();
		offset.x = mouse.x - position.x;
		offset.y = mouse.y - position.y;
		if(!overEl) canMoveWin = true;
	};
</script>

<div class="navbar fixed left-0 top-0 w-full bg-base-300 p-1 min-h-0 z-50" on:mousedown={moveWin} on:mouseup={() => (canMoveWin = false)} >
	<div class="flex-none" on:mouseenter={() => overEl = true} on:mouseleave={() => overEl = false}>
		<button class="btn btn-xs btn-square btn-ghost">
			<IconBurger />
		</button>
	</div>
	<button class="btn btn-ghost btn-xs normal-case " on:mouseenter={() => overEl = true} on:mouseleave={() => overEl = false}>GDExplorer</button>
</div>