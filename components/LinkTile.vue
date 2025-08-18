<template>
	<Component
		:is="tag"
		ref="wrapperElementRef"
		class="c-link-tile"
		v-bind="{
			...$attrs,
			onClick,
			onMouseup,
			onMousemove,
			onMouseover,
			onMouseleave,
		}"
	>
		<NuxtLink
			v-if="to || href"
			:id="id"
			ref="linkElementRef"
			:role="role"
			class="c-link-tile__link"
			:class="{
				'c-link-tile__link--hovered': linkIsHovered,
			}"
			:to="to"
			v-bind="linkBindings"
		></NuxtLink>
		<button
			v-else
			:id="id"
			ref="linkElementRef"
			:role="role"
			class="c-link-tile__link c-link-tile__link--is-button"
			v-bind="linkBindings"
		></button>
		<slot></slot>
	</Component>
</template>

<script setup>
const wrapperElementRef = ref(null);
const linkElementRef = ref(null);
const wrapperElement = computed(() => {
	if (wrapperElementRef.value && '$el' in wrapperElementRef.value) {
		return wrapperElementRef.value.$el;
	}
	return wrapperElementRef.value;
});
const linkElement = computed(() => {
	if (linkElementRef.value && '$el' in linkElementRef.value) {
		return linkElementRef.value.$el;
	}
	return linkElementRef.value;
});

defineOptions({
	inheritAttrs: false,
});

const attrs = useAttrs();
const props = defineProps({
	// The tag of the outer/wrapping element
	tag: {
		type: String,
		default: 'div',
	},

	// This is to pinpoint specific elements to treat as the link instead of the whole tile
	linkPartialsQuery: {
		type: String,
		default: undefined,
	},

	// This should allow us to click on other buttons, links, etc. "inside the link"
	clickableElementsQuery: {
		type: String,
		default:
			'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
	},

	// For when using RouterLink/NuxtLink/etc.
	to: {
		type: [String, Object],
		default: undefined,
	},

	external: Boolean,

	// A slew of normal attributes that can be passed to the link
	id: {
		type: [String, Number],
		default: undefined,
	},

	href: {
		type: [String, Object],
		default: undefined,
	},

	target: {
		type: String,
		default: undefined,
	},

	title: {
		type: String,
		default: undefined,
	},

	tabindex: {
		type: [String, Number],
		default: undefined,
	},

	download: {
		type: String,
		default: undefined,
	},

	hreflang: {
		type: String,
		default: undefined,
	},

	ping: {
		type: String,
		default: undefined,
	},

	referrerpolicy: {
		type: String,
		default: undefined,
	},

	rel: {
		type: String,
		default: undefined,
	},

	type: {
		type: String,
		default: undefined,
	},

	// A bunch more attributes more closely tied to a11y
	// a11y: based off of https://www.w3.org/TR/wai-aria-1.1/#link-0
	role: {
		type: String,
		default: undefined,
	},

	ariaRoledescription: {
		type: String,
		default: undefined,
	},

	ariaLabel: {
		type: String,
		default: undefined,
	},

	ariaLabelledby: {
		type: String,
		default: undefined,
	},

	ariaDetails: {
		type: String,
		default: undefined,
	},

	ariaDescribedby: {
		type: String,
		default: undefined,
	},

	ariaControls: {
		type: String,
		default: undefined,
	},

	ariaCurrent: {
		type: String,
		default: undefined,
	},

	ariaDisabled: {
		type: String,
		default: undefined,
	},

	ariaFlowto: {
		type: String,
		default: undefined,
	},

	ariaHaspopup: {
		type: String,
		default: undefined,
	},

	ariaKeyshortcuts: {
		type: String,
		default: undefined,
	},

	ariaLive: {
		type: String,
		default: undefined,
	},

	ariaOwns: {
		type: String,
		default: undefined,
	},

	customLinkAttrs: {
		type: Object,
		default: () => ({}),
	},
});

const linkIsHovered = ref(false);

// Data
const hoverData = {
	get linkElement() {
		return linkElement.value;
	},
	isHovering: false,
};

// A warning of missing a11y attributes if needed
if (!props.ariaLabel && !props.ariaLabelledby) {
	console.warn(
		`[LinkTile - ${props.id ? '#' + props.id : 'no id'}]`,
		'No a11y label attributes were provided. This may cause accessibility issues. Add either the \'aria-label\' or \'aria-labelledby\' attribute to the component, to avoid any issues.'
	);
}

const isLink = computed(() => !!props.to || !!props.href);

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
		...(props.customLinkAttrs || {}),
	};
});

// Methods
const onClick = (e) => {
	const el = wrapperElement.value;

	// Cancel if the actual link is targeted to avoid infinite recursion
	if (!el || e.target === linkElement.value) {
		return;
	}

	// Cancel if an inner button is targeted
	if (
		props.clickableElementsQuery &&
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
		if (!linkPartials.includes(e.target)) {
			let isPartial = false;
			linkPartials.forEach((partial) => {
				isPartial = getPath(e).includes(partial) ? true : isPartial;
			});

			if (!isPartial) {
				return;
			}
		}
	}

	// We still only want a custom event to happen if we actually click as per configured
	attrs.onClick?.(e); // Run the usual event, if such is defined
	if (e.defaultPrevented) {
		return;
	}

	// Click on link - doing it this way, we pass on shift/ctrl/etc. modifiers
	const event = new MouseEvent('click', e);
	linkElement.value?.dispatchEvent?.(event);

	// Cancel/stop everything just to be sure
	e.preventDefault();
	e.stopPropagation();
};

const onMousemove = (e) => {
	if (props.clickableElementsQuery) {
		let display = 'block';
		if (linkElement.value) {
			({ display } = linkElement.value.style);
			linkElement.value.style.display = 'none';
		}

		const elementStack = [...document.elementsFromPoint(e.clientX, e.clientY)];
		if (linkElement.value) {
			linkElement.value.style.display = display;
		}

		if (elementStack.length) {
			const target = elementStack[0].closest(
				props.clickableElementsQuery
			);
			if (target) {
				linkIsHovered.value = false;
				return;
			}
		}
	}

	linkIsHovered.value = true;
};

const onMouseup = (e) => {
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
		if (!linkPartials.includes(e.target)) {
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
			linkElement.value.style.pointerEvents = null;
		});
	}
};

const onMouseover = (e) => {
	attrs.onMouseover?.(e);
	if (e.defaultPrevented) {
		return;
	}

	const el = wrapperElement.value;
	if (el) {
		// Cancel if an inner button is targeted
		if (
			props.clickableElementsQuery &&
			[...el.querySelectorAll(props.clickableElementsQuery)].includes(
				e.target
			)
		) {
			el.removeAttribute('data-hover');
			if (hoverData.isHovering) {
				hoverData.isHovering = false;
				attrs.onHoverupdate?.({ ...hoverData });
				attrs.onHoverend?.({ ...hoverData });
			}
			return;
		}

		// Cancel if element should not be treated as a link
		if (props.linkPartialsQuery) {
			const linkPartials = [
				...el.querySelectorAll(props.linkPartialsQuery),
			];
			if (linkPartials.length === 0) {
				el.removeAttribute('data-hover');
				if (hoverData.isHovering) {
					hoverData.isHovering = false;
					attrs.onHoverupdate?.({ ...hoverData });
					attrs.onHoverend?.({ ...hoverData });
				}
				return;
			}
			if (!linkPartials.includes(e.target)) {
				let isPartial = false;
				linkPartials.forEach((partial) => {
					isPartial = getPath(e).includes(partial) ? true : isPartial;
				});

				if (!isPartial) {
					el.removeAttribute('data-hover');
					if (hoverData.isHovering) {
						hoverData.isHovering = false;
						attrs.onHoverupdate?.({
							...hoverData,
						});
						attrs.onHoverend?.({ ...hoverData });
					}
					return;
				}
			}
		}

		el.setAttribute('data-hover', 'hover');
		if (!hoverData.isHovering) {
			hoverData.isHovering = true;
			attrs.onHoverstart?.({ ...hoverData });
			attrs.onHoverupdate?.({ ...hoverData });
		}
	}
};

const onMouseleave = (e) => {
	linkIsHovered.value = false;

	attrs.onMouseleave?.(e);
	if (e.defaultPrevented) {
		return;
	}

	const el = wrapperElement.value;
	if (el) {
		el.removeAttribute('data-hover');
		if (hoverData.isHovering) {
			hoverData.isHovering = false;
			attrs.onHoverupdate?.({ ...hoverData });
			attrs.onHoverend?.({ ...hoverData });
		}
	}
};

function getPath(event, _element = null, _path = null) {
	const path = _path || event.path || [];
	let element = _element || event.srcElement;

	if (!event.path && element.parentNode) {
		path.push(element);
		element = element.parentNode;
		return getPath(event, element, path);
	}

	return path;
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
	}
	:where(.c-link-tile__link--hovered) {
		pointer-events: auto;
	}

	:where(.c-link-tile[data-hover='hover']) {
		cursor: pointer;
	}
}
</style>
