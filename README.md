# LinkTile

Vue component for accessible link tiles with rich content, including nested links and controls.

## Installation

```bash
yarn add @limbo-works/link-tile
```

## Setup

Extend the layer in your Nuxt app:

```ts
export default defineNuxtConfig({
	extends: ['@limbo-works/link-tile'],
});
```

## Basic usage

```vue
<LinkTile id="link-tile" to="/subpage" aria-label="My Link Tile Test">
	<h3>Link Tile Test</h3>
	<ul>
		<li><NuxtLink to="#">Hash</NuxtLink></li>
	</ul>
</LinkTile>
```

Rendered DOM shape:

```html
<div class="c-link-tile">
	<a
		href="/subpage"
		class="c-link-tile__link"
		id="link-tile"
		aria-label="My Link Tile Test"
	></a>
	<h3>Link Tile Test</h3>
	<ul>
		<li><a href="#">Hash</a></li>
	</ul>
</div>
```

Internally, the component uses NuxtLink, supporting both internal and external navigation.

## Extended example

This example uses ARIA IDs for accessible labeling and restricts click/hit-area behavior to selected parts of the tile:

```vue
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
			When you find yourself in the deep, it's nice with a way home.
		</p>
		<ul>
			<li><NuxtLink to="#">Hash</NuxtLink></li>
			<li><NuxtLink to="/home">Another link home</NuxtLink></li>
		</ul>
		<span id="my-unique-id__more">Read more</span>
	</div>
</LinkTile>
```

Limbo.Nuxt.Core adds UnoCSS variants for data-hover="hover", enabling classes like group-data-hover:underline.

## Props

| Prop                   | Description                                                                      | Default                                                                     | Type                        |
| ---------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------- |
| tag                    | Wrapper element tag.                                                             | 'div'                                                                       | string                      |
| linkPartialsQuery      | CSS selector for elements that should count as link-active areas.                | undefined                                                                   | string                      |
| clickableElementsQuery | CSS selector for nested interactive elements that should keep native behavior.   | 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])' | string                      |
| customLinkAttrs        | Extra attributes merged directly into the generated link or button element.      | {}                                                                          | Record<string, unknown>     |
| onClick                | Optional click hook executed before onLinkTileClick and synthetic link dispatch. | null                                                                        | (event: MouseEvent) => void |

The following attributes are forwarded to the internal link or button instead of the wrapper:

id, to, href, external, target, title, tabindex, download, hreflang, ping, referrerpolicy, rel, type, role, aria-roledescription, aria-label, aria-labelledby, aria-details, aria-describedby, aria-controls, aria-current, aria-disabled, aria-flowto, aria-haspopup, aria-keyshortcuts, aria-live, and aria-owns.

## Link and button modes

- Link mode: if either to or href is provided, LinkTile renders a NuxtLink overlay.
- Button mode: if neither to nor href is provided, LinkTile renders a button overlay so tile interaction still works consistently.

## Events

| Event        | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| @hoverstart  | Fires when tile hover starts, excluding nested interactive children. |
| @hoverupdate | Fires whenever the hover state changes.                              |
| @hoverend    | Fires when tile hover ends.                                          |

Each hover event payload includes:

| Property    | Type                | Description                         |
| ----------- | ------------------- | ----------------------------------- |
| linkElement | HTMLElement \| null | Internal overlay element reference. |
| isHovering  | boolean             | Current hover state.                |

## Click pipeline

When a valid tile click occurs:

1. Your onClick prop callback runs first.
2. The internal onLinkTileClick utility hook runs next.
3. If still not prevented, the component dispatches a synthetic click event on the internal overlay link or button.

This ordering lets you intercept, augment, or cancel click behavior predictably.

## Notes

- When the tile is in active hover mode, data-hover="hover" is set on the wrapper element.
- The component excludes nested interactive elements from tile-level hover and click handling by default.
- Right mouse button handling temporarily enables pointer events on the internal overlay to improve context-menu behavior.
- Because navigation is proxied through an overlay element, browser URL preview and some link-specific shortcuts may not always behave exactly like a directly clicked anchor.
