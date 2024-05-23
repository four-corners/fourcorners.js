require('style.scss')
require('regenerator-runtime/runtime')

import {
	FC_CORNER_KEYS,
	FC_DEFAULT_DATA,
	FC_OPTION_KEYS,
	FC_DEFAULT_OPTIONS,
	FC_ASSERTION_KEY,
	FC_STRINGS
} from './constants'
import {
	isChildOf,
	getVerifyUrl
} from './helpers'

import { initC2pa } from 'methods/c2pa'
import { initJson } from 'methods/json'
import { addCorners } from 'elements/corners'
import { addPanels } from 'elements/panels'
import { addCutline } from 'elements/cutline'
import { addMedia } from 'elements/media'


class FourCorners {
	constructor(arg) {
		let params = {}
		if(typeof arg === 'object') {
			// If passing a DOM object
			if(arg.tagName !== undefined) {
				// Set DOM object `arg` as `container` elem
				params.container = arg
			} else {
				// Otherwise, set `arg` as params object
				params = arg
			}
		}
		// If no container from DOM object or params object, don't construct instance
		if(!params.container) return
		this.params = params
		this.elems = {}
		this.elems.container = params.container
		this.elems.img = getImg.call(this)
		this.src = getSrc.call(this)
		
		initC2pa.call(this).then(data => {
			if(!data) return
			this.data = this.setData(data)
			this.options = this.setOptions(data)
			buildElems.call(this)
		})

		initJson.call(this).then(data => {
			if(!data) return
			this.data = this.setData(data)
			this.options = this.setOptions(data)
			buildElems.call(this)
		})

		this?.elems?.container?.classList.add('fc-init')
	}

	// Set parsed content data
	setData(data) {
		if(data?.authorship?.verify) {
			data.authorship.verify = getVerifyUrl(this.src, false)
		}
		return {
			...FC_DEFAULT_DATA,
			...data
		}
	}

	// Set default, user, and content options
	setOptions(data) {
		return {
			...FC_DEFAULT_OPTIONS,
			...this.params?.opts,
			...data?.options,
		}
	}

	// Get corner element by key
	getCorner(cornerKey) {
		return this.elems.container.querySelector(`.fc-corner[data-fc-key='${cornerKey}']`)
	}

	// Get panel element by key
	getPanel(cornerKey) {
		return this.elems.container.querySelector(`.fc-panel[data-fc-key='${cornerKey}']`)
	}

	// Get all panel elements
	getPanels() {
		return Array.from(this.elems.container.querySelectorAll('.fc-panel'))
	}

	// Open a panel by key
	openPanel(cornerKey) {
		const { elems } = this
		const { container } = elems
		const corner = this.getCorner(cornerKey)
		const panel = this.getPanel(cornerKey)
		container.classList.remove('fc-full')
		container.classList.add('fc-active')
		container.setAttribute('data-fc-active', cornerKey)
		if(corner) corner.classList.add('fc-active')
		if(panel) panel.classList.add('fc-active')
		FC_CORNER_KEYS.forEach(key => {
			if(key !== cornerKey) this.closePanel(key)
		})
	}

	// Close a panel by key
	closePanel(cornerKey) {
		const { elems } = this
		const { container, corners, panels } = elems
		const corner = this.getCorner(cornerKey)
		const panel = this.getPanel(cornerKey)
		if(corner) corner.classList.remove('fc-active')
		if(panel) panel.classList.remove('fc-active')
		container.classList.remove('fc-active')
		container.setAttribute('data-fc-active', '')
		setTimeout(() => container.classList.remove('fc-full'))
	}

	// Close all panels
	closePanels() {
		FC_CORNER_KEYS.forEach(cornerKeys => this.closePanel(cornerKeys))
	}

	destroy() {
		FC_CORNER_KEYS.forEach(key => {
			const panel = this.getPanel(key)
			const corner = this.elems.corners ? this.elems.corners[key] : null
			if(panel) {
				panel.querySelector('.fc-expand').removeEventListener('click', this._handleClickExpand)
				panel.querySelector('.fc-close').removeEventListener('click', this._handleClickClose)
				panel.remove()
			}
			if(corner) {
				corner.removeEventListener('mouseenter', this._handleHoverCorner)
				corner.removeEventListener('mouseleave', this._handleUnhoverCorner)
				corner.removeEventListener('click', this._handleClickCorner)
				corner.remove()
			}
		})
		this.elems.container.removeEventListener('click', this._handleClickEmpty)
	}


	// Initialize all elements by selector argument
	static init(selector) {
		const containers = [...document.querySelectorAll(selector)]
		const instances = containers.map(container => new FourCorners(container))
		console.log(`Initialized ${instances ? instances.length : 0} FourCorners instances`)
		// Initialize new figures as they appear in the DOM
		document.addEventListener('DOMContentLoaded', () => {
			const newContainers = [...document.querySelectorAll(selector)].filter(elem => !elem.hasClass('fc-init'))
			const newInstances = newContainers.map(container => new FourCorners(container))
			console.log(`Initialized ${newInstances ? newInstances.length : 0} new FourCorners instances`)
		})
	}

}


// Get `img` element in `container`
function getImg() {
	const img = [...this.elems.container.querySelectorAll('img')].find(img => {
		const ext = ((/[.]/.exec(img.src)) ? /[^.]+$/.exec(img.src) : [])[0]
		return ext && ['jpg', 'jpeg', 'png', 'gif'].includes(ext)
	})
	return img
}

// Set `src` from either `params` object or from `img` DOM object
function getSrc() {
	if(this?.params?.src) return this.params.src
	if(this?.elems?.img?.src) return this.elems.img.src
	return null
}

// Build and add all interactive DOM elements
function buildElems() {
	this.elems.cutline = addCutline.call(this)
	this.elems.panels = addPanels.call(this)
	this.elems.corners = addCorners.call(this)
	addMedia.call(this)
	this._handleHoverCorner = handleHoverCorner.bind(this)
	this._handleUnhoverCorner = handleUnhoverCorner.bind(this)
	this._handleClickCorner = handleClickCorner.bind(this)
	this._handleClickContainer = handleClickContainer.bind(this)
	this._handleClickClosePanel = handleClickClosePanel.bind(this)
	this._handleClickExpandPanel = handleClickExpandPanel.bind(this)
	addInteractivity.call(this)
}

// Add event listeners to corners
function addInteractivity() {
	FC_CORNER_KEYS.forEach(key => {
		const panel = this.getPanel(key)
		const corner = this.elems.corners[key]
		panel.querySelector('.fc-expand').addEventListener('click', this._handleClickExpandPanel)
		panel.querySelector('.fc-close').addEventListener('click', this._handleClickClosePanel)
		corner.addEventListener('mouseenter', this._handleHoverCorner)
		corner.addEventListener('mouseleave', this._handleUnhoverCorner)
		corner.addEventListener('click', this._handleClickCorner)
		corner.classList.add('fc-interactive')
	})
	this.elems.container.addEventListener('click', this._handleClickContainer)
	this.elems.container.classList.add('fc-embed')
}

// When panel close button is clicked
function handleClickClosePanel(e) {
	this.closePanels()
}

// When panel expand button is clicked
function handleClickExpandPanel() {
	this.elems.container.classList.toggle('fc-full')
}

// When corner is hovered
function handleHoverCorner(e) {
	let cornerElem = e.target
	cornerElem.classList.add('fc-hover')
}

// When corner is unhovered
function handleUnhoverCorner(e) {
	let cornerElem = e.target
	cornerElem.classList.remove('fc-hover')
}

// When corner is clicked
function handleClickCorner(e) {
	const cornerElem = e.target
	const cornerKey = cornerElem.getAttribute('data-fc-key')
	const activeKey = this.elems.container.getAttribute('data-fc-active')

	if(cornerKey === activeKey) {
		this.closePanel(cornerKey)	
	} else {
		this.openPanel(cornerKey)
	}	
}

// When container is clicked
// If click not in panel or corner, close panels
function handleClickContainer(e) {
	const onPanels = isChildOf(e.target, this.getPanels())
	const onCorners = isChildOf(e.target, this.elems.corners)
	if(!onPanels && !onCorners) {
		this.closePanels()
	}
}

export default FourCorners