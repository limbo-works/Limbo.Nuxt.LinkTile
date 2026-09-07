<template>
	<div class="page">
		<h1>LinkTile playground</h1>
		<p class="log">Last event: {{ lastEvent || 'none' }}</p>

		<section>
			<h2>1. Basic internal link (to)</h2>
			<LinkTile
				id="basic-internal"
				class="tile"
				to="/subpage"
				aria-label="Go to subpage"
			>
				<h3>Go to subpage</h3>
				<p>The whole tile is clickable.</p>
			</LinkTile>
		</section>

		<section>
			<h2>2. Plain href link</h2>
			<LinkTile
				id="basic-href"
				class="tile"
				href="/subpage"
				title="Rendered as a plain anchor"
				aria-label="Go to subpage using href"
			>
				<h3>href instead of to</h3>
				<p>Renders an anchor with the raw href value.</p>
			</LinkTile>
		</section>

		<section>
			<h2>3. External link (new tab)</h2>
			<LinkTile
				id="external"
				class="tile"
				to="https://nuxt.com"
				external
				target="_blank"
				rel="noopener noreferrer"
				hreflang="en"
				referrerpolicy="no-referrer"
				aria-label="Open nuxt.com in a new tab"
			>
				<h3>nuxt.com</h3>
				<p>external + target + rel + hreflang + referrerpolicy.</p>
			</LinkTile>
		</section>

		<section>
			<h2>4. Click action only (renders a button)</h2>
			<LinkTile
				id="click-action"
				class="tile"
				aria-label="Increment the counter"
				@click="onCounterClick"
			>
				<h3>Click action tile</h3>
				<p>Clicked {{ clickCount }} times.</p>
			</LinkTile>
		</section>

		<section>
			<h2>5. No url and no click action (nothing clickable)</h2>
			<LinkTile id="static" class="tile">
				<h3>Static tile</h3>
				<p>
					No link, no button and no hover state - just the wrapper and
					the slot content.
				</p>
			</LinkTile>
		</section>

		<section>
			<h2>6. Restricted hit area (link-partials-query)</h2>
			<LinkTile
				id="partials"
				class="tile"
				to="/subpage"
				link-partials-query="#partials__title, #partials__more"
				aria-labelledby="partials__title"
				aria-describedby="partials__description"
			>
				<h3 id="partials__title" class="hover-underline">
					Only the title and "Read more" trigger the link
				</h3>
				<p id="partials__description">
					Hovering or clicking this paragraph does nothing.
				</p>
				<span id="partials__more">Read more</span>
			</LinkTile>
		</section>

		<section>
			<h2>7. Nested interactive content (clickable-elements-query)</h2>
			<LinkTile
				id="nested"
				class="tile"
				to="/subpage"
				aria-label="Tile with nested controls"
			>
				<h3>Nested controls keep working</h3>
				<ul>
					<li><NuxtLink to="/subpage">Nested link</NuxtLink></li>
					<li>
						<button type="button" @click="onNestedClick">
							Nested button
						</button>
					</li>
					<li>
						<label>
							Nested input
							<input v-model="nestedValue" type="text" />
						</label>
					</li>
				</ul>
				<p>Input value: {{ nestedValue || '(empty)' }}</p>
			</LinkTile>
		</section>

		<section>
			<h2>8. Hover events and data-hover styling</h2>
			<LinkTile
				id="hover"
				class="tile"
				to="/subpage"
				aria-label="Tile emitting hover events"
				@hoverstart="onHoverstart"
				@hoverupdate="onHoverupdate"
				@hoverend="onHoverend"
			>
				<h3 class="hover-underline">Hover me</h3>
				<p>Hover state: {{ isHovering ? 'hovering' : 'idle' }}</p>
			</LinkTile>
		</section>

		<section>
			<h2>9. Custom wrapper tag and native mouse events</h2>
			<ul class="list">
				<LinkTile
					id="custom-tag"
					tag="li"
					class="tile"
					to="/subpage"
					aria-label="Tile rendered as a list item"
					@mousemove="onMousemove"
					@mouseup="onMouseup"
					@mouseleave="onMouseleave"
				>
					<h3>Rendered as a list item</h3>
					<p>Native mouse handlers run before the tile logic.</p>
				</LinkTile>
			</ul>
		</section>

		<section>
			<h2>10. Custom link attributes and a11y props</h2>
			<LinkTile
				id="custom-attrs"
				class="tile"
				to="/subpage"
				tabindex="0"
				aria-current="page"
				aria-roledescription="Content tile"
				aria-label="Tile with custom link attributes"
				:custom-link-attrs="{ 'data-testid': 'custom-link' }"
			>
				<h3>Custom link attrs</h3>
				<p>
					The inner link gets data-testid="custom-link" plus
					tabindex and aria props.
				</p>
			</LinkTile>
		</section>

		<section>
			<h2>11. Download link</h2>
			<LinkTile
				id="download"
				class="tile"
				href="data:text/plain;charset=utf-8,Hello%20from%20LinkTile"
				download="link-tile.txt"
				aria-label="Download a text file"
			>
				<h3>Download a text file</h3>
				<p>Uses the download attribute on the inner anchor.</p>
			</LinkTile>
		</section>

		<section>
			<h2>12. Link with prevented click</h2>
			<LinkTile
				id="prevented"
				class="tile"
				to="/subpage"
				aria-label="Tile where navigation is prevented"
				@click="onPreventedClick"
			>
				<h3>Navigation prevented</h3>
				<p>
					The click handler calls preventDefault, so the tile never
					navigates.
				</p>
			</LinkTile>
		</section>

		<section>
			<h2>13. Disabled tile</h2>
			<p>
				<button type="button" @click="isDisabled = !isDisabled">
					{{ isDisabled ? 'Enable tile' : 'Disable tile' }}
				</button>
			</p>
			<LinkTile
				id="disabled"
				class="tile"
				to="/subpage"
				:disabled="isDisabled"
				aria-label="Tile that can be disabled"
				@click="onDisabledExampleClick"
			>
				<h3>{{ isDisabled ? 'Disabled' : 'Enabled' }}</h3>
				<p>
					While disabled, no link or button is rendered even though
					both a url and a click action are set.
				</p>
			</LinkTile>
		</section>

		<section>
			<h2>14. Region wrapper (label-wrapper)</h2>
			<LinkTile
				id="region"
				class="tile"
				role="region"
				label-wrapper
				to="/subpage"
				aria-labelledby="region__title"
				aria-describedby="region__description"
			>
				<h3 id="region__title" class="hover-underline">
					Region wrapper
				</h3>
				<p id="region__description">
					The role lands on the wrapper, and both the region and the
					inner link are named by the heading.
				</p>
			</LinkTile>
		</section>
	</div>
</template>

<script setup>
const lastEvent = ref('');
const clickCount = ref(0);
const nestedValue = ref('');
const isHovering = ref(false);
const isDisabled = ref(true);

function log(name) {
	lastEvent.value = `${name} @ ${new Date().toLocaleTimeString()}`;
}

function onCounterClick() {
	clickCount.value++;
	log('click (click action tile)');
}

function onNestedClick() {
	log('click (nested button)');
}

function onHoverstart() {
	isHovering.value = true;
	log('hoverstart');
}

function onHoverupdate(data) {
	isHovering.value = data.isHovering;
	log('hoverupdate');
}

function onHoverend() {
	isHovering.value = false;
	log('hoverend');
}

function onMousemove() {
	log('mousemove');
}

function onMouseup() {
	log('mouseup');
}

function onMouseleave() {
	log('mouseleave');
}

function onPreventedClick(e) {
	e.preventDefault();
	log('click (prevented)');
}

function onDisabledExampleClick() {
	log('click (disabled example tile)');
}
</script>

<style scoped>
.page {
	max-width: 40rem;
	margin: 0 auto;
	padding: 2rem 1rem;
	font-family: system-ui, sans-serif;
}

.log {
	position: sticky;
	top: 0;
	padding: 0.5rem;
	background: #eef;
}

section {
	margin-block: 2rem;
}

.tile {
	padding: 1rem;
	border: 1px solid #ccc;
	border-radius: 0.5rem;
}

.tile[data-hover='hover'] {
	border-color: #06f;
	background: #f2f7ff;
}

.tile[data-hover='hover'] .hover-underline {
	text-decoration: underline;
}

.list {
	margin: 0;
	padding: 0;
	list-style: none;
}
</style>
