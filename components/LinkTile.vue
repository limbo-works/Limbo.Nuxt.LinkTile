<template>
	<Component
		:is="tag"
		ref="wrapperElementRef"
		:role="role"
		class="c-link-tile"
		v-bind="{
			...$attrs,
			'data-allow-mismatch': useShadowDom ? 'children' : undefined,
			onClick: onWrapperClick,
			onAuxclick: onWrapperAuxclick,
			onFocusin,
			onFocusout,
			onMouseup,
			onMousemove,
			onMouseleave,
		}"
	>
		<Component :is="'template'" v-if="useShadowDom" shadowrootmode="open">
			<Component :is="'style'">{{ shadowRootStyles }}</Component>
			<NuxtLink
				v-if="to || href"
				:id="id != null ? String(id) : undefined"
				ref="linkElementRef"
				:role="role"
				class="c-link-tile__link"
				v-bind="linkBindings"
			></NuxtLink>
			<button
				v-else
				:id="id != null ? String(id) : undefined"
				ref="linkElementRef"
				:role="role"
				class="c-link-tile__link c-link-tile__link--is-button"
				v-bind="linkBindings as any"
			></button>
			<Component :is="'slot'"></Component>
		</Component>
		<template v-else>
			<NuxtLink
				v-if="to || href"
				:id="id != null ? String(id) : undefined"
				ref="linkElementRef"
				:role="role"
				class="c-link-tile__link"
				v-bind="linkBindings"
			></NuxtLink>
			<button
				v-else
				:id="id != null ? String(id) : undefined"
				ref="linkElementRef"
				:role="role"
				class="c-link-tile__link c-link-tile__link--is-button"
				v-bind="linkBindings as any"
			></button>
		</template>
		<slot></slot>
	</Component>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import getLinkTileLinkComponent from '../utils/getLinkTileLinkComponent';
import onLinkTileClick from '../utils/onLinkTileClick';

type LinkLikeTarget = string | Record<string, unknown>;
type LinkElementRef = HTMLElement | ComponentPublicInstance | null;

interface HoverData {
	linkElement: HTMLElement | null;
	isHovering: boolean;
}

type LinkTileAttrs = Record<string, unknown> & {
	onMousemove?: Function;
	onMouseup?: Function;
	onMouseleave?: Function;
	onFocusin?: Function;
	onFocusout?: Function;
	onClick?: Function;
	onAuxclick?: Function;
	onHoverstart?: Function;
	onHoverupdate?: Function;
	onHoverend?: Function;
};

interface LinkTileProps {
	tag?: string;
	useShadowDom?: boolean;
	linkPartialsQuery?: string;
	clickableElementsQuery?: string;
	to?: LinkLikeTarget;
	external?: boolean;
	id?: string | number;
	href?: LinkLikeTarget;
	target?: string;
	title?: string;
	tabindex?: string | number;
	download?: string;
	hreflang?: string;
	ping?: string;
	referrerpolicy?: string;
	rel?: string;
	type?: string;
	role?: string;
	ariaRoledescription?: string;
	ariaLabel?: string;
	ariaLabelledby?: string;
	ariaDetails?: string;
	ariaDescribedby?: string;
	ariaControls?: string;
	ariaCurrent?: string;
	ariaDisabled?: string;
	ariaFlowto?: string;
	ariaHaspopup?: string;
	ariaKeyshortcuts?: string;
	ariaLive?: string;
	ariaOwns?: string;
	customLinkAttrs?: Record<string, unknown>;
	onClick?: Function | null;
}

type MouseEventWithPath = MouseEvent & {
	path?: EventTarget[];
	srcElement?: EventTarget | null;
};

const wrapperElementRef = ref<LinkElementRef>(null);
const linkElementRef = ref<LinkElementRef>(null);
let isProxyingLinkClick = false;

function toHtmlElement(element: LinkElementRef): HTMLElement | null {
	if (!element) {
		return null;
	}

	if ('$el' in element) {
		const vueElement = element.$el;
		return vueElement instanceof HTMLElement ? vueElement : null;
	}

	return element instanceof HTMLElement ? element : null;
}

const wrapperElement = computed(() => toHtmlElement(wrapperElementRef.value));
const linkElement = computed(() => toHtmlElement(linkElementRef.value));

defineOptions({
	inheritAttrs: false,
});

const NuxtLink = getLinkTileLinkComponent();
const router = useRouter();

const attrs = useAttrs() as LinkTileAttrs;
const props = withDefaults(defineProps<LinkTileProps>(), {
	tag: 'div',
	disabled: false,
	labelWrapper: false,
	clickableElementsQuery:
		'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
	customLinkAttrs: () => ({}),
	onClick: null,
});

const shadowRootStyles = `
:host {
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

:host([data-hover='hover']) {
	cursor: pointer;
}

:host([data-focus='focus']) {
	outline: 2px solid currentColor;
	outline-offset: 4px;
}

:host([data-hover='hover']) .c-link-tile__link {
	pointer-events: auto;
	cursor: pointer;
}
`;

// Data
const hoverData: HoverData = {
	get linkElement() {
		return linkElement.value;
	},
	isHovering: false,
};

const isLink = computed(() => !props.disabled && (!!props.to || !!props.href));
const hasClickAction = computed(
	() => !props.disabled && typeof props.onClick === 'function'
);
const isInteractive = computed(() => isLink.value || hasClickAction.value);

// Regions (role="region", article, section, etc.) need their own accessible name
const wrapperLabelBindings = computed(() => {
	if (!props.labelWrapper) {
		return {};
	}

	return {
		'aria-label': props.ariaLabel,
		'aria-labelledby': props.ariaLabelledby,
		'aria-describedby': props.ariaDescribedby,
	};
});

// A warning of missing a11y attributes if needed
if (isInteractive.value && !props.ariaLabel && !props.ariaLabelledby) {
	console.warn(
		`[LinkTile - ${props.id ? '#' + props.id : 'no id'}]`,
		'No a11y label attributes were provided. This may cause accessibility issues. Add either aria-label or aria-labelledby to the component, to avoid any issues.'
	);
}

if (import.meta.client) {
	watchPostEffect(() => {
		if (props.useShadowDom) {
			syncShadowRoot();
		}
	});
}

const onWrapperClick = (e: MouseEventWithPath) => {
	handleWrapperClick(e);
};

const onWrapperAuxclick = (e: MouseEventWithPath) => {
	attrs.onAuxclick?.(e);
	if (e.button !== 1) {
		return;
	}

	handleWrapperClick(e, { forceNewContext: true });
};

function handleWrapperClick(
	e: MouseEventWithPath,
	options: { forceNewContext?: boolean } = {}
) {
	if (e.defaultPrevented) {
		return;
	}
	const el = wrapperElement.value;

	if (!el || isLinkElementClick(e)) {
		return;
	}

	const shouldProxyClick = runWithoutLink(() => {
		const pathElements = getElementPath(e);
		const pointElements = getPointElements(e);
		const elementStack = [...pointElements, ...pathElements];

		const target = elementStack[0];
		if (!target) {
			return false;
		}

		// Cancel if an inner button is targeted
		if (
			props.clickableElementsQuery &&
			elementStack.some((element) =>
				isElementInQuery(element, props.clickableElementsQuery, el)
			)
		) {
			return false;
		}

		// Cancel if element should not be treated as a link
		if (props.linkPartialsQuery) {
			const linkPartials = [
				...el.querySelectorAll(props.linkPartialsQuery),
			];
			if (linkPartials.length === 0) {
				return false;
			}

			if (!linkPartials.includes(target)) {
				let isPartial = false;
				linkPartials.forEach((partial) => {
					isPartial =
						partial &&
						(getPath(e).includes(partial) ||
							(target ? partial.contains(target) : false))
							? true
							: isPartial;
				});

				if (!isPartial) {
					return false;
				}
			}
		}

		return true;
	});

	if (!shouldProxyClick) {
		return;
	}

	// We still only want a custom event to happen if we actually click as per configured
	props.onClick?.(e); // Run the usual event, if such is defined
	attrs.onClick?.(e);
	if (e.defaultPrevented) {
		return;
	}

	// We run any onLinkTileClick handler, if default's aren't prevented
	onLinkTileClick(e);
	if (e.defaultPrevented) {
		return;
	}

	activateLinkElement(e, options);

	// Cancel/stop everything just to be sure
	e.preventDefault();
	e.stopPropagation();
}

const onLinkClick = (e: MouseEventWithPath) => {
	if (e.defaultPrevented || isProxyingLinkClick) {
		return;
	}

	props.onClick?.(e);
	attrs.onClick?.(e);
	if (e.defaultPrevented) {
		return;
	}

	onLinkTileClick(e);
};

const linkBindings = computed(() => {
	const navigationBindings: Record<string, unknown> = {};
	if (props.href) {
		navigationBindings.href = props.href;
		navigationBindings.external = props.external;
	} else if (isLink.value) {
		navigationBindings.to = props.to;
		navigationBindings.external = props.external;
	}

	return {
		...navigationBindings,
		target: isLink.value ? props.target : null,
		title: props.title,
		tabindex: props.tabindex,
		download: isLink.value ? props.download : null,
		hreflang: isLink.value ? props.hreflang : null,
		ping: isLink.value ? props.ping : null,
		referrerpolicy: isLink.value ? props.referrerpolicy : null,
		rel: isLink.value ? props.rel : null,
		type: isLink.value ? props.type : (props.type ?? 'button'),
		'aria-roledescription': props.ariaRoledescription,
		'aria-label': props.ariaLabel,
		'aria-labelledby': props.ariaLabelledby,
		'aria-details': props.ariaDetails,
		'aria-describedby': props.ariaDescribedby,
		'aria-controls': props.ariaControls,
		'aria-current': props.ariaCurrent,
		'aria-disabled': props.ariaDisabled,
		'aria-flowto': props.ariaFlowto,
		'aria-haspopup': props.ariaHaspopup,
		'aria-keyshortcuts': props.ariaKeyshortcuts,
		'aria-live': props.ariaLive,
		'aria-owns': props.ariaOwns,
		onClick: onLinkClick,
		...(props.customLinkAttrs || {}),
	};
});

function isLinkElementClick(event: MouseEventWithPath) {
	const element = linkElement.value;
	return !!element && getPath(event).includes(element);
}

function getPointElements(event: MouseEvent) {
	if (event.clientX === 0 && event.clientY === 0) {
		return [];
	}

	return [...document.elementsFromPoint(event.clientX, event.clientY)];
}

function getElementPath(event: MouseEventWithPath) {
	return getPath(event).filter(
		(target): target is Element => target instanceof Element
	);
}

function isElementInQuery(
	element: Element,
	query: string,
	container: HTMLElement
) {
	const target = element.closest(query);
	return !!target && target !== container && container.contains(target);
}

function activateLinkElement(
	event: MouseEventWithPath,
	options: { forceNewContext?: boolean } = {}
) {
	const element = linkElement.value;
	if (!element) {
		return;
	}

	if (element instanceof HTMLAnchorElement) {
		if (shouldOpenInNewContext(event, element, options)) {
			openAnchorInNewContext(element, event);
			return;
		}
	}

	isProxyingLinkClick = true;
	try {
		element.click?.();
	} finally {
		isProxyingLinkClick = false;
	}
}

function shouldOpenInNewContext(
	event: MouseEventWithPath,
	anchor: HTMLAnchorElement,
	options: { forceNewContext?: boolean }
) {
	return (
		options.forceNewContext ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey ||
		(anchor.target && anchor.target !== '_self')
	);
}

function openAnchorInNewContext(
	anchor: HTMLAnchorElement,
	event: MouseEventWithPath
) {
	const target =
		anchor.target && !event.metaKey && !event.ctrlKey
			? anchor.target
			: '_blank';
	const features = anchor.relList.contains('noreferrer')
		? 'noopener,noreferrer'
		: anchor.relList.contains('noopener')
			? 'noopener'
			: undefined;

	window.open(anchor.href, target, features);
}

function syncShadowRoot() {
	const host = wrapperElement.value;
	if (!host) {
		return;
	}

	const root = host.shadowRoot || host.attachShadow({ mode: 'open' });
	const link = getShadowLinkElement(root);
	const style = getShadowStyleElement(root);
	const slot = root.querySelector('slot') || document.createElement('slot');

	style.textContent = shadowRootStyles;
	applyShadowLinkAttributes(link);
	link.onclick = (event) => onLinkClick(event as MouseEventWithPath);
	link.onfocus = () => setFocusState(true);
	link.onblur = () => setFocusState(false);

	root.append(style, link, slot);
	linkElementRef.value = link;
}

function getShadowLinkElement(root: ShadowRoot) {
	const tag = isLink.value ? 'a' : 'button';
	const existingElement = root.querySelector('.c-link-tile__link');
	if (existingElement?.tagName.toLowerCase() === tag) {
		return existingElement as HTMLElement;
	}

	existingElement?.remove();
	return document.createElement(tag);
}

function getShadowStyleElement(root: ShadowRoot) {
	const existingElement = root.querySelector('style');
	return existingElement || document.createElement('style');
}

function applyShadowLinkAttributes(element: HTMLElement) {
	const attributes: Record<string, unknown> = {
		id: props.id != null ? String(props.id) : undefined,
		role: props.role,
		target: isLink.value ? props.target : undefined,
		title: props.title,
		tabindex: props.tabindex,
		download: isLink.value ? props.download : undefined,
		hreflang: isLink.value ? props.hreflang : undefined,
		ping: isLink.value ? props.ping : undefined,
		referrerpolicy: isLink.value ? props.referrerpolicy : undefined,
		rel: isLink.value ? props.rel : undefined,
		type: props.type,
		'aria-roledescription': props.ariaRoledescription,
		'aria-label': props.ariaLabel,
		'aria-labelledby': props.ariaLabelledby,
		'aria-details': props.ariaDetails,
		'aria-describedby': props.ariaDescribedby,
		'aria-controls': props.ariaControls,
		'aria-current': props.ariaCurrent,
		'aria-disabled': props.ariaDisabled,
		'aria-flowto': props.ariaFlowto,
		'aria-haspopup': props.ariaHaspopup,
		'aria-keyshortcuts': props.ariaKeyshortcuts,
		'aria-live': props.ariaLive,
		'aria-owns': props.ariaOwns,
		...(props.customLinkAttrs || {}),
	};

	if (element instanceof HTMLAnchorElement) {
		attributes.href = getShadowLinkHref();
	} else {
		element.className = 'c-link-tile__link c-link-tile__link--is-button';
	}

	if (element instanceof HTMLAnchorElement) {
		element.className = 'c-link-tile__link';
	}

	Array.from(element.attributes).forEach((attribute) => {
		if (attribute.name !== 'class') {
			element.removeAttribute(attribute.name);
		}
	});

	Object.entries(attributes).forEach(([name, value]) => {
		if (name.startsWith('on') || value == null || value === false) {
			return;
		}

		element.setAttribute(name, value === true ? '' : String(value));
	});
}

function getShadowLinkHref() {
	if (props.href) {
		return String(props.href);
	}

	if (!props.to) {
		return undefined;
	}

	return router.resolve(props.to as any).href;
}

// Methods
const onMousemove = (e: MouseEventWithPath) => {
	attrs.onMousemove?.(e);
	if (!isInteractive.value || e.defaultPrevented) {
		return;
	}

	const el = wrapperElement.value;
	el &&
		runWithoutLink(() => {
			const elementStack = [
				...document.elementsFromPoint(e.clientX, e.clientY),
			];
			const firstElement = elementStack[0];

			// Cancel if we're atop a clickable element
			if (props.clickableElementsQuery) {
				if (firstElement) {
					const target = firstElement.closest(
						props.clickableElementsQuery
					);
					if (target) {
						setHoverState(false);
						return;
					}
				}
			}

			// Cancel if element should not be treated as a link
			const partialsQuery = props.linkPartialsQuery;
			if (partialsQuery) {
				const target = elementStack.find((element) =>
					element.matches(partialsQuery)
				);
				if (!target) {
					setHoverState(false);
					return;
				}
			}

			// Else finally be true
			setHoverState(true);
		});
};

const onMouseup = (e: MouseEventWithPath) => {
	attrs.onMouseup?.(e); // Run the usual event, if such is defined
	if (!isInteractive.value || e.defaultPrevented) {
		return;
	}

	const el = wrapperElement.value;

	// Cancel if the actual link is targeted to avoid infinite recursion
	if (!el || e.target === linkElement.value) {
		return;
	}

	// Cancel if an inner button is targeted
	if (
		props.clickableElementsQuery &&
		e.target instanceof Element &&
		[...el.querySelectorAll(props.clickableElementsQuery)].includes(
			e.target
		)
	) {
		return;
	}

	// Cancel if element should not be treated as a link
	if (props.linkPartialsQuery) {
		const linkPartials = [...el.querySelectorAll(props.linkPartialsQuery)];
		if (linkPartials.length === 0) {
			return;
		}
		if (
			!(e.target instanceof Element) ||
			!linkPartials.includes(e.target)
		) {
			let isPartial = false;
			linkPartials.forEach((partial) => {
				isPartial = getPath(e).includes(partial) ? true : isPartial;
			});

			if (!isPartial) {
				return;
			}
		}
	}

	// Make context menu available when mouseup on right button
	if (linkElement.value && e.button === 2) {
		linkElement.value.style.pointerEvents = 'auto';
		window.requestAnimationFrame(() => {
			linkElement.value?.style.removeProperty('pointer-events');
		});
	}
};

const onMouseleave = (e: MouseEvent) => {
	attrs.onMouseleave?.(e);
	if (!isInteractive.value || e.defaultPrevented) {
		return;
	}

	setHoverState(false);
};

const onFocusin = (e: FocusEvent) => {
	attrs.onFocusin?.(e);
	if (e.defaultPrevented) {
		return;
	}

	setFocusState(true);
};

const onFocusout = (e: FocusEvent) => {
	attrs.onFocusout?.(e);
	if (e.defaultPrevented) {
		return;
	}

	const nextTarget = e.relatedTarget;
	if (
		nextTarget instanceof Node &&
		wrapperElement.value?.contains(nextTarget)
	) {
		return;
	}

	setFocusState(false);
};

function setFocusState(value: boolean) {
	if (value) {
		wrapperElement.value?.setAttribute('data-focus', 'focus');
	} else {
		wrapperElement.value?.removeAttribute('data-focus');
	}
}

function setHoverState(value: boolean) {
	if (hoverData.isHovering !== value) {
		hoverData.isHovering = value;
		if (wrapperElement.value) {
			if (value) {
				wrapperElement.value.setAttribute('data-hover', 'hover');
				linkElement.value?.style.setProperty('pointer-events', 'auto');
				attrs.onHoverstart?.({ ...hoverData });
				attrs.onHoverupdate?.({ ...hoverData });
			} else {
				wrapperElement.value.removeAttribute('data-hover');
				linkElement.value?.style.removeProperty('pointer-events');
				attrs.onHoverupdate?.({ ...hoverData });
				attrs.onHoverend?.({ ...hoverData });
			}
		}
	}
}

function runWithoutLink<T>(func?: () => T): T | undefined {
	let display = 'block';
	if (linkElement.value) {
		display = linkElement.value.style.display || 'block';
		linkElement.value.style.display = 'none';
	}

	const ret = func?.();

	if (linkElement.value) {
		linkElement.value.style.display = display;
	}

	return ret;
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
</script>

<style>
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

	:where(.c-link-tile[data-focus='focus']) {
		outline: 2px solid currentColor;
		outline-offset: 4px;
	}

	:where(.c-link-tile[data-hover='hover'] .c-link-tile__link) {
		pointer-events: auto;
		cursor: pointer;
	}
}
</style>
