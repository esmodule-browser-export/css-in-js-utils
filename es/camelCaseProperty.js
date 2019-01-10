const dashRegex = /-([a-z])/g
const msRegex = /^Ms/g

export default function camelCaseProperty(property) {
  return property
    .replace(dashRegex, match => match[1].toUpperCase())
    .replace(msRegex, 'ms')
}
