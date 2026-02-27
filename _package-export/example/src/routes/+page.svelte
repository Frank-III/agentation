<script>
	let count = $state(0);
</script>

<svelte:head>
	<title>Agentation — Svelte Example</title>
</svelte:head>

<main>
	<header>
		<h1>/agentation</h1>
		<p class="tagline">Point at problems, not code</p>
	</header>

	<section>
		<h2>What is this?</h2>
		<p>
			<strong>Agentation</strong> (agent + annotation) is a dev tool that lets you annotate elements
			on your webpage and generate structured feedback for AI coding agents.
		</p>
		<p>
			Click elements, select text, add notes, and paste the output into Claude Code, Cursor,
			or any agent that has access to your codebase.
		</p>
	</section>

	<section>
		<h2>Quick start</h2>
		<ol>
			<li>Click the toolbar icon in the bottom-right corner to activate</li>
			<li><strong>Hover</strong> over elements to see their names highlighted</li>
			<li><strong>Click</strong> any element to add an annotation</li>
			<li>Write your feedback and click <strong>Add</strong></li>
			<li>Click the copy icon to get formatted markdown</li>
			<li>Paste into your agent</li>
		</ol>
	</section>

	<section class="demo-section">
		<h2>Try it</h2>
		<p>The toolbar is active on this page. Try annotating these elements:</p>

		<div class="demo-elements">
			<div class="button-group">
				<button class="demo-button primary" onclick={() => count++}>
					Clicked {count} times
				</button>
				<button class="demo-button secondary" onclick={() => (count = 0)}>
					Reset
				</button>
			</div>

			<input type="text" class="demo-input" placeholder="Try selecting this text..." />

			<div class="demo-card">
				<h3>Example Card</h3>
				<p>
					Click on this card or select this text to create an annotation.
					The output will include the element path and your feedback.
				</p>
			</div>

			<div class="demo-card accent">
				<h3>Another Component</h3>
				<p>Drag to select multiple elements at once for a multi-select annotation.</p>
			</div>
		</div>
	</section>

	<section class="demo-section">
		<h2>Animation pause demo</h2>
		<p>Click the pause button in the toolbar to freeze this animation:</p>
		<div class="animation-demo">
			<div class="progress-bar-track">
				<div class="progress-bar"></div>
			</div>
			<div class="spinner"></div>
		</div>
	</section>

	<footer>
		<p>agentation-svelte · Svelte 5</p>
	</footer>
</main>

<style>
	main {
		max-width: 640px;
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}

	header {
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		color: #4c74ff;
		margin-bottom: 0.25rem;
	}

	.tagline {
		color: rgba(255, 255, 255, 0.5);
		font-size: 1.1rem;
	}

	section {
		margin-bottom: 2.5rem;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		color: #fff;
	}

	p {
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 0.75rem;
	}

	ol {
		padding-left: 1.25rem;
		color: rgba(255, 255, 255, 0.7);
	}

	li {
		margin-bottom: 0.375rem;
	}

	.demo-elements {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.button-group {
		display: flex;
		gap: 0.5rem;
	}

	.demo-button {
		padding: 0.625rem 1.25rem;
		border-radius: 8px;
		border: none;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: filter 0.15s;
	}

	.demo-button:hover {
		filter: brightness(0.9);
	}

	.demo-button.primary {
		background: #4c74ff;
		color: white;
	}

	.demo-button.secondary {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.8);
	}

	.demo-input {
		padding: 0.625rem 0.875rem;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background: rgba(255, 255, 255, 0.05);
		color: #fff;
		font-size: 0.875rem;
		outline: none;
		transition: border-color 0.15s;
	}

	.demo-input:focus {
		border-color: #4c74ff;
	}

	.demo-input::placeholder {
		color: rgba(255, 255, 255, 0.35);
	}

	.demo-card {
		padding: 1.25rem;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.demo-card.accent {
		border-color: rgba(76, 116, 255, 0.3);
		background: rgba(76, 116, 255, 0.05);
	}

	.demo-card h3 {
		font-size: 1rem;
		font-weight: 600;
		color: #fff;
		margin-bottom: 0.5rem;
	}

	.demo-card p {
		font-size: 0.875rem;
		margin-bottom: 0;
	}

	.animation-demo {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.progress-bar-track {
		flex: 1;
		height: 6px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		width: 40%;
		background: #4c74ff;
		border-radius: 3px;
		animation: progress 2s ease-in-out infinite;
	}

	@keyframes progress {
		0% { width: 0%; }
		50% { width: 100%; }
		100% { width: 0%; }
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-top-color: #4c74ff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	footer {
		margin-top: 4rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.8125rem;
	}
</style>
