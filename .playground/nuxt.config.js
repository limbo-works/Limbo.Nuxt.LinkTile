export default defineNuxtConfig({
	extends: '..',

	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
	},

	vue: {
		compilerOptions: {
			isCustomElement: (tag) => tag === 'limbo-link-tile',
		},
	},
});
