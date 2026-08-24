<template>
	<main class="playground-page">
		<header class="playground-header">
			<p class="playground-kicker">LinkTile playground</p>
			<h1>Accessible tile links with real nested content.</h1>
			<p>
				These examples cover the default overlay, declarative shadow
				DOM, partial hit areas, nested interactive elements, and button
				mode.
			</p>
		</header>

		<section class="example-grid" aria-label="LinkTile examples">
			<LinkTile
				id="default-tile-link"
				tag="article"
				class="example-card example-card--river"
				to="/subpage"
				aria-labelledby="default-tile-title"
				aria-describedby="default-tile-description"
			>
				<div class="example-card__media" aria-hidden="true">Route</div>
				<div class="example-card__body">
					<p class="example-card__eyebrow">Default overlay</p>
					<h2 id="default-tile-title">Internal NuxtLink tile</h2>
					<p id="default-tile-description">
						The whole card navigates to the subpage while nested
						links keep their own behavior.
					</p>
					<ul class="inline-links">
						<li>
							<NuxtLink to="#default-details">Hash link</NuxtLink>
						</li>
						<li>
							<NuxtLink to="/subpage"
								>Direct subpage link</NuxtLink
							>
						</li>
					</ul>
				</div>
			</LinkTile>

			<LinkTile
				id="shadow-tile-link"
				use-shadow-dom
				tag="article"
				class="example-card example-card--shadow"
				to="/subpage"
				aria-labelledby="shadow-tile-title"
				aria-describedby="shadow-tile-description"
			>
				<div class="example-card__media" aria-hidden="true">Shadow</div>
				<div class="example-card__body">
					<p class="example-card__eyebrow">Declarative shadow DOM</p>
					<h2 id="shadow-tile-title">Shadow-root overlay</h2>
					<p id="shadow-tile-description">
						The generated link lives in a declarative shadow root,
						and this content is projected through a native slot.
					</p>
					<span class="pill">use-shadow-dom</span>
				</div>
			</LinkTile>

			<LinkTile
				id="partial-tile-link"
				tag="article"
				class="example-card example-card--partial"
				to="/subpage"
				aria-labelledby="partial-tile-title"
				aria-describedby="partial-tile-description"
				link-partials-query="#partial-tile-title, #partial-tile-cta"
			>
				<div class="example-card__media" aria-hidden="true">Area</div>
				<div class="example-card__body">
					<p class="example-card__eyebrow">Partial hit area</p>
					<h2 id="partial-tile-title">
						Only selected elements activate
					</h2>
					<p id="partial-tile-description">
						Click the title or the read-more text. The paragraph
						itself is intentionally not a tile link target.
					</p>
					<span id="partial-tile-cta" class="text-link"
						>Read the example</span
					>
				</div>
			</LinkTile>

			<LinkTile
				id="button-tile-button"
				tag="article"
				class="example-card example-card--button"
				aria-labelledby="button-tile-title"
				aria-describedby="button-tile-description"
				:on-click="registerButtonClick"
			>
				<div class="example-card__media" aria-hidden="true">Action</div>
				<div class="example-card__body">
					<p class="example-card__eyebrow">Button mode</p>
					<h2 id="button-tile-title">No route, still interactive</h2>
					<p id="button-tile-description">
						When neither to nor href is provided, LinkTile renders
						an internal button overlay.
					</p>
					<p class="status-line" aria-live="polite">
						{{ buttonStatus }}
					</p>
				</div>
			</LinkTile>
		</section>

		<section id="default-details" class="notes-panel">
			<h2>Playground notes</h2>
			<p>
				Hover each tile to see the wrapper receive data-hover. The
				visible content stays normal page markup, including when the
				overlay is moved into declarative shadow DOM.
			</p>
		</section>
	</main>
</template>

<script setup lang="ts">
const buttonClicks = ref(0);
const buttonStatus = computed(() =>
	buttonClicks.value === 0
		? 'Click this tile to trigger the button overlay.'
		: `Button tile clicked ${buttonClicks.value} time${buttonClicks.value === 1 ? '' : 's'}.`
);

function registerButtonClick() {
	buttonClicks.value += 1;
}
</script>

<style>
:root {
	font-family: Fraunces, Charter, 'Bitstream Charter', 'Sitka Text', serif;
	color: #1f2933;
	background: #f7efe3;
}

body {
	margin: 0;
	background:
		linear-gradient(120deg, rgba(234, 179, 8, 0.16), transparent 34rem),
		linear-gradient(230deg, rgba(20, 184, 166, 0.14), transparent 36rem),
		#f7efe3;
}

button,
a {
	font: inherit;
}

.playground-page {
	width: min(1120px, calc(100% - 32px));
	margin: 0 auto;
	padding: 56px 0;
}

.playground-header {
	max-width: 760px;
	margin-bottom: 32px;
}

.playground-kicker,
.example-card__eyebrow {
	margin: 0 0 10px;
	font-family:
		Avenir Next,
		Avenir,
		sans-serif;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0;
	text-transform: uppercase;
	color: #0f766e;
}

.playground-header h1 {
	max-width: 780px;
	margin: 0;
	font-size: clamp(2.4rem, 7vw, 5.4rem);
	line-height: 0.95;
}

.playground-header p:last-child {
	max-width: 620px;
	font-size: 1.1rem;
	line-height: 1.65;
}

.example-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 18px;
}

.example-card {
	position: relative;
	display: grid;
	grid-template-columns: minmax(112px, 0.45fr) minmax(0, 1fr);
	min-height: 270px;
	overflow: hidden;
	border: 1px solid rgba(31, 41, 51, 0.14);
	border-radius: 8px;
	background: #fffdf8;
	box-shadow: 0 18px 44px rgba(31, 41, 51, 0.08);
	transition:
		transform 180ms ease,
		box-shadow 180ms ease,
		border-color 180ms ease;
}

.example-card[data-hover='hover'] {
	transform: translateY(-3px);
	border-color: rgba(15, 118, 110, 0.5);
	box-shadow: 0 24px 54px rgba(31, 41, 51, 0.14);
}

.example-card__media {
	display: grid;
	align-items: end;
	padding: 18px;
	font-family:
		Avenir Next,
		Avenir,
		sans-serif;
	font-size: 0.86rem;
	font-weight: 800;
	color: rgba(255, 255, 255, 0.92);
	background:
		linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.3)),
		repeating-linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.18) 0 1px,
			transparent 1px 12px
		),
		#0f766e;
}

.example-card--river .example-card__media {
	background-color: #155e75;
}

.example-card--shadow .example-card__media {
	background-color: #92400e;
}

.example-card--partial .example-card__media {
	background-color: #4338ca;
}

.example-card--button .example-card__media {
	background-color: #be123c;
}

.example-card__body {
	display: grid;
	align-content: start;
	gap: 12px;
	padding: 24px;
}

.example-card h2,
.notes-panel h2 {
	margin: 0;
	font-size: 1.55rem;
	line-height: 1.1;
}

.example-card p,
.notes-panel p {
	margin: 0;
	font-family:
		Avenir Next,
		Avenir,
		sans-serif;
	line-height: 1.55;
	color: #52606d;
}

.inline-links {
	position: relative;
	z-index: 100000;
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	padding: 0;
	margin: 8px 0 0;
	font-family:
		Avenir Next,
		Avenir,
		sans-serif;
	list-style: none;
}

.inline-links a,
.text-link {
	color: #0f766e;
	font-weight: 700;
	text-decoration-thickness: 2px;
	text-underline-offset: 4px;
}

.pill,
.status-line {
	justify-self: start;
	padding: 6px 10px;
	border-radius: 999px;
	font-family:
		Avenir Next,
		Avenir,
		sans-serif;
	font-size: 0.85rem;
	font-weight: 700;
	background: #e0f2fe;
	color: #075985;
}

.notes-panel {
	max-width: 740px;
	padding-top: 32px;
}

@media (max-width: 820px) {
	.playground-page {
		padding: 32px 0;
	}

	.example-grid {
		grid-template-columns: 1fr;
	}

	.example-card {
		grid-template-columns: 1fr;
	}

	.example-card__media {
		min-height: 120px;
	}
}
</style>
