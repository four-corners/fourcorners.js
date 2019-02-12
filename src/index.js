class FourCorners {

	constructor(embed, opts) {
		this.elems = {};
		this.opts = opts;
		this.corners = ['authorship','backstory','imagery','links'];
		this.cornerTitles = ['Authorship','Backstory','Related Imagery','Links'];
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

	getPanel(slug) {
		const embed = this.elems.embed;
		if(!embed){return}
		let panelSelector = '.fc-panel';
		if(slug) {
			panelSelector += '[data-fc-slug="'+slug+'"]';
			return embed.querySelector(panelSelector);
		}
		return embed.querySelectorAll(panelSelector);
	}

	openPanel(slug) {
		const inst = this;
		const corners = inst.corners;
		const embed = inst.elems.embed;
		const corner = inst.elems.corners[slug];
		// const panel = this.elems.panels[slug];
		let panel = inst.getPanel(slug);
		embed.classList.remove('fc-full');
		if(embed && corner && panel) {
			embed.dataset.fcActive = slug;
			embed.classList.add('fc-active');
			corner.classList.add('fc-active');
			panel.classList.add('fc-active');
		}
		corners.forEach(function(_slug, i) {
			if(_slug!=slug) {
				inst.closePanel(_slug);
			}
		});
	}

	closePanel(slug) {
		const inst = this;
		const embed = inst.elems.embed;
		if(!slug) {
			slug = embed.dataset.fcActive;
		}
		const corner = inst.elems.corners[slug];
		// const panel = inst.elems.panels[slug];
		const panel = inst.getPanel(slug);
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
			const onPanels = isChildOf(e.target, inst.getPanel());
			const onCorners = isChildOf(e.target, inst.elems.corners);
			const inCreator = isChildOf(e.target, Array.from(document.querySelectorAll('#creator')));
			if(!onPanels && !onCorners && !inCreator) {
				inst.closePanel();
			}
		});

	}

	resizeEmbed(null, inst);
}

const resizeEmbed = (e, inst) => {
	// const panels = inst.elems.panels;
	const panels = inst.getPanel();
	if(!panels){return}
	Object.keys(panels).forEach(function(slug, i) {
		resizePanel(panels[slug]);
	});
}

const resizePanel = (panel) => {
	if(typeof panel.querySelector!=='function'){return}
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
		let panel = inst.getPanel(slug);
		if(!panel) {
			let panelContent = '';
			if(inst.data&&inst.data[slug]) {
				const panelData = inst.data[slug];
				switch(slug) {
					case 'authorship':
						panelContent = buildAuthorship(inst, panelData);
						break;
					case 'backstory':
						panelContent = buildBackstory(inst, panelData);
						break;
					case 'imagery':
						panelContent = buildImagery(inst, panelData);
						break;
					case 'links':
						panelContent = buildLinks(inst, panelData);
						break;
				}
			}
			const panelTile = inst.cornerTitles[i];
			const panelHTML =
				`<div data-fc-slug="${slug}" class="fc-panel fc-${slug}">
					<div class="fc-panel-title">
						<span>${panelTile}</span>
						<div class="fc-icon fc-expand"></div>
						<div class="fc-icon fc-close"></div>
					</div>
					<div class="fc-panel-title fc-pseudo">
						<span>${inst.corners.indexOf(slug)}</span>
					</div>
					${panelContent ?
					`<div class="fc-scroll">
						<div class="fc-inner">
							${panelContent}
						</div>
					</div>` : ''}
				</div>`;
			inst.elems.embed.innerHTML += panelHTML;
		}
	});

	inst.corners.forEach(function(slug, i) {
		const panel = inst.getPanel(slug);
		panels[slug] = panel;
		const panelExpand = panel.querySelector('.fc-expand');
		panelExpand.addEventListener('click', function(e) {
			inst.toggleExpandPanel();
		});
		const panelClose = panel.querySelector('.fc-close');
		panelClose.addEventListener('click', function(e) {
			inst.closePanel(slug);
		});
	});
	return panels;
}

// Object.entries(panelData).forEach(([prop, val]) => {
// 	if(!val){return}
// 	let row = document.createElement('div');
// 	row.classList.add('fc-row', 'fc-'+prop);
// 	if(prop == 'media') {
// 		const mediaElems = addMedia(val);
// 		if(mediaElems) { row.appendChild(mediaElems) }
// 	} else if(prop == 'links') {
// 		const linkElems = addLinks(val);
// 		if(linkElems) { row.appendChild(linkElems) }
// 	} else if(prop == 'license') {
// 		const licenseElems = addLicense(val);
// 		if(licenseElems) { row.appendChild(licenseElems) }
// 	} else if(prop == 'ethics') {
// 		row.innerHTML = val;
// 	} else if(prop == 'copyright') {
// 		row.innerHTML = '&copy; '+val;
// 	} else if(prop == 'text') {
// 		const paraElems = wrapParagraphs(val);
// 		if(paraElems) { row.appendChild(paraElems) }
// 	} else {
// 		row.innerHTML += val;
// 	}
	// panelInner.appendChild(row);
// });


const createRow = (panelData, obj, includeLabel) => {
	const label = includeLabel ? `<div class="fc-label">${obj.label}</div>` : '';
	const content = panelData[obj.prop];
	return panelData[obj.prop] ?
		`<div class="fc-row">
			${label}
			${content}
		</div>` : '';
}

const createCard = (panelData, obj, includeLabel) => {

}

const buildAuthorship = (inst, panelData) => {
	const html = `
		<div class="fc-row">
			
			${panelData['caption'] ?
				`<div class="fc-field">
					<em>${panelData['caption']}</em>
				</div>`: ''}
			
			${panelData['credit'] ?
				`<div class="fc-field">
					<span class="fc-label">Photograph by</span>
					${panelData['credit']}
				</div>`: ''}
			
			${panelData['ethics'] ?
				`<div class="fc-field">
					<span class="fc-label">Code of ethics</span>
					${panelData['ethics']}
				</div>`: ''}

		</div>

		<div class="fc-row fc-about">

			<div class="fc-about-label">About the photographer</div>
				${panelData['bio'] ?
				`<div class="fc-field">
					${panelData['bio']}
				</div>`: ''}

			<div class="fc-field fc-contact">

				${panelData['website'] ?
				`<div class="fc-field fc-card fc-half">
					<div class="fc-label">Website</div>
					${createLink(panelData['website'])}
				</div>`: ''}

				${panelData['info-contact'] ?
				`<div class="fc-field fc-card fc-half">
					<div class="fc-label">For more info contact</div>
					${createLink(panelData['info-contact'])}
				</div>`: ''}

				${panelData['rights-contact'] ?
				`<div class="fc-field fc-card fc-half">
					<div class="fc-label">For reproduction rights contact</div>
					${createLink(panelData['rights-contact'])}
				</div>`: ''}

			</div>

		</div>`;
	return html;
}

const buildBackstory = (inst, panelData) => {
	const html = `
			${panelData['text'] ?
				`<div class="fc-row">
					<div class="fc-field">
						${panelData['text']}
					</div>
				</div>`:''}`
	return html;
}

const buildImagery = (inst, panelData) => {
	if(!panelData.media){return}
	let html = 
		`<div class="fc-row fc-media">
			${panelData.media.map((obj,i) => {
				obj.source=='image'||!obj.source?
				embedImage(inst,obj,i):embedIframe(inst,obj,i);
				return `<div class="fc-sub-row">
					<div class="fc-sub-media">
					</div>
					${obj.caption?
					`<div class="fc-sub-caption">${obj.caption}</div>`
					:''}
				</div>`
			}).join('')}
		</div>`;
	return html;
}

const buildLinks = (inst, panelData) => {
	if(!panelData.links){return}
	let html = panelData.links.map(obj => {
		let rootUrl = extractRootDomain(obj.url);
		let row = obj.url ?
			`${obj.title?obj.title:rootUrl}
			<div class="fc-sub-url">${rootUrl}</div>` : '';
		return `<div class="fc-row">${createLink(obj.url, row, ['fc-card'])}</div>`
	}).join('');
	return html;
}

// const addLinks = (arr) => {
// 	let rowInner = document.createElement('div');
// 	rowInner.className = 'fc-sub-rows';
// 	arr.forEach(function(obj, index) {
// 		if(!obj){return}
// 		let subRow = document.createElement('div');
// 		subRow.className = 'fc-sub-row';
// 		let a = document.createElement('a');
// 		a.href = obj.url;
// 		a.target = '_blank';
// 		if(obj.title) {
// 			a.innerHTML = obj.title;
// 		}
// 		subRow.appendChild(a);
// 		let rootUrl = extractRootDomain(obj.url);
// 		if(rootUrl) {
// 			let url = document.createElement('div');
// 			url.className = 'fc-sub-url';
// 			url.innerHTML = rootUrl;
// 			subRow.appendChild(url);
// 		}
// 		rowInner.appendChild(subRow);
// 	});
// 	return rowInner;
// }

const embedImage = (inst, obj, index) => {
	if(!obj.url){ return }
	const pseudoImg = new Image();
	pseudoImg.onload = (e) => {
		const img = `<img src="${obj.url}"/>`;
		const panel = inst.elems.panels['imagery'];
		let subMedia = panel.querySelectorAll('.fc-sub-media')[index];
		subMedia.innerHTML += img;
	}
	pseudoImg.onerror = (e) => {
		console.warn('Four Corners cannot load this as an image: '+obj.url, e);
	}
	pseudoImg.src = obj.url;
	return;
}

const embedIframe = (inst, obj, index) => {
	//requests third party APIs to retrieve embed data
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
			const panel = inst.elems.panels['imagery'];
			let subMedia = panel.querySelectorAll('.fc-sub-media')[index];
			if(Number.isInteger(res.width,res.height)) {
				const ratio = res.height/res.width;
				subMedia.classList.add('fc-responsive')
				subMedia.style.paddingBottom = (ratio*100)+'%';
			}
			subMedia.innerHTML = res.html;
		})
		.catch(function(err) {
			console.warn('Four Corners cannot load this media source: '+src, err);
		});
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
	//check if cutline is desired
	if(!inst.data||!inst.opts.cutline) {return}
	const data = inst.data['authorship'];
	const embed = inst.elems.embed
	//create cutline elem
	let cutline = document.createElement('div');
	cutline.classList.add('fc-cutline');
	//add credit to cutline
	if(data.credit) {
		let credit = document.createElement('span');
		credit.classList.add('fc-credit');
		credit.innerHTML = data.credit; 
		cutline.appendChild(credit);
	}
	//add FC link to cutline
	let link = document.createElement('a');
	link.classList.add('fc-link');
	link.innerHTML = 'Four Corners';
	link.href = 'https://fourcornersproject.org';
	link.target = '_blank';
	cutline.appendChild(link);
	//add FC link to cutline
	embed.parentNode.insertBefore(cutline, embed.nextSibling);
}

const parseData = (inst) => {
	//extracts data string stored in attribute
	if(!inst.elems.embed) {return}
	let stringData = inst.elems.embed.dataset.fc;
	if(!stringData){return}
	stringData = stringData;
	//removes attribute from DOM
	delete inst.elems.embed.dataset.fc;
	//parses data string to JSON object
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
		inst.closePanel(slug);	
	} else {
		inst.openPanel(slug);
	}	
}

// const closePanel = (e, inst) => {
// 	inst.closePanel();
// }

const isChildOf = (target, ref) => {
	let answer = false;
	Object.entries(ref).forEach(([key, elem]) => {
		if(elem&&elem.contains(target)) {
			answer = true;
		}
	});
	return answer;
}

const createLink = (href, text, classes = []) => {
	if(!text){text=extractRootDomain(href)}
	if(href.indexOf('@')>-1){href='mailto:'+href}
	return `<a href="${href}" target="_blank" class="${classes.join(' ')}">${text}</a>`;
}

const wrapParagraphs = (val) => {
	let array = val.split(/\n/g);
	let text = '';
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

export default FourCorners;