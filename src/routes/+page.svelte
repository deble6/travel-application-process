<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let rootEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		const el = rootEl;
		const user = data.user;
		const formState = form;
		if (!el) return;

		let cancelled = false;
		let unmount: (() => void) | undefined;

		import('$lib/react/mountLogin').then(({ mountApp }) => {
			if (cancelled) return;
			unmount = mountApp(el, { user, form: formState });
		});

		return () => {
			cancelled = true;
			unmount?.();
		};
	});
</script>

<div bind:this={rootEl}></div>
