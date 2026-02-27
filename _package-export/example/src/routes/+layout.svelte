<script>
	import '../app.css';
	import { Agentation } from 'agentation-svelte';
	import { browser } from '$app/environment';

	let { children } = $props();
</script>

{@render children()}

{#if browser}
	<Agentation />
{/if}
