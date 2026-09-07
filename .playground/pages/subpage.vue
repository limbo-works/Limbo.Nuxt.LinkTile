<template>
	<div class="page">
		<h1>LinkTile edge cases</h1>
		<p><NuxtLink to="/home">Back to the main playground</NuxtLink></p>
		<p class="log">Last event: {{ lastEvent || 'none' }}</p>

		<section>
			<h2>1. Click action only, restricted hit area</h2>
			<LinkTile
				id="edge-click-partials"
				class="tile"
				link-partials-query="#edge-click-partials__title"
				aria-labelledby="edge-click-partials__title"
				@click="onToggleClick"
			>
				<h3 id="edge-click-partials__title" class="hover-underline">
					Toggle me (title only)
				</h3>
				<p>Toggled: {{ isToggled ? 'on' : 'off' }}</p>
				<ul>
					<li><NuxtLink to="/home">Link home</NuxtLink></li>
				</ul>
			</LinkTile>
		</section>

		<section>
			<h2>2. Link and click action combined</h2>
			<LinkTile
				id="edge-link-and-click"
				class="tile"
				to="/home"
				aria-label="Go home and count the click"
				@click="onCombinedClick"
			>
				<h3>Counts the click, then navigates</h3>
				<p>Clicks registered: {{ clickCount }}</p>
			</LinkTile>
		</section>

		<section>
			<h2>3. Url added at runtime</h2>
			<p>
				<button type="button" @click="hasUrl = !hasUrl">
					{{ hasUrl ? 'Remove url' : 'Add url' }}
				</button>
			</p>
			<LinkTile
				id="edge-dynamic"
				class="tile"
				:to="hasUrl ? '/home' : undefined"
				aria-label="Tile whose url can be toggled"
			>
				<h3>{{ hasUrl ? 'Linking home' : 'Not clickable' }}</h3>
				<p>
					Without a url and without a click action, no link or button
					is rendered and hover state stays off.
				</p>
			</LinkTile>
		</section>

		<section>
			<h2>4. Click action added at runtime</h2>
			<p>
				<button type="button" @click="hasClickAction = !hasClickAction">
					{{
						hasClickAction
							? 'Remove click action'
							: 'Add click action'
					}}
				</button>
			</p>
			<LinkTile
				id="edge-dynamic-click"
				class="tile"
				aria-label="Tile whose click action can be toggled"
				:on-click="hasClickAction ? onDynamicClick : null"
			>
				<h3>
					{{ hasClickAction ? 'Renders a button' : 'Renders nothing' }}
				</h3>
				<p>Dynamic clicks: {{ dynamicClickCount }}</p>
			</LinkTile>
		</section>

		<section>
			<h2>5. Content-heavy tile with an image</h2>
			<LinkTile
				id="edge-rich"
				class="tile"
				to="/home"
				aria-labelledby="edge-rich__title"
				aria-describedby="edge-rich__description"
				link-partials-query="#edge-rich__title, #edge-rich__more"
				@hoverupdate="onHoverupdate"
			>
				<div class="thumb" aria-hidden="true"></div>
				<div>
					<h3 id="edge-rich__title" class="hover-underline">
						All the way home
					</h3>
					<p id="edge-rich__description">
						When you find yourself in the deep, it's nice with a way
						home.
					</p>
					<ul>
						<li><NuxtLink to="#">Hash</NuxtLink></li>
						<li>
							<NuxtLink to="/home">Another link home</NuxtLink>
						</li>
					</ul>
					<span id="edge-rich__more">Read more</span>
				</div>
			</LinkTile>
		</section>
	</div>
</template>

<script setup>
const lastEvent = ref('');
const isToggled = ref(false);
const clickCount = ref(0);
const dynamicClickCount = ref(0);
const hasUrl = ref(false);
const hasClickAction = ref(false);

function log(name) {
	lastEvent.value = `${name} @ ${new Date().toLocaleTimeString()}`;
}

function onToggleClick() {
	isToggled.value = !isToggled.value;
	log('click (toggle tile)');
}

function onCombinedClick() {
	clickCount.value++;
	log('click (link + action tile)');
}

function onDynamicClick() {
	dynamicClickCount.value++;
	log('click (dynamic action tile)');
}

function onHoverupdate(data) {
	log(`hoverupdate (${data.isHovering ? 'hovering' : 'idle'})`);
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

.thumb {
	display: block;
	width: 3rem;
	height: 3rem;
	margin-bottom: 0.5rem;
	background: #dde6f5;
	border-radius: 0.25rem;
}
</style>
