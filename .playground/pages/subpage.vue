<template>
	<div>
		Subpage

		<LinkTile
			id="link-tile"
			to="/home"
			link-partials-query="#testpart"
			@hoverupdate="test"
		>
			<h3 id="testpart">Back home</h3>

			<ul>
				<li>
					<NuxtLink to="#">Hash</NuxtLink>
				</li>
				<li>
					<NuxtLink to="/home">Another link home</NuxtLink>
				</li>
			</ul>
		</LinkTile>
		<LinkTile>
			<h3 id="test">Back home</h3>

			<ul>
				<li>
					<NuxtLink to="#">Hash</NuxtLink>
				</li>
				<li>
					<NuxtLink to="/home">Another link home</NuxtLink>
				</li>
			</ul>
		</LinkTile>
		<LinkTile
			id="my-unique-id"
			class="c-my-element group"
			to="/home"
			aria-labelledby="my-unique-id__title"
			aria-describedby="my-unique-id__description"
			link-partials-query="#my-unique-id__title, #my-unique-id__more"
			@hoverupdate="onHoverupdate"
		>
			<img src="..." alt="A fitting image" />
			<div>
				<h3 id="my-unique-id__title" class="group-data-hover:underline">
					All the way home
				</h3>

				<p id="my-unique-id__description">
					When you find yourself in the deep, it's nice with a way
					home.
				</p>

				<ul>
					<li>
						<NuxtLink to="#">Hash</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/home">Another link home</NuxtLink>
					</li>
				</ul>

				<span id="my-unique-id__more"> Read more </span>
			</div>
		</LinkTile>
	</div>
</template>

<script setup>
function test(e) {
	console.log('test', e);
}
function onHoverupdate(e) {
	console.log('onHoverupdate', e);
}
</script>

<style>
[data-hover='hover'] * {
	color: red !important;
}
</style>
