export function addMedia() {
	['imagery', 'backstory'].forEach((panelKey) => {
		const panel = this.getPanel(panelKey)
		const mediaWrappers = panel.querySelectorAll('.fc-media-embed')
		mediaWrappers.forEach((elem) => {
			const { fcSource, fcUrl, fcIndex } = elem.dataset
			const obj = {
				source: fcSource,
				url: fcUrl,
				index: fcIndex
			}
			if(obj.source === 'image') {
			  insertMediaImage(obj, panel)
			} else {
				insertMediaEmbed(obj, panel)
			}
		})
	})
}

export function insertMediaImage(obj, panel) {
	const subMedia = panel.querySelectorAll('.fc-media-embed')[obj.index]
	const pseudoImg = new Image()
	let html = ''
	html = `<img src='${obj.url}' />`
	subMedia.innerHTML = html
	// pseudoImg.onload = () => {
	// 	html = `<img src='${obj.url}' />`
	// 	subMedia.innerHTML = html
	// }
	pseudoImg.onerror = () => {
		subMedia.parentNode.parentNode.remove()
		console.warn(`Four Corners cannot load this media.`, {
			url: obj.url,
			error: `Embedding failed and was removed from the imagery panel`
		})
	}
	pseudoImg.src = obj.url
}

export function insertMediaEmbed(obj, panel) {
	// Requests third party APIs to retrieve embed data
	let req = ''
	switch(obj.source) {
		case 'youtube':
			req = 'https://noembed.com/embed?url='+obj.url
			break
		case 'vimeo':
			req = 'https://vimeo.com/api/oembed.json?url='+obj.url
			break
		case 'soundcloud':
			req = 'https://soundcloud.com/oembed?format=json&url='+obj.url
			break
		case 'instagram':
			req = 'https://api.instagram.com/oembed/?url='+obj.url
			break
		default:
			return false
			break
	}
	const headers = new Headers()
	fetch(req, {
		method: 'GET',
		headers: headers
	}).then(res => {
		if (!res.ok) {throw Error(res.statusText)}
		return res.json()
	}).then(res => {
		const subMedia = panel.querySelectorAll('.fc-media-embed')[obj.index]
		let html = ''

		if(obj.source == 'instagram') {
			html = `<img src='${res.thumbnail_url}'/>`
		} else {
			html = res.html
		}

		if(Number.isInteger(res.width, res.height)) {
			const ratio = res.height/res.width
			subMedia.classList.add('fc-responsive')
			subMedia.style.paddingBottom = `${ratio * 100}%`
		}
		
		if(html) {
			subMedia.innerHTML = html
		} else {
			subMedia.parentNode.remove()
			console.warn(`Four Corners cannot load this media.`, {
				url: obj.url,
				error: `Embedding failed and was removed from the panel`,
				elem: panel
			})
		}
	}).catch(function(err) {
		console.warn(`Four Corners cannot load this media.`, {
			url: obj.url,
			error: err
		})
	})
}