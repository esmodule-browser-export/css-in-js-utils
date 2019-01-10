const prefixRegex = /^(ms|Webkit|Moz|O)/

export default function unprefixProperty(property) {
  const propertyWithoutPrefix = property.replace(prefixRegex, '')
  return (
    propertyWithoutPrefix.charAt(0).toLowerCase() +
    propertyWithoutPrefix.slice(1)
  )
}
