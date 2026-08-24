const DEFAULT_CLICKABLE_ELEMENTS_QUERY =
	'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const LINK_ATTRIBUTE_NAMES = [
	'href',
	'to',
	'target',
	'title',
	'tabindex',
	'download',
	'hreflang',
	'ping',
	'referrerpolicy',
	'rel',
	'type',
	'role',
	'aria-roledescription',
	'aria-label',
	'aria-labelledby',
	'aria-details',
	'aria-describedby',
	'aria-controls',
	'aria-current',
	'aria-disabled',
	'aria-flowto',
	'aria-haspopup',
	'aria-keyshortcuts',
	'aria-live',
	'aria-owns',
] as const;

const OBSERVED_ATTRIBUTE_NAMES = [
	...LINK_ATTRIBUTE_NAMES,
	'link-id',
	'link-partials-query',
	'clickable-elements-query',
] as const;

const STYLE_ID = 'limbo-link-tile-web-component-styles';
const HTMLElementBase = (globalThis.HTMLElement ??
	class {}) as typeof HTMLElement;

type LinkElement = HTMLAnchorElement | HTMLButtonElement;

type MouseEventWithPath = MouseEvent & {
	path?: EventTarget[];
	srcElement?: EventTarget | null;
};

export class LinkTileElement extends HTMLElementBase {
	static get observedAttributes(): string[] {
		return [...OBSERVED_ATTRIBUTE_NAMES];
	}

	#linkElement: LinkElement | null = null;
	#isHovering = false;
	#hasWarnedA11y = false;
	readonly #handleClick: EventListener;
	readonly #handleMousemove: EventListener;
	readonly #handleMouseup: EventListener;
	readonly #handleMouseleave: EventListener;

	constructor() {
		super();

		this.#handleClick = (event) => {
			if (event instanceof MouseEvent) {
				this.#onClick(event);
			}
		};
		this.#handleMousemove = (event) => {
			if (event instanceof MouseEvent) {
				this.#onMousemove(event);
			}
		};
		this.#handleMouseup = (event) => {
			if (event instanceof MouseEvent) {
				this.#onMouseup(event);
			}
		};
		this.#handleMouseleave = (event) => {
			if (event instanceof MouseEvent) {
				this.#onMouseleave(event);
			}
		};
	}

	connectedCallback(): void {
		ensureStyles();
		this.classList.add('c-link-tile');
		this.#renderLinkElement();
		this.addEventListener('mousemove', this.#handleMousemove);
		this.addEventListener('mouseup', this.#handleMouseup);
		this.addEventListener('mouseleave', this.#handleMouseleave);
	}

	disconnectedCallback(): void {
		this.removeEventListener('mousemove', this.#handleMousemove);
		this.removeEventListener('mouseup', this.#handleMouseup);
		this.removeEventListener('mouseleave', this.#handleMouseleave);
	}

	attributeChangedCallback(): void {
		this.#renderLinkElement();
	}

	get linkElement(): LinkElement | null {
		return this.#linkElement;
	}

	#renderLinkElement(): void {
		if (!globalThis.document) {
			return;
		}

		const tagName = this.#isLink ? 'a' : 'button';

		if (this.#linkElement?.tagName.toLowerCase() !== tagName) {
			this.#linkElement?.remove();
			this.#linkElement = document.createElement(tagName);
			this.#linkElement.addEventListener('click', this.#handleClick);
			this.prepend(this.#linkElement);
		}

		this.#linkElement.className = this.#isLink
			? 'c-link-tile__link'
			: 'c-link-tile__link c-link-tile__link--is-button';
		this.#syncLinkAttributes();
	}

	#syncLinkAttributes(): void {
		if (!this.#linkElement) {
			return;
		}

		for (const attributeName of LINK_ATTRIBUTE_NAMES) {
			this.#linkElement.removeAttribute(attributeName);
		}

		const linkId = this.getAttribute('link-id');
		if (linkId) {
			this.#linkElement.setAttribute('id', linkId);
		}

		for (const attributeName of LINK_ATTRIBUTE_NAMES) {
			const value = this.getAttribute(attributeName);
			if (value == null) {
				continue;
			}

			if (attributeName === 'to') {
				if (!this.hasAttribute('href')) {
					this.#linkElement.setAttribute('href', value);
				}
				continue;
			}

			if (attributeName === 'href' && !this.#isLink) {
				continue;
			}

			if (
				[
					'download',
					'hreflang',
					'ping',
					'referrerpolicy',
					'rel',
				].includes(attributeName) &&
				!this.#isLink
			) {
				continue;
			}

			this.#linkElement.setAttribute(attributeName, value);
		}

		if (!this.#isLink && this.#linkElement instanceof HTMLButtonElement) {
			this.#linkElement.setAttribute(
				'type',
				this.getAttribute('type') || 'button'
			);
		}

		if (
			this.isConnected &&
			!this.#hasWarnedA11y &&
			!this.hasAttribute('aria-label') &&
			!this.hasAttribute('aria-labelledby')
		) {
			this.#hasWarnedA11y = true;
			console.warn(
				`[LinkTile - ${this.getAttribute('link-id') || this.id || 'no id'}]`,
				'No a11y label attributes were provided. This may cause accessibility issues. Add either aria-label or aria-labelledby to the component, to avoid any issues.'
			);
		}
	}

	get #isLink(): boolean {
		return this.hasAttribute('to') || this.hasAttribute('href');
	}

	get #clickableElementsQuery(): string {
		return (
			this.getAttribute('clickable-elements-query') ||
			DEFAULT_CLICKABLE_ELEMENTS_QUERY
		);
	}

	get #linkPartialsQuery(): string | null {
		return this.getAttribute('link-partials-query');
	}

	#onClick(event: MouseEvent): void {
		if (event.defaultPrevented) {
			return;
		}

		this.#runWithoutLink(() => {
			const elementStack = [
				...document.elementsFromPoint(event.clientX, event.clientY),
			];
			const target = elementStack[0];

			if (!target) {
				return;
			}

			if (this.#isNestedClickableTarget(target)) {
				return;
			}

			if (!this.#isLinkPartialTarget(target, event)) {
				return;
			}

			this.dispatchEvent(
				new CustomEvent('linktileclick', {
					bubbles: true,
					cancelable: true,
					detail: {
						originalEvent: event,
						linkElement: this.#linkElement,
					},
				})
			);

			if (event.defaultPrevented || event.target === this.#linkElement) {
				return;
			}

			const forwardedEvent = new MouseEvent('click', event);
			this.#linkElement?.dispatchEvent(forwardedEvent);

			event.preventDefault();
			event.stopPropagation();
		});
	}

	#onMousemove(event: MouseEvent): void {
		if (event.defaultPrevented) {
			return;
		}

		this.#runWithoutLink(() => {
			const elementStack = [
				...document.elementsFromPoint(event.clientX, event.clientY),
			];
			const firstElement = elementStack[0];

			if (firstElement && this.#isNestedClickableTarget(firstElement)) {
				this.#setHoverState(false);
				return;
			}

			const partialsQuery = this.#linkPartialsQuery;
			if (partialsQuery) {
				const target = elementStack.find((element) =>
					element.matches(partialsQuery)
				);
				if (!target) {
					this.#setHoverState(false);
					return;
				}
			}

			this.#setHoverState(true);
		});
	}

	#onMouseup(event: MouseEvent): void {
		if (event.defaultPrevented || event.target === this.#linkElement) {
			return;
		}

		if (this.#isNestedClickableTarget(event.target)) {
			return;
		}

		if (!this.#isLinkPartialTarget(event.target, event)) {
			return;
		}

		if (this.#linkElement && event.button === 2) {
			this.#linkElement.style.pointerEvents = 'auto';
			window.requestAnimationFrame(() => {
				this.#linkElement?.style.removeProperty('pointer-events');
			});
		}
	}

	#onMouseleave(event: MouseEvent): void {
		if (event.defaultPrevented) {
			return;
		}

		this.#setHoverState(false);
	}

	#isNestedClickableTarget(target: EventTarget | null): boolean {
		const query = this.#clickableElementsQuery;
		if (!query || !(target instanceof Element)) {
			return false;
		}

		const clickableTarget = target.closest(query);
		return !!clickableTarget && clickableTarget !== this.#linkElement;
	}

	#isLinkPartialTarget(
		target: EventTarget | null,
		event: MouseEvent
	): boolean {
		const partialsQuery = this.#linkPartialsQuery;
		if (!partialsQuery) {
			return true;
		}

		const linkPartials = [...this.querySelectorAll(partialsQuery)];
		if (linkPartials.length === 0) {
			return false;
		}

		if (target instanceof Element && linkPartials.includes(target)) {
			return true;
		}

		return linkPartials.some((partial) => getPath(event).includes(partial));
	}

	#setHoverState(value: boolean): void {
		if (this.#isHovering === value) {
			return;
		}

		this.#isHovering = value;
		const detail = {
			linkElement: this.#linkElement,
			isHovering: this.#isHovering,
		};

		if (value) {
			this.setAttribute('data-hover', 'hover');
			this.dispatchEvent(new CustomEvent('hoverstart', { detail }));
			this.dispatchEvent(new CustomEvent('hoverupdate', { detail }));
			return;
		}

		this.removeAttribute('data-hover');
		this.dispatchEvent(new CustomEvent('hoverupdate', { detail }));
		this.dispatchEvent(new CustomEvent('hoverend', { detail }));
	}

	#runWithoutLink<T>(callback?: () => T): T | undefined {
		let display = 'block';

		if (this.#linkElement) {
			display = this.#linkElement.style.display || 'block';
			this.#linkElement.style.display = 'none';
		}

		const returnValue = callback?.();

		if (this.#linkElement) {
			this.#linkElement.style.display = display;
		}

		return returnValue;
	}
}

export function defineLinkTileElement(
	name = 'limbo-link-tile'
): CustomElementConstructor | undefined {
	if (!globalThis.customElements) {
		return undefined;
	}

	if (!customElements.get(name)) {
		customElements.define(name, LinkTileElement);
	}

	return customElements.get(name);
}

function ensureStyles(): void {
	if (!globalThis.document) {
		return;
	}

	if (document.getElementById(STYLE_ID)) {
		return;
	}

	const style = document.createElement('style');
	style.id = STYLE_ID;
	style.textContent = `
@layer limbo-package {
	:where(.c-link-tile) {
		position: relative;
		display: block;
	}

	:where(.c-link-tile__link) {
		position: absolute;
		z-index: 99999;
		display: block;
		pointer-events: none;
		inset: 0;
		opacity: 0;
	}

	:where(.c-link-tile[data-hover='hover']) {
		cursor: pointer;
	}

	:where(.c-link-tile[data-hover='hover'] .c-link-tile__link) {
		pointer-events: auto;
		cursor: pointer;
	}
}`;

	document.head.append(style);
}

function getPath(
	event: MouseEventWithPath,
	element: Node | null = null,
	path: EventTarget[] = []
): EventTarget[] {
	if (event.path?.length) {
		return event.path;
	}

	if (typeof event.composedPath === 'function') {
		const composedPath = event.composedPath();
		if (composedPath.length) {
			return composedPath;
		}
	}

	const resolvedPath = path;
	const srcElement =
		event.srcElement instanceof Node ? event.srcElement : null;
	let currentElement = element || srcElement || (event.target as Node | null);

	while (currentElement) {
		resolvedPath.push(currentElement);
		currentElement = currentElement.parentNode;
	}

	return resolvedPath;
}
