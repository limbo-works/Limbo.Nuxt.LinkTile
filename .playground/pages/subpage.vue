<template>
	<main class="detail-page">
		<nav class="top-nav" aria-label="Playground navigation">
			<NuxtLink to="/home">Back to home examples</NuxtLink>
		</nav>

		<header class="detail-header">
			<p class="detail-kicker">Interaction checks</p>
			<h1>Tile behavior under real page pressure.</h1>
			<p>
				Use these examples to verify hover state, nested controls,
				external links, and the declarative shadow DOM overlay while
				moving around the page.
			</p>
		</header>

		<section
			class="comparison-grid"
			aria-label="LinkTile behavior examples"
		>
			<LinkTile
				id="shadow-nested-link"
				use-shadow-dom
				tag="article"
				class="detail-card detail-card--nested-shadow"
				to="/home"
				aria-labelledby="shadow-nested-title"
				aria-describedby="shadow-nested-description"
			>
				<p class="detail-card__eyebrow">
					Shadow DOM plus nested controls
				</p>
				<h2 id="shadow-nested-title">
					Nested actions stay outside the tile link
				</h2>
				<p id="shadow-nested-description">
					The card routes home, but the slotted button and child link
					should keep their own actions.
				</p>
				<div class="control-row">
					<button
						class="inline-button"
						type="button"
						@click="incrementShadowNestedCount"
					>
						Shadow nested button {{ shadowNestedCount }}
					</button>
					<a
						class="inline-anchor"
						href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#declaratively_with_html"
						target="_blank"
						rel="noopener noreferrer"
					>
						MDN DSD
					</a>
				</div>
			</LinkTile>

			<LinkTile
				id="external-shadow-link"
				use-shadow-dom
				tag="article"
				class="detail-card detail-card--shadow"
				href="https://nuxt.com/docs/getting-started/introduction"
				target="_blank"
				rel="noopener noreferrer"
				aria-labelledby="external-shadow-title"
				aria-describedby="external-shadow-description"
			>
				<p class="detail-card__eyebrow">Shadow DOM plus href</p>
				<h2 id="external-shadow-title">External documentation tile</h2>
				<p id="external-shadow-description">
					The internal anchor is rendered inside the declarative
					shadow root, while the slotted content remains available to
					the page.
				</p>
				<span class="detail-card__action">Open Nuxt docs</span>
			</LinkTile>

			<LinkTile
				id="blank-route-shadow-link"
				use-shadow-dom
				tag="article"
				class="detail-card detail-card--blank-route"
				to="/home"
				target="_blank"
				aria-labelledby="blank-route-shadow-title"
				aria-describedby="blank-route-shadow-description"
			>
				<p class="detail-card__eyebrow">Shadow DOM plus target blank</p>
				<h2 id="blank-route-shadow-title">
					Internal route in a new tab
				</h2>
				<p id="blank-route-shadow-description">
					The generated shadow-root link points to a Nuxt route and
					carries target="_blank" for shortcut and tab behavior
					checks.
				</p>
				<span class="detail-card__action">Open home separately</span>
			</LinkTile>

			<LinkTile
				id="partial-shadow-link"
				use-shadow-dom
				tag="article"
				class="detail-card detail-card--partial"
				to="/home"
				aria-labelledby="partial-shadow-title"
				aria-describedby="partial-shadow-description"
				link-partials-query="#partial-shadow-title, #partial-shadow-action"
			>
				<p class="detail-card__eyebrow">Shadow DOM plus partials</p>
				<h2 id="partial-shadow-title">
					Only the headline and CTA route home
				</h2>
				<p id="partial-shadow-description">
					This paragraph should not activate the tile. It is a quick
					check that light DOM partial selectors still work with
					slotted content.
				</p>
				<span id="partial-shadow-action" class="detail-card__action">
					Return to examples
				</span>
			</LinkTile>

			<LinkTile
				id="shadow-button-tile-button"
				use-shadow-dom
				tag="article"
				class="detail-card detail-card--shadow-button"
				aria-labelledby="shadow-button-title"
				aria-describedby="shadow-button-description"
				:on-click="incrementShadowButtonCount"
			>
				<p class="detail-card__eyebrow">Shadow DOM button mode</p>
				<h2 id="shadow-button-title">Shadow-root button overlay</h2>
				<p id="shadow-button-description">
					No to or href is provided, so the internal control is a
					shadow DOM button instead of a link.
				</p>
				<p class="status-pill" aria-live="polite">
					Shadow button clicked {{ shadowButtonCount }}
				</p>
			</LinkTile>

			<LinkTile
				id="nested-control-link"
				tag="article"
				class="detail-card detail-card--controls"
				to="/home"
				aria-labelledby="nested-control-title"
				aria-describedby="nested-control-description"
			>
				<p class="detail-card__eyebrow">Nested controls</p>
				<h2 id="nested-control-title">
					Interactive children stay interactive
				</h2>
				<p id="nested-control-description">
					The nested button updates local state instead of triggering
					the tile navigation.
				</p>
				<button
					class="inline-button"
					type="button"
					@click="incrementNestedCount"
				>
					Nested button clicked {{ nestedCount }}
				</button>
			</LinkTile>

			<LinkTile
				id="custom-query-link"
				tag="article"
				class="detail-card detail-card--query"
				to="/home"
				aria-labelledby="custom-query-title"
				aria-describedby="custom-query-description"
				clickable-elements-query="[data-native-control]"
			>
				<p class="detail-card__eyebrow">Custom clickable query</p>
				<h2 id="custom-query-title">Custom native control region</h2>
				<p id="custom-query-description">
					Only elements marked with data-native-control opt out of
					tile navigation in this example.
				</p>
				<button
					class="native-control"
					type="button"
					data-native-control
					@click="toggleNativeRegion"
					@keydown.enter.prevent="toggleNativeRegion"
					@keydown.space.prevent="toggleNativeRegion"
				>
					Native region is
					{{ nativeRegionActive ? 'active' : 'inactive' }}
				</button>
			</LinkTile>
		</section>
	</main>
</template>

<script setup lang="ts">
const nestedCount = ref(0);
const nativeRegionActive = ref(false);
const shadowNestedCount = ref(0);
const shadowButtonCount = ref(0);

function incrementShadowNestedCount() {
	shadowNestedCount.value += 1;
}

function incrementShadowButtonCount() {
	shadowButtonCount.value += 1;
}

function incrementNestedCount() {
	nestedCount.value += 1;
}

function toggleNativeRegion() {
	nativeRegionActive.value = !nativeRegionActive.value;
}
</script>

<style>
.detail-page {
	width: min(1080px, calc(100% - 32px));
	margin: 0 auto;
	padding: 40px 0 64px;
	font-family:
		Avenir Next,
		Avenir,
		sans-serif;
	color: #1f2933;
}

.top-nav {
	margin-bottom: 36px;
}

.top-nav a,
.detail-card__action {
	color: #0f766e;
	font-weight: 800;
	text-decoration-thickness: 2px;
	text-underline-offset: 4px;
}

.detail-header {
	max-width: 760px;
	margin-bottom: 28px;
}

.detail-kicker,
.detail-card__eyebrow {
	margin: 0 0 10px;
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0;
	text-transform: uppercase;
	color: #9f1239;
}

.detail-header h1 {
	margin: 0;
	font-family: Fraunces, Charter, 'Bitstream Charter', 'Sitka Text', serif;
	font-size: clamp(2.2rem, 6vw, 4.8rem);
	line-height: 0.98;
}

.detail-header p {
	max-width: 660px;
	font-size: 1.08rem;
	line-height: 1.65;
	color: #52606d;
}

.comparison-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 18px;
}

.detail-card {
	min-height: 250px;
	padding: 24px;
	border: 1px solid rgba(31, 41, 51, 0.14);
	border-left: 8px solid #0f766e;
	border-radius: 8px;
	background:
		linear-gradient(
			145deg,
			rgba(255, 255, 255, 0.96),
			rgba(255, 251, 235, 0.88)
		),
		repeating-linear-gradient(
			90deg,
			rgba(31, 41, 51, 0.04) 0 1px,
			transparent 1px 18px
		);
	box-shadow: 0 18px 46px rgba(31, 41, 51, 0.08);
	transition:
		transform 180ms ease,
		box-shadow 180ms ease,
		border-color 180ms ease;
}

.detail-card[data-hover='hover'] {
	transform: translateY(-3px);
	box-shadow: 0 24px 56px rgba(31, 41, 51, 0.14);
}

.detail-card--shadow {
	border-left-color: #92400e;
}

.detail-card--partial {
	border-left-color: #4338ca;
}

.detail-card--controls {
	border-left-color: #0e7490;
}

.detail-card--query {
	border-left-color: #be123c;
}

.detail-card--nested-shadow {
	border-left-color: #0f766e;
}

.detail-card--blank-route {
	border-left-color: #7c2d12;
}

.detail-card--shadow-button {
	border-left-color: #a21caf;
}

.detail-card h2 {
	margin: 0 0 12px;
	font-family: Fraunces, Charter, 'Bitstream Charter', 'Sitka Text', serif;
	font-size: 1.75rem;
	line-height: 1.08;
}

.detail-card p:not(.detail-card__eyebrow) {
	margin: 0 0 18px;
	line-height: 1.55;
	color: #52606d;
}

.control-row {
	position: relative;
	z-index: 100000;
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.native-control {
	position: relative;
	z-index: 100000;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 42px;
	padding: 8px 14px;
	border: 1px solid rgba(15, 118, 110, 0.32);
	border-radius: 8px;
	background: #fff1f2;
	color: #9f1239;
	font-weight: 800;
	cursor: pointer;
}

.inline-button,
.inline-anchor,
.status-pill {
	position: relative;
	z-index: 100000;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 42px;
	padding: 8px 14px;
	border: 1px solid rgba(15, 118, 110, 0.32);
	border-radius: 8px;
	background: #ecfeff;
	color: #155e75;
	font-weight: 800;
	cursor: pointer;
}

.inline-anchor {
	background: #fef3c7;
	color: #92400e;
}

.status-pill {
	background: #fae8ff;
	color: #86198f;
	cursor: default;
}

@media (max-width: 780px) {
	.detail-page {
		padding-top: 28px;
	}

	.comparison-grid {
		grid-template-columns: 1fr;
	}
}
</style>
