# LinkTile

Vue component for link tiles that accessibly allow for much content including links and buttons.

## Installation

``` bash
yarn add @limbo-works/link-tile
```

## Using the wrapper component

Install the component by extending the layer in `nuxt.config.js`.

``` js
export default defineNuxtConfig({
    extends: [
        '@limbo-works/link-tile',
        ...
    ],
    ...
});
```

Then you can use the `LinkTile` component anywhere within that solution:

``` html
<!-- As written in Vue -->
<LinkTile
    id="link-tile"
    to="/subpage"
    aria-label="My Link Tile Test"
>
    <h3>Link Tile Test</h3>
    <ul>
        <li>
            <NuxtLink to="#">Hash</NuxtLink>
        </li>
    </ul>
</LinkTile>

<!-- As it may appear in the dom -->
<div class="c-link-tile">
    <a href="/subpage" class="c-link-tile__link" id="link-tile" aria-label="My Link Tile Test"></a>
    <h3>Link Tile Test</h3>
    <ul>
        <li>
            <a href="#">Hash</a>
        </li>
    </ul>
</div>
```

### Props overview

| Prop | Description | Default value | Data type |
| ---- | ----------- | ------------- | --------- |
| tag | The element tag to use for the wrapper. | 'div' | String |
<br>
### Events overview

| Event | Description |
| ----- | ----------- |
| @init | An event triggering only once whenever the component is initiated. If immediate search is enabled, this will be right before the first search request is made, else it will be emitted from the component's created event. The only event data attached to the event, is the value `true`. This event may be used to only insert the search filters on the page after the search is ready, to make sure the set values are in sync. |
| @update | Whenever a search update happens (a new or appended search is started or the results have come in), this event will trigger with an object of properties attached as the event data. These properties will be layed out below. |
| @error | If a request results in an error, this event will trigger with the error object attached as the event data. |

The update event is the most important event here, mirroring the same data you will have accessible through the slot props. Following are the properties you will receive through the event:

| Property | Description |
| -------- | ----------- |
| state | A state object giving information about the current state of the LimboSearch component through the properties `hasFetchedOnce`, `hasMoreItems`, `isAppend`, `isLoading` and `isInitiated`. All of these are boolean values, except if doing a grouped search, then `hasMoreItems` is an object with keys for each group id (which will then have a boolean value).<br><ul><li>`hasFetchedOnce`: Whether the LimboSearch component has executed at least one search.</li><li>`hasMoreItems`: Whether there is more items to be fetched.</li><li>`isAppend`: Whether the current search is an appending search ("Fetch more/all").</li><li>`isLoading`: Whether the current search is currently fetching.</li><li>`isInitiated`: Wheter the search component has been initiated. This property will be false until either the `created`-event has run, or (if immediate search is turned on) until right before the first request is made.&nbsp;This property may be used to only insert the search filters or other elements on the page after the search is ready, to make sure the set values are in sync.</li></ul> |
| query | Object containing the `parameters`-property, which in turn contains the current search parameters in object form. |
| data | The `.data` fetched from the endpoint (after potentially being transformed by the `searchResponseTransformerMethod` or merged with previous data through the `dataMergerMethod`). Typically an array. |
| facets | The `.facets` fetched from the endpoint (if any, and after potential transformations). |
| meta | The `.meta` fetched from the endpoint (if any, and after potential transformations). |
| misc | The `.misc` fetched from the endpoint (if any, and after potential transformations). |
| action | An object of available functions to execute.<br><br><ul><li>`submit()`: A method to submit a new search as-is.</li><li>`fetchMore([id],[amount])`: A method to fetch more results of the current search. If an amount isn't specified, the configured amount will be used. If doing grouped searches, the group id of the group to fetch more from should be supplied as the first argument.</li><li>`fetchAll([id])`: A method to fetch all the remaining results of the current search.&nbsp;If doing grouped searches, the group id of the group to fetch all from should be supplied.</li></ul> |
| error | If the last request ended with an error, the error object will exist on this property. |

## General notes

* Caveat: As the actual link is hidden, you will not have the link shown at the bottom of the browser window.
* Caveat: Some link-related shortcuts may not work, as it is not the actual link that's being clicked.

<br>
<br>
