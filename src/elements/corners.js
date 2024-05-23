import {
	FC_STRINGS,
	FC_CORNER_KEYS
} from './../constants'

// Add buttons in corners
export function addCorners() {
	const corners = {}
	const { data, elems, options } = this
	const { container } = elems
	const strings = FC_STRINGS[options.lang]
	FC_CORNER_KEYS.forEach(cornerKey => {
		const cornerTitle = strings[cornerKey] || null
		const cornerElem = document.createElement('div')

		cornerElem.role = 'button'
		cornerElem.title = `View ${cornerTitle}`
		cornerElem.setAttribute('data-fc-key', cornerKey)
		cornerElem.classList.add('fc-corner', `fc-${cornerKey}`)

		// TODO: Confirm logic and use simpler version
		const _cornerIsEmpty = data.hasOwnProperty(cornerKey)
			? !Object.keys(data[cornerKey]).length
			: true

		let cornerIsEmpty
		if(data.hasOwnProperty(cornerKey)) {
			if(Object.keys(data[cornerKey]).length) {
				cornerIsEmpty = false
			} else {
				cornerIsEmpty = true
			}
		} else {
			cornerIsEmpty = true
		}
		// console.log(_cornerIsEmpty, cornerIsEmpty)

		if(cornerIsEmpty) {
			cornerElem.classList.add('fc-empty')
		}

		container.appendChild(cornerElem)
		corners[cornerKey] = cornerElem
	})
	return corners
}

// Add SVG element for corner icon
export function addCornerSvg() {
  const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  iconSvg.setAttribute('viewBox', '0 0 100 100')
  iconPath.setAttribute('d', 'M75 24.75H0.25V0.25H75H99.75V25V99.75H75.25L75.25 25V24.75H75Z')
  iconSvg.appendChild(iconPath)
  return iconSvg
}