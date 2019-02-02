class FourCorners {

	constructor(embed, opts) {
		this.elems = {};
		this.opts = opts;
		this.corners = ['context','links','authorship','backstory'];
		this.cornerTitles = ['Image Context','Links','Authorship','Backstory'];
		this.elems.embed = embed;
		this.data = parseData(this);
		this.elems.photo = addPhoto(this);
		this.elems.panels = addPanels(this);
		this.elems.corners = addCorners(this);
		this.elems.caption = addCutline(this);
		initEmbed(this);
	}

	init(userOpts) {
		let proto = this;
		proto.embeds = [];
		const defaultOpts = {
			selector: '.fc-embed:not(.fc-init)',
			interactive: true,
			active: null,
			cutline: true,
			posDur: 0.2,
			transDur: 0.1,
		};
		const opts = Object.assign(defaultOpts, userOpts);
		const embeds = Array.from(document.querySelectorAll(opts.selector));
		embeds.forEach(function(embed, i) {
			const inst = new FourCorners(embed, opts);
			proto.embeds.push(inst);
		});
		return proto.embeds;
	}

	openCorner(slug) {
		const inst = this;
		const corners = this.corners;
		const embed = this.elems.embed;
		const corner = this.elems.corners[slug];
		const panel = this.elems.panels[slug];
		embed.classList.remove('fc-full');
		if(embed && corner && panel) {
			embed.dataset.fcActive = slug;
			embed.classList.add('fc-active');
			corner.classList.add('fc-active');
			panel.classList.add('fc-active');
		}
		corners.forEach(function(_slug, i) {
			if(_slug!=slug) {
				inst.closeCorner(_slug);
			}
		});
	}

	closeCorner(slug) {
		const inst = this;
		const embed = inst.elems.embed;
		if(!slug) {
			slug = embed.dataset.fcActive;
		}
		const corner = inst.elems.corners[slug];
		const panel = inst.elems.panels[slug];
		if(slug==embed.dataset.fcActive) {
			embed.dataset.fcActive = '';
			embed.classList.remove('fc-active');
		}
		if(corner) { corner.classList.remove('fc-active'); }
		if(panel) { panel.classList.remove('fc-active'); }
	}

	toggleExpandPanel() {
		const inst = this;
		inst.elems.embed.classList.toggle('fc-full');
	}

}


const initEmbed = (inst) => {
	const embed = inst.elems.embed;
	embed.classList.add('fc-init');
	if(inst.data&&inst.data.opts&&inst.data.opts.dark) {
		embed.classList.add('fc-dark');
	}

	if(inst.opts.interactive) {

		// embed.addEventListener('mouseenter', function(e) {
		// 	hoverEmbed(e, inst);
		// });
		// embed.addEventListener('mouseleave', function(e) {
		// 	unhoverEmbed(e, inst);
		// });

		window.addEventListener('resize', function(e) {
			resizeEmbed(e, inst);
		});

		window.addEventListener('click', function(e) {
			const onPanels = isChildOf(e.target, inst.elems.panels);
			const onCorners = isChildOf(e.target, inst.elems.corners);
			const inCreator = isChildOf(e.target, Array.from(document.querySelectorAll('#creator')));
			if(!onPanels && !onCorners && !inCreator) {
				inst.closeCorner();
			}
		});

	}

	resizeEmbed(null, inst);
}

const resizeEmbed = (e, inst) => {
	const panels = inst.elems.panels;
	if(!panels){return}
	Object.keys(panels).forEach(function(slug, i) {
		resizePanel(panels[slug]);
	});
}

const resizePanel = (panel) => {
	const panelScroll = panel.querySelector('.fc-scroll');
	if(!panelScroll){return}
	if( panelScroll.scrollHeight > panelScroll.clientHeight ) {
		panel.classList.add('fc-overflow');
	} else {
		panel.classList.remove('fc-overflow');
	}
}

const addPhoto = (inst)  => {
	let embed = inst.elems.embed;
	let data = inst.data;
	if(!data) {return}
	let photo, img;
	const photoSelector = '.fc-photo';
	if(!embed.querySelector(photoSelector)) {
		photo = document.createElement('div');
		photo.classList.add('fc-photo');
		embed.appendChild(photo);
	// 	const pseudoImg = new Image();
	// 	const photoData = data.photo;
	// 	if(!photoData) {return}
	// 	const src = photoData.file;
	// 	pseudoImg.onload = (e) => {
	// 		img.src = src;
	// 		photo.classList.add('fc-loaded');
	// 		photo.appendChild(img);
	// 	}
	// 	pseudoImg.onerror = (e) => {
	// 		console.warn('Four Corners cannot load this as an image: '+src, e);
	// 	}
	// 	pseudoImg.src = src;
	} else {
		photo = embed.querySelector(photoSelector);
	}
	const imgSelector = '.fc-img';
	if(img = embed.querySelector(imgSelector)) {
		photo.classList.add('fc-loaded');
		photo.appendChild(img)
	} else {
		// img = document.createElement('img');
		// img.classList.add('fc-img');
		// photo.classList.add('fc-loaded');
	}
	
	return photo;
}

const addPanels = (inst) => {	
	let data, panels = {};
	let embed = inst.elems.embed;
	inst.corners.forEach(function(slug, i) {
		const active = inst.opts.active;
		let panelSelector = '.fc-panel[data-fc-slug="'+slug+'"]';
		let panel = embed.querySelector(panelSelector);
		if(!panel) {
			panel = document.createElement('div');
			panel.dataset.fcSlug = slug;
			panel.classList.add('fc-panel');
			panel.classList.add('fc-'+slug);
			if(slug==active) {panel.classList.add('fc-active')}
			let panelScroll = document.createElement('div');
			panelScroll.classList.add('fc-scroll');
			let panelInner = document.createElement('div');
			panelInner.classList.add('fc-inner');
			let panelTitle = document.createElement('div');
			panelTitle.classList.add('fc-panel-title');
			let panelTitleSpan = document.createElement('span');
			let panelTitleStr = inst.cornerTitles[inst.corners.indexOf(slug)];
			panelTitleSpan.innerHTML = panelTitleStr;
			panelTitle.appendChild(panelTitleSpan);

			let panelExpand = document.createElement('div');
			panelExpand.className = 'fc-icon fc-expand';
			panelExpand.addEventListener('click', function(e) {
				inst.toggleExpandPanel(e, inst);
			});
			panelTitle.appendChild(panelExpand);

			let panelClose = document.createElement('div');
			panelClose.className = 'fc-icon fc-close';
			panelClose.addEventListener('click', function(e) {
				closePanel(e, inst);
			});
			panelTitle.appendChild(panelClose);

			panelInner.appendChild(panelTitle);
			
			if(inst.data) {
				const panelData = inst.data[slug];
				const dataKeys = Object.keys(panelData);
				
				Object.entries(panelData).forEach(([prop, val]) => {
					if(!val){return}
					let row = document.createElement('div');
					row.classList.add('fc-row', 'fc-'+prop);
					if(prop == 'media') {
						const mediaElems = addMedia(val);
						if(mediaElems) { row.appendChild(mediaElems) }
					} else if(prop == 'links') {
						const linkElems = addLinks(val);
						if(linkElems) { row.appendChild(linkElems) }
					} else if(prop == 'license') {
						const licenseElems = addLicense(val);
						if(licenseElems) { row.appendChild(licenseElems) }
					} else if(prop == 'ethics') {
						row.innerHTML = val;
					} else if(prop == 'copyright') {
						row.innerHTML = '&copy; '+val;
					} else if(prop == 'text') {
						const paraElems = wrapParagraphs(val);
						if(paraElems) { row.appendChild(paraElems) }
					} else {
						row.innerHTML += val;
					}

					const labels = {
						'credit': 'Photography by',
						'ethics': 'Code of ethics',
						'caption': 'Caption',
					}

					let labelText = labels[prop];
					if(row.childNodes.length) {
						if(labelText) {
							let label = document.createElement('div');
							label.classList.add('fc-row-label');
							label.innerHTML = labelText;
							if(row.childNodes) {
								row.insertBefore(label, row.childNodes[0]);
							} else {
								row.appendChild(label);
							}
						}
						panelInner.appendChild(row);
					}
				});
				if(!Object.keys(panelData).length) {
					panel.classList.add('fc-empty');
				}
			}
			panelScroll.appendChild(panelInner);
			panel.appendChild(panelScroll);
			embed.appendChild(panel);
		}
		panels[slug] = panel;
	});
	return panels;
}

const addMedia = (arr) => {
	const iframeSources = ['youtube','vimeo','soundcloud'];
	let rowInner = document.createElement('div');
	rowInner.className = 'fc-row-inner';
	arr.forEach(function(obj, index) {
		if(!Object.keys(obj).length) {return}
		let subRow = document.createElement('div');
		subRow.className = 'fc-sub-row';
		if(iframeSources.indexOf(obj.source) >= 0) {
			embedIframe(obj, subRow);
		} else {
			embedImage(obj, subRow)
		}
		if(obj.caption) {
			let caption = document.createElement('div');
			caption.className = 'fc-sub-caption';
			caption.innerHTML = obj.caption;
			subRow.appendChild(caption);
		}
		rowInner.appendChild(subRow);
	});
	if(rowInner.childNodes.length) {
		return rowInner;
	}
}	

const addLinks = (arr) => {
	let rowInner = document.createElement('div');
	rowInner.className = 'fc-sub-rows';
	arr.forEach(function(obj, index) {
		if(!obj){return}
		let subRow = document.createElement('div');
		subRow.className = 'fc-sub-row';
		let a = document.createElement('a');
		a.href = obj.url;

		// const headers = new Headers();
		// const req = obj.url;
		// fetch(req, {
		// 	method: 'GET',
		// 	headers: headers,
		// 	mode: 'cors',
		// 	cache: 'default'
		// })
		// .then(res => {
		// 	if (!res.ok) {throw Error(res.statusText)}
		// 	console.log(res);
		// 	return res.json();
		// })
		// .then(res => {
		// 	console.log(res);
		// })
		// .catch(function(err) {
		// 	console.log(err);
		// });

		a.target = '_blank';
		if(obj.title) {
			a.innerHTML = obj.title;
		}
		subRow.appendChild(a);
		let rootUrl = extractRootDomain(obj.url);
		if(rootUrl) {
			let url = document.createElement('div');
			url.className = 'fc-sub-url';
			url.innerHTML = rootUrl;
			subRow.appendChild(url);
		}
		rowInner.appendChild(subRow);
	});
	return rowInner;
}

const addLicense = (val) => {
	let a = document.createElement('a');
	a.href = val;
	a.target = '_blank';
	a.innerHTML = val;
	let text = document.createTextNode('License this photo: ');
	let span = document.createElement('span');
	span.appendChild(text);
	span.appendChild(a);
	return span;
}

const embedImage = (obj, subRow) => {
	var mediaWrap = document.createElement('div');
	mediaWrap.className = 'fc-media';
	if(!obj.url){ return }
	const pseudoImg = new Image();
	pseudoImg.onload = (e) => {
		let img = document.createElement('img');
		img.src = obj.url;
		mediaWrap.appendChild(img);
		subRow.appendChild(mediaWrap);
		if(subRow.childNodes) {
			subRow.insertBefore(mediaWrap, subRow.childNodes[0]);
		} else {
			subRow.appendChild(mediaWrap);
		}
	}
	pseudoImg.onerror = (e) => {
		console.warn('Four Corners cannot load this as an image: '+obj.url, e);
	}
	pseudoImg.src = obj.url;
}


const embedIframe = (obj, subRow) => {
	let req = '';
	switch(obj.source) {
		case 'youtube':
			// req = 'https://www.youtube.com/oembed?url='+obj.url;
			req = 'https://noembed.com/embed?url='+obj.url;
			break;
		case 'vimeo':
			req = 'https://vimeo.com/api/oembed.json?url='+obj.url;
			break;
		case 'soundcloud':
			req = 'https://soundcloud.com/oembed?format=json&url='+obj.url;
			break;
		default:
			return false;
			break;
	}
	fetch(req, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => {
			if (!res.ok) {throw Error(res.statusText)}
			return res.json();
		})
		.then(res => {
			var mediaWrap = document.createElement('div');
			mediaWrap.className = 'fc-media';
			mediaWrap.innerHTML =  res.html;
			if(Number.isInteger(res.width,res.height)) {
				const ratio = res.height/res.width;
				mediaWrap.classList.add('fc-responsive')
				mediaWrap.style.paddingBottom = (ratio*100)+'%';
			}
			if(subRow.childNodes) {
				subRow.insertBefore(mediaWrap, subRow.childNodes[0]);
			} else {
				subRow.appendChild(mediaWrap);
			}
			
		})
		.catch(function(err) {
			subRow.remove();
			console.warn('Four Corners cannot load this media source: '+src, err);
		});
}

const extractHostname = (url) => {
  let hostname;
  if(!url){return false}
  if(url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
}

const extractRootDomain = (url)  => {
	if(!url){return false}
	let domain = extractHostname(url);
	let splitArr = domain.split('.');
	let arrLen = splitArr.length;
	if (arrLen > 2) {
		domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
		if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
			domain = splitArr[arrLen - 3] + '.' + domain;
		}
	}
	return domain;
}

const addCorners = (inst) => {
	let data, corners = {};
	let embed = inst.elems.embed;
	let photo = inst.elems.photo;
	const active = inst.opts.active;
	inst.corners.forEach(function(slug, i) {
		const cornerSelector = '.fc-corner[data-fc-slug="'+slug+'"]';
		if(embed.querySelector(cornerSelector)) {return}
		let corner = document.createElement('div');
		corner.dataset.fcSlug = slug;
		corner.classList.add('fc-corner');
		corner.classList.add('fc-'+slug);

		// let cornerShadow = document.createElement('div');
		// cornerShadow.classList.add('fc-shadow');
		// corner.appendChild(cornerShadow);

		if(slug==active) {corner.classList.add('fc-active')}
		if(inst.data) {
			data = inst.data[slug];
			if(!data||!Object.keys(data).length) {
				corner.classList.add('fc-empty');
			}
		}

		if(inst.opts.interactive) {

			corner.addEventListener('mouseenter', function(e) {
				hoverCorner(e, inst);
			});
			corner.addEventListener('mouseleave', function(e) {
				unhoverCorner(e, inst);
			});
			corner.addEventListener('click', function(e) {
				clickCorner(e, inst);
			});

		}
		corners[slug] = corner;
		embed.appendChild(corner);
	});

	return corners;
}

const addCutline = (inst) => {
	if(!inst.data||!inst.opts.cutline) {return}
	const data = inst.data['authorship'];
	if(!data||!Object.keys(data).length) {return}
	const embed = inst.elems.embed
	let cutline = document.createElement('div');
	cutline.classList.add('fc-cutline');
	let cutlineArray = [];
	if(data.credit) {
		cutlineArray.push(data.credit);
	}
	// if(data.copyright) {
	// 	cutlineArray.push('&copy;');
	// }
	const fcLink = '<a href="#" class="fc">Four Corners</a>';
	cutlineArray.push(fcLink);
	const cutlineText = cutlineArray.join(' ');
	cutline.innerHTML = cutlineText;
	embed.parentNode.insertBefore(cutline, embed.nextSibling);
}

const parseData = (inst) => {
	if(!inst.elems.embed) {return}
	let stringData = inst.elems.embed.dataset.fc;
	if(!stringData){return}
	stringData = stringData;
	delete inst.elems.embed.dataset.fc;
	return JSON.parse(stringData);
}

// const hoverEmbed = (e, inst) => {
// 	let embed = inst.elems.embed;
// 	let corners = inst.elems.corners;
// 	const css = inst.css;
// 	const posDur = inst.opts.posDur;
// }

// const unhoverEmbed = (e, inst) => {
// 	let embed = inst.elems.embed;
// 	let corners = inst.elems.corners;
// 	const css = inst.css;
// 	const posDur = inst.opts.posDur;
// }

const hoverCorner = (e, inst) => {
	let corner = e.target;
	corner.classList.add('fc-hover');
}

const unhoverCorner = (e, inst) => {
	let corner = e.target;
	corner.classList.remove('fc-hover');
}

const clickCorner = (e, inst) => {
	let corner = e.target;
	let slug = corner.dataset.fcSlug;
	const active = inst.elems.embed.dataset.fcActive;
	if(!slug) {return}	
	if(slug==active) {
		inst.closeCorner(slug);	
	} else {
		inst.openCorner(slug);
	}	
}

const clickPhoto = (e, inst) => {
	inst.closeCorner();
}

const closePanel = (e, inst) => {
	inst.closeCorner();
}

const isChildOf = (target, ref) => {
	let answer = false;
	Object.entries(ref).forEach(([key, elem]) => {
	  if(elem.contains(target)) {
	  	answer = true;
	  }
	});
	return answer;
}

const wrapParagraphs = (val) => {
	let array = val.split(/\n/g);
	let text = '';
	if(array.length <= 1){return val;}
	let rowInner = document.createElement('div');
	rowInner.className = 'fc-row-inner';
	array.forEach(function(str, i) {
		let p = document.createElement('p');
		p.innerHTML = str;
		rowInner.appendChild(p);
	});
	return rowInner;
}

const wrapUrls = (str) => {
	var urlPattern = /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}\-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/ig;
	return str.replace(urlPattern, function (url) {
		var protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i;
		var href = protocol_pattern.test(url) ? url : 'http://' + url;
		return '<a href="' + href + '" target="_blank">' + url + '</a>';
	});
};

export default FourCorners;