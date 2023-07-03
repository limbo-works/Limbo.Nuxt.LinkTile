<template>
	<div>
		Subpage

		<LinkTile
			id="link-tile"
			to="/home"
			link-partials-query="#test"
			@hoverupdate="test"
		>
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
	</div>
</template>

<script setup>
function test(e) {
	console.log('test', e);
}
</script>
