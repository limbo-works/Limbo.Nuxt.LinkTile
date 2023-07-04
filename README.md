# LinkTile

Vue component for link tiles that accessibly allow for much content including links and buttons.

## Installation

```bash
yarn add @limbo-works/link-tile
```

## Using the wrapper component

Make the component globally usable by extending the layer in `nuxt.config.js`.

```js
export default defineNuxtConfig({
    extends: [
        '@limbo-works/link-tile',
        ...
    ],
    ...
});
```

Then you can use the `LinkTile` component anywhere within that solution:

```html
<!-- As written in Vue -->
<LinkTile id="link-tile" to="/subpage" aria-label="My Link Tile Test">
	    
	<h3>Link Tile Test</h3>
	    
	<ul>
		        
		<li>            <NuxtLink to="#">Hash</NuxtLink>         </li>
		    
	</ul>
</LinkTile>

<!-- As it may appear in the dom -->
<div class="c-link-tile">
	    <a
		href="/subpage"
		class="c-link-tile__link"
		id="link-tile"
		aria-label="My Link Tile Test"
	></a>
	    
	<h3>Link Tile Test</h3>
	    
	<ul>
		        
		<li>            <a href="#">Hash</a>         </li>
		    
	</ul>
</div>
```

Internally the component uses `NuxtLink` for the link, allowing for both internal and external links.

### Extended example

<span class="colour" style="color: rgb(225, 228, 232);"></span>Following is an example where aria and ids has been used to mark up the tile accessibly, and where only the heading and the "read more" text is made clickable parts of the link. We are also hooking into the hover updates.

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
            <li>
                <NuxtLink to="#">Hash</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/home">Another link home</NuxtLink>
            </li>
        </ul>

        <span id="my-unique-id__more">
            Read more
        </span>
    </div>
</LinkTile>
```

[Limbo.Nuxt.Core](<a href="https://github.com/limbo-works/Limbo.Nuxt.Core">https://github.com/limbo-works/Limbo.Nuxt.Core</a>) automatically adds UnoCSS variants for targetting the `data-hover="hover"` attribute, allowing for classes like the `group-data-hover:underline`. `Limbo.Nuxt.Core` also adds a \`group-focus-within:\` variant, which can be similarly useful with this component.

### Props overview

| Prop                                                                                | Description                                                                                          | Default value                                                               | Data type |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------- |
| tag                                                                                 | The element tag to use for the wrapper.                                                              | 'div'                                                                       | String    |
| linkPartialsQuery                                                                   | A CSS query pointing at which elements within the link tile to actually treat as the hoverable link. | undefined                                                                   | String    |
| <span class="colour" style="color:rgb(225, 228, 232)"></span>clickableElementsQuery | A CSS query for filtering all the separately clickable/interactable elements within the link tile.   | 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])' | String    |
| customLinkAttrs                                                                     | An object of attributes to be added directly on the link element.                                    | {}                                                                          | Object    |

Further, there is a bunch of attributes that, when used, will be added to the link instead of the wrapper itself. That goes for following: `id`, `to`, `href`, `target`, `title`, `tabindex`, `download`, `hreflang`, `ping`, `referrerpolicy`, `rel`, `type`, `role`, `aria-roledescription`, `aria-label`, `aria-labelledby`, `aria-details`, `aria-describedby`, `aria-controls`, `aria-current`, `aria-disabled`, `aria-flowto`, `aria-haspopup`, `aria-keyshortcuts`, `aria-live` and `aria-owns`, ie. attributes related to links and aria. Further attributes can be added with `customLinkAttrs`.

### Events overview

| Event        | Description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| @hoverstart  | When hovering of the element – but not any interactive children – begins. |
| @hoverupdate | Whenever the hovering state changes, whether that be beginning or ending. |
| @hoverend    | When hovering of the element – but not any interactive children – ends.   |

Each event includes an object with following data:

| Property    | Description                                                                          |
| ----------- | ------------------------------------------------------------------------------------ |
| linkElement | A reference to the DOM element for the link.                                         |
| isHovering  | A `true`/`false` boolean of whether or not the tile is currently being hovered upon. |

## General notes

-   Feature: When the link is hovered – but not any interactive children – `data-hover="hover"` is added to the wrapping element, allowing for hover-styles to be set.
-   Caveat: As the actual link is hidden, you will not have the link shown at the bottom of the browser window.
-   Caveat: Some link-related shortcuts may not work, as it is not the actual link that's being clicked.

<br>
<br>
