# LinkTile

Vue/Nuxt component for accessible link tiles: a pattern where an entire card or block is made clickable while still allowing independent interactive children (links, buttons, inputs) inside it.

## Installation

```bash
yarn add @limbo-works/link-tile
```

## Setup

Extend the layer in your `nuxt.config.js` to make the `LinkTile` component globally available:

```js
export default defineNuxtConfig({
    extends: [
        '@limbo-works/link-tile',
        // ...
    ],
});
```

## Usage

### Basic example

```html
<LinkTile to="/subpage" aria-label="Read more about our product">
    <h3>Our Product</h3>
    <p>A short description of our product.</p>
</LinkTile>
```

The rendered HTML will look like this:

```html
<div class="c-link-tile">
    <a href="/subpage" class="c-link-tile__link" aria-label="Read more about our product"></a>
    <h3>Our Product</h3>
    <p>A short description of our product.</p>
</div>
```

The hidden `<a>` (or `<button>` when no destination is given) sits on top of the tile and handles all pointer and keyboard interaction. Internally, `NuxtLink` is used for the link element, so both internal routes and external URLs are supported.

### Extended example — accessible card with inner links

```html
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

`link-partials-query` restricts the clickable area to only the heading and "Read more" span, so clicking the rest of the card does nothing (useful when only part of the card should be the primary action).

### Button variant

When neither `to` nor `href` is supplied, a `<button>` element is rendered instead of a link:

```html
<LinkTile aria-label="Open modal" @click="openModal">
    <h3>Open the modal</h3>
</LinkTile>
```

## API reference

### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `tag` | `String` | `'div'` | The HTML element tag for the outer wrapper. |
| `to` | `String \| Object` | `undefined` | Destination passed to `NuxtLink` (internal route or URL). When set, renders a `<a>`. |
| `href` | `String \| Object` | `undefined` | Native `href` for the link. Takes precedence over `to` for the `href` attribute. |
| `external` | `Boolean` | `false` | Passed to `NuxtLink` to force external link behaviour. |
| `id` | `String \| Number` | `undefined` | Applied to the inner link/button element (not the wrapper). |
| `target` | `String` | `undefined` | `target` attribute for the link (e.g. `_blank`). |
| `title` | `String` | `undefined` | `title` attribute on the link/button. |
| `tabindex` | `String \| Number` | `undefined` | `tabindex` on the link/button. |
| `download` | `String` | `undefined` | `download` attribute for the link. |
| `hreflang` | `String` | `undefined` | `hreflang` attribute for the link. |
| `ping` | `String` | `undefined` | `ping` attribute for the link. |
| `referrerpolicy` | `String` | `undefined` | `referrerpolicy` attribute for the link. |
| `rel` | `String` | `undefined` | `rel` attribute for the link. |
| `type` | `String` | `undefined` | `type` attribute for the link/button. |
| `role` | `String` | `undefined` | `role` attribute on the link/button. |
| `aria-roledescription` | `String` | `undefined` | `aria-roledescription` on the link/button. |
| `aria-label` | `String` | `undefined` | Accessible name for the link/button. **Provide either this or `aria-labelledby`**. |
| `aria-labelledby` | `String` | `undefined` | ID(s) of elements that label the link/button. |
| `aria-describedby` | `String` | `undefined` | ID(s) of elements that describe the link/button. |
| `aria-details` | `String` | `undefined` | `aria-details` on the link/button. |
| `aria-controls` | `String` | `undefined` | `aria-controls` on the link/button. |
| `aria-current` | `String` | `undefined` | `aria-current` on the link/button. |
| `aria-disabled` | `String` | `undefined` | `aria-disabled` on the link/button. |
| `aria-flowto` | `String` | `undefined` | `aria-flowto` on the link/button. |
| `aria-haspopup` | `String` | `undefined` | `aria-haspopup` on the link/button. |
| `aria-keyshortcuts` | `String` | `undefined` | `aria-keyshortcuts` on the link/button. |
| `aria-live` | `String` | `undefined` | `aria-live` on the link/button. |
| `aria-owns` | `String` | `undefined` | `aria-owns` on the link/button. |
| `linkPartialsQuery` | `String` | `undefined` | CSS selector restricting which areas of the tile trigger the main link/button action on click/hover. When omitted, the whole tile is the clickable area. |
| `clickableElementsQuery` | `String` | `'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'` | CSS selector for interactive children that should be independently clickable without triggering the tile link. |
| `customLinkAttrs` | `Object` | `{}` | Extra attributes to spread directly onto the inner link/button element. |
| `onClick` | `Function` | `undefined` | Custom click handler called before the default link-click behaviour. Calling `event.preventDefault()` inside it will cancel the navigation. |

> **Note:** All attributes **not** listed above fall through to the wrapper element (via Vue's `$attrs`). Attributes that belong on the link — `id`, `to`, `href`, `target`, `title`, `tabindex`, `download`, `hreflang`, `ping`, `referrerpolicy`, `rel`, `type`, `role`, and all `aria-*` attributes — are explicitly forwarded to the inner link/button. Additional attributes can be forwarded with `customLinkAttrs`.

### Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Content of the tile. Can contain any markup, including other links, buttons, and interactive elements. |

### Events

| Event | Description |
| ----- | ----------- |
| `@hoverstart` | Emitted when the pointer enters the tile and is not over an interactive child element. |
| `@hoverupdate` | Emitted whenever the hover state changes (both on start and end). |
| `@hoverend` | Emitted when the pointer leaves the tile or moves over an interactive child element. |

Each hover event receives an object with:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `linkElement` | `HTMLElement` | Reference to the inner link/button DOM element. |
| `isHovering` | `Boolean` | Whether the tile is currently being hovered. |

## Accessibility

The component is built with accessibility in mind:

- **Always provide an accessible label.** Use either `aria-label` (a descriptive string) or `aria-labelledby` (pointing at a visible heading inside the tile). The component will log a warning in development if neither is present.
- **Keyboard navigation.** The hidden link/button is fully keyboard-accessible. Pressing <kbd>Tab</kbd> reaches the tile, and <kbd>Enter</kbd> (link) or <kbd>Enter</kbd>/<kbd>Space</kbd> (button) activates it.
- **Focus visibility.** A `2px` outline is automatically shown on the wrapper whenever the inner link or button receives keyboard focus (`:focus-visible`), so the tile is clearly highlighted for keyboard users without affecting mouse interaction. Override `.c-link-tile:has(.c-link-tile__link:focus-visible)` in your own CSS to customise the focus ring.
- **Independent inner links/buttons.** Interactive children (other `<a>`, `<button>`, etc.) retain their own tab stops and do not trigger the tile's primary action.
- **`aria-current`.** Pass `aria-current="page"` when the tile links to the current page.
- **`aria-disabled`.** Pass `aria-disabled="true"` to indicate a disabled state (pair with `tabindex="-1"` if you want to remove the tile from the tab order).

### Example: accessible card

```html
<LinkTile
    id="article-42"
    to="/articles/42"
    aria-labelledby="article-42__title"
    aria-describedby="article-42__excerpt"
>
    <img src="/img/article-42.jpg" alt="" aria-hidden="true" />
    <h2 id="article-42__title">My article title</h2>
    <p id="article-42__excerpt">A short excerpt from the article…</p>
</LinkTile>
```

Using `aria-labelledby` and `aria-describedby` gives screen-reader users a concise announcement of both the link destination and its description without repeating visible text with a separate `aria-label`.

## Styling

Styles are scoped inside `@layer limbo-package` using low-specificity `:where()` selectors, so your own styles always take precedence without needing `!important`.

### Default classes

| Class | Element |
| ----- | ------- |
| `.c-link-tile` | The outer wrapper element. |
| `.c-link-tile__link` | The hidden inner `<a>` or `<button>`. |
| `.c-link-tile__link--is-button` | Added to the inner element when a `<button>` is rendered (no `to`/`href`). |

### Hover state

When the pointer is over the tile (but not over an interactive child), `data-hover="hover"` is added to the wrapper. You can use this attribute to apply hover styles:

```css
.c-my-element[data-hover='hover'] .c-my-element__title {
    text-decoration: underline;
}
```

[Limbo.Nuxt.Core](https://github.com/limbo-works/Limbo.Nuxt.Core) automatically registers UnoCSS variants for `data-hover="hover"`, enabling utility classes such as `group-data-hover:underline`. It also registers `group-focus-within:` for keyboard-focus styling.

### Overriding default styles

Because the default styles use `:where()`, a plain class selector is sufficient to override them:

```css
/* Increase the z-index of the hidden link */
.c-link-tile__link {
    z-index: 10;
}

/* Custom focus ring colour */
.c-link-tile:has(.c-link-tile__link:focus-visible) {
    outline-color: #0070f3;
    outline-offset: 4px;
}
```

## General notes

- **Hover hint.** When `to` or `href` is set, the browser will display the URL in the status bar on hover, matching what a regular link would show.
- **Caveat: status bar.** Because the actual link element has `pointer-events: none` by default, the URL may not always be shown at the bottom of the browser window until the pointer is actively hovering the tile area.
- **Caveat: link shortcuts.** Some browser shortcuts that rely on right-clicking a visible link (e.g. "Open in new tab") may not work when triggered outside the active hover area. The right-click context menu is available when `pointer-events` are enabled during hover.
