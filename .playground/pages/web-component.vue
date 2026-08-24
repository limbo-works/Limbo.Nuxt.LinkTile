<template>
	<main class="web-component-page">
		<h1>Web component examples</h1>

		<section class="example-grid">
			<limbo-link-tile
				class="example-tile"
				href="/subpage"
				aria-labelledby="web-component-basic-title"
				@hoverupdate="onHoverupdate"
				@linktileclick="onLinktileclick"
			>
				<p class="example-label">Anchor mode</p>
				<h2 id="web-component-basic-title">Open the subpage</h2>
				<p>
					The full tile forwards clicks to an injected anchor overlay.
				</p>
				<a href="#nested-link">Nested links keep native behavior</a>
			</limbo-link-tile>

			<limbo-link-tile
				class="example-tile"
				link-partials-query="#web-component-partial-title, #web-component-partial-more"
				aria-labelledby="web-component-partial-title"
			>
				<p class="example-label">Button mode with partial hit area</p>
				<h2 id="web-component-partial-title">
					Only selected parts click
				</h2>
				<p>
					The configured title and call-to-action are treated as the
					tile activation area.
				</p>
				<button type="button" @click="buttonClicks++">
					Nested button clicks: {{ buttonClicks }}
				</button>
				<span id="web-component-partial-more" class="example-link-text">
					Read more
				</span>
			</limbo-link-tile>

			<limbo-link-tile
				class="example-tile"
				to="/home"
				link-id="web-component-to-link"
				aria-label="Home through to attribute"
				target="_self"
			>
				<p class="example-label">To attribute mode</p>
				<h2>Home route</h2>
				<p>
					The web component maps <code>to</code> to the overlay anchor
					<code>href</code> for framework-free usage.
				</p>
			</limbo-link-tile>
		</section>

		<p class="event-log">Last event: {{ lastEvent }}</p>
	</main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const buttonClicks = ref(0);
const lastEvent = ref('none');

onMounted(async () => {
	const { defineLinkTileElement } =
		await import('../../web-components/LinkTile.mts');

	defineLinkTileElement();
});

function onHoverupdate(event: CustomEvent<{ isHovering: boolean }>) {
	lastEvent.value = event.detail.isHovering
		? 'hoverupdate on'
		: 'hoverupdate off';
}

function onLinktileclick() {
	lastEvent.value = 'linktileclick';
}
</script>

<style>
.web-component-page {
	max-width: 72rem;
	padding: 2rem;
	margin: 0 auto;
	font-family: ui-sans-serif, system-ui, sans-serif;
}

.example-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	gap: 1rem;
}

.example-tile {
	min-height: 13rem;
	padding: 1.25rem;
	border: 1px solid #ccd3dd;
	border-radius: 0.5rem;
	background: #f8fafc;
}

.example-tile[data-hover='hover'] {
	border-color: #255c99;
	background: #eef6ff;
}

.example-label {
	margin: 0 0 0.75rem;
	font-size: 0.875rem;
	font-weight: 700;
	color: #255c99;
	text-transform: uppercase;
}

.example-tile h2 {
	margin: 0 0 0.75rem;
}

.example-link-text {
	display: inline-block;
	margin-top: 1rem;
	font-weight: 700;
	color: #255c99;
	text-decoration: underline;
}

.event-log {
	margin-top: 1.5rem;
	font-weight: 700;
}
</style>
