<template>
	<Component
		:is="tag"
		ref="wrapperElementRef"
		class="c-link-tile"
		v-bind="{
			...$attrs,
			onMouseup,
			onMousemove,
			onMouseleave,
		}"
	>
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
	onHoverstart?: Function;
	onHoverupdate?: Function;
	onHoverend?: Function;
};

interface LinkTileProps {
	tag?: string;
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

const attrs = useAttrs() as LinkTileAttrs;
const props = withDefaults(defineProps<LinkTileProps>(), {
	tag: 'div',
	clickableElementsQuery:
		'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
	customLinkAttrs: () => ({}),
	onClick: null,
});

// Data
const hoverData: HoverData = {
	get linkElement() {
		return linkElement.value;
	},
	isHovering: false,
};

// A warning of missing a11y attributes if needed
if (!props.ariaLabel && !props.ariaLabelledby) {
	console.warn(
		`[LinkTile - ${props.id ? '#' + props.id : 'no id'}]`,
		'No a11y label attributes were provided. This may cause accessibility issues. Add either aria-label or aria-labelledby to the component, to avoid any issues.'
	);
}

const isLink = computed(() => !!props.to || !!props.href);

const onClick = computed(() => (e: MouseEventWithPath) => {
	if (e.defaultPrevented) {
		return;
	}
	const el = wrapperElement.value;

	el &&
		runWithoutLink(() => {
			const elementStack = [
				...document.elementsFromPoint(e.clientX, e.clientY),
			];

			const target = elementStack[0];
			if (!target) {
				return;
			}

			// Cancel if an inner button is targeted
			if (
				props.clickableElementsQuery &&
				[...el.querySelectorAll(props.clickableElementsQuery)].includes(
					target
				)
			) {
				return;
			}

			// Cancel if element should not be treated as a link
			if (props.linkPartialsQuery) {
				const linkPartials = [
					...el.querySelectorAll(props.linkPartialsQuery),
				];
				if (linkPartials.length === 0) {
					return;
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
						return;
					}
				}
			}

			// We still only want a custom event to happen if we actually click as per configured
			props.onClick?.(e); // Run the usual event, if such is defined
			if (e.defaultPrevented) {
				return;
			}

			// We run any onLinkTileClick handler, if default's aren't prevented
			onLinkTileClick(e);
			if (e.defaultPrevented) {
				return;
			}

			if (e.target === linkElement.value) {
				return;
			}

			// Click on link - doing it this way, we pass on shift/ctrl/etc. modifiers
			const event = new MouseEvent('click', e);
			linkElement.value?.dispatchEvent?.(event);

			// Cancel/stop everything just to be sure
			e.preventDefault();
			e.stopPropagation();
		});
});

const linkBindings = computed(() => {
	return {
		href: isLink.value ? props.href : null,
		to: isLink.value && !props.href ? props.to : null,
		external: isLink.value ? props.external : null,
		target: isLink.value ? props.target : null,
		title: props.title,
		tabindex: props.tabindex,
		download: isLink.value ? props.download : null,
		hreflang: isLink.value ? props.hreflang : null,
		ping: isLink.value ? props.ping : null,
		referrerpolicy: isLink.value ? props.referrerpolicy : null,
		rel: isLink.value ? props.rel : null,
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
		onClick: onClick.value,
		...(props.customLinkAttrs || {}),
	};
});

// Methods
const onMousemove = (e: MouseEventWithPath) => {
	attrs.onMousemove?.(e);
	if (e.defaultPrevented) {
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
	if (e.defaultPrevented) {
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
	if (e.defaultPrevented) {
		return;
	}

	setHoverState(false);
};

function setHoverState(value: boolean) {
	if (hoverData.isHovering !== value) {
		hoverData.isHovering = value;
		if (wrapperElement.value) {
			if (value) {
				wrapperElement.value.setAttribute('data-hover', 'hover');
				attrs.onHoverstart?.({ ...hoverData });
				attrs.onHoverupdate?.({ ...hoverData });
			} else {
				wrapperElement.value.removeAttribute('data-hover');
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
	:where(.c-link-tile[data-hover='hover'] .c-link-tile__link) {
		pointer-events: auto;
		cursor: pointer;
	}
}
</style>
