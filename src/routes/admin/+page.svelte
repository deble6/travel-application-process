<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let rootEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		const el = rootEl;
		if (!el) return;

		let cancelled = false;
		let unmount: (() => void) | undefined;
		const props = {
			user: data.user,
			applications: data.applications,
			selectedId: data.selectedId,
			form
		};

		import('$lib/react/mountAdmin').then(({ mountAdmin }) => {
			if (cancelled) return;
			unmount = mountAdmin(el, props);
		});

		return () => {
			cancelled = true;
			unmount?.();
		};
	});
</script>

<div bind:this={rootEl}></div>
