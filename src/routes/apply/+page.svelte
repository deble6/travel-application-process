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
			draft: data.draft,
			applications: data.applications,
			selectedId: data.selectedId,
			view: data.view,
			submitted: data.submitted,
			focusField: data.focusField,
			form
		};

		import('$lib/react/mountApply').then(({ mountApply }) => {
			if (cancelled) return;
			unmount = mountApply(el, props);
		});

		return () => {
			cancelled = true;
			unmount?.();
		};
	});
</script>

<div bind:this={rootEl}></div>
