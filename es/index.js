import hyphenateStyleName from 'hyphenate-style-name'

function filterUniqueArray(arr) {
    return arr.filter((val, index) => arr.lastIndexOf(val) === index)
}

export function assignStyle(
    base,
    ...extendingStyles
) {
    for (let i = 0, len = extendingStyles.length; i < len; ++i) {
        const style = extendingStyles[i]

        for (const property in style) {
            const value = style[property]
            const baseValue = base[property]

            if (baseValue && value) {
                if (Array.isArray(baseValue)) {
                    base[property] = filterUniqueArray(baseValue.concat(value))
                    continue
                }

                if (Array.isArray(value)) {
                    base[property] = filterUniqueArray([baseValue, ...value])
                    continue
                }

                if (typeof value === 'object') {
                    base[property] = assignStyle({}, baseValue, value)
                    continue
                }
            }

            base[property] = value
        }
    }

    return base
}

const dashRegex = /-([a-z])/g
const msRegex = /^Ms/g

export function camelCaseProperty(property) {
    return property
        .replace(dashRegex, match => match[1].toUpperCase())
        .replace(msRegex, 'ms')
}

export function hyphenateProperty(property) {
    return hyphenateStyleName(property)
}

export function cssifyDeclaration(
    property,
    value
) {
    return `${hyphenateProperty(property)}:${value}`
}

export function cssifyObject(style) {
    let css = ''

    for (const property in style) {
        const value = style[property]
        if (typeof value !== 'string' && typeof value !== 'number') {
            continue
        }

        // prevents the semicolon after
        // the last rule declaration
        if (css) {
            css += ';'
        }

        css += cssifyDeclaration(property, value)
    }

    return css
}

const isPrefixedPropertyRegex = /^(Webkit|Moz|O|ms)/

export function isPrefixedProperty(property) {
    return isPrefixedPropertyRegex.test(property)
}

const isPrefixedValueRegex = /-webkit-|-moz-|-ms-/

export function isPrefixedValue(value) {
    return typeof value === 'string' && isPrefixedValueRegex.test(value)
}

const unitlessProperties = {
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    // SVG-related properties
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
}

const prefixedUnitlessProperties = [
    'animationIterationCount',
    'boxFlex',
    'boxFlexGroup',
    'boxOrdinalGroup',
    'columnCount',
    'flex',
    'flexGrow',
    'flexPositive',
    'flexShrink',
    'flexNegative',
    'flexOrder',
    'gridRow',
    'gridColumn',
    'order',
    'lineClamp'
]

const prefixes = ['Webkit', 'ms', 'Moz', 'O']

function getPrefixedProperty(prefix, property) {
    return prefix + property.charAt(0).toUpperCase() + property.slice(1)
}

// add all prefixed properties to the unitless properties
for (let i = 0, len = prefixedUnitlessProperties.length; i < len; ++i) {
    const property = prefixedUnitlessProperties[i]
    unitlessProperties[property] = true

    for (let j = 0, jLen = prefixes.length; j < jLen; ++j) {
        unitlessProperties[getPrefixedProperty(prefixes[j], property)] = true
    }
}

// add all hypenated properties as well
for (const property in unitlessProperties) {
    unitlessProperties[hyphenateProperty(property)] = true
}

export function isUnitlessProperty(property) {
    return unitlessProperties.hasOwnProperty(property)
}

const unprefixPropertyPrefixRegex = /^(ms|Webkit|Moz|O)/

export function unprefixProperty(property) {
    const propertyWithoutPrefix = property.replace(unprefixPropertyPrefixRegex, '')
    return (
        propertyWithoutPrefix.charAt(0).toLowerCase() +
        propertyWithoutPrefix.slice(1)
    )
}

export function normalizeProperty(property) {
    return unprefixProperty(camelCaseProperty(property))
}

export function resolveArrayValue(
    property,
    value
) {
    const hyphenatedProperty = hyphenateProperty(property)

    return value.join(`;${hyphenatedProperty}:`)
}

const unprefixValuePrefixRegex = /(-ms-|-webkit-|-moz-|-o-)/g

export function unprefixValue(value) {
    if (typeof value === 'string') {
        return value.replace(unprefixValuePrefixRegex, '')
    }

    return value
}

export default {
    assignStyle,
    camelCaseProperty,
    cssifyDeclaration,
    cssifyObject,
    hyphenateProperty,
    isPrefixedProperty,
    isPrefixedValue,
    isUnitlessProperty,
    normalizeProperty,
    resolveArrayValue,
    unprefixProperty,
    unprefixValue
}
