require('styles.scss');

class FourCorners {
	constructor(opts = {}) {
		let embeds = [];
		if(opts.elem instanceof Element) {
			embeds = [opts.elem];
		} else if(NodeList.prototype.isPrototypeOf(opts.elem)) {
			embeds = Array.from(opts.elem);
		} else {
			const selector = (typeof opts.elem=='string' ? opts.elem : '.fc-embed');
			// embeds = Array.from(document.querySelectorAll(selector+':not(.fc-init)'));
			embeds = Array.from(document.querySelectorAll(selector));
		}
		let insts = [];
		embeds.forEach(function(embed, i) {
			const inst = new FourCornersPhoto(embed, opts);
			insts.push(inst);
		});
		return insts;
	}
}


class FourCornersPhoto {

	constructor(embed, opts) {
		this.cornerSlugs = ['authorship','backstory','imagery','links'];
		this.elems = {
			embed: embed
		};
		const data = parseData(this);
		this.setUpData(data);
		this.onImgLoad = new Event('onImgLoad');
		this.onImgFail = new Event('onImgFail');
		initEmbed(this);
	}

	setUpData(data) {
		const inst = this;
		inst.lang = data ? data.lang : 'en';
		inst.strings = translations[inst.lang];
		inst.photo = data ? data.photo : {};
		inst.opts = Object.assign(defaultOpts, inst.opts);
		inst.opts = data ? Object.assign(inst.opts, data.opts) : {};
		inst.content = {
			authorship: data ? data.authorship : {},
			backstory: data ? data.backstory : {},
			imagery: data ? data.imagery : {},
			links: data ? data.links : {}
		};
		inst.elems.photo = addPhoto(inst);
		inst.elems.panels = addPanels(inst);
		inst.elems.media = embedMedia(inst);
		inst.elems.corners = addCorners(inst);
		inst.elems.cutline = addCutline(inst);

		Object.keys(inst.elems.corners).forEach(function(cornerSlug, i) {
			const cornerElem = inst.elems.corners[cornerSlug];
			if(inst.opts.static) {
				return;
			}
			cornerElem.addEventListener('mouseenter', function(e) {
				hoverCorner(e, inst);
			});
			cornerElem.addEventListener('mouseleave', function(e) {
				unhoverCorner(e, inst);
			});
			cornerElem.addEventListener('click', function(e) {
				clickCorner(e, inst);
			});
		});

		return inst;
	}

	updateModule() {
		const data = parseData(this);
		this.setUpData(data);
		initEmbed(this);
		return this;
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
		const corners = inst.cornerSlugs;
		const embed = inst.elems.embed;
		const corner = inst.elems.corners[slug];
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
		if(!slug) {slug = embed.dataset.fcActive}
		if(!slug) {return}
		const corner = inst.elems.corners[slug];
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
	if(inst.opts.dark) {
		embed.classList.add('fc-dark');
	}
	if(inst.opts.static) {
		embed.classList.add('fc-static');
	} else {
		embed.addEventListener('click', function(e) {
			const onPanels = isChildOf(e.target, inst.getPanel());
			const onCorners = isChildOf(e.target, inst.elems.corners);
			const inCreator = isChildOf(e.target, Array.from(document.querySelectorAll('#creator')));
			if(!onPanels && !onCorners && !inCreator) {
				inst.closePanel();
				inst.elems.embed.classList.remove('fc-full');
			}
		});
	}
	embed.lang = inst.lang;
	if(['ar'].includes(inst.lang)) {
		embed.dir = 'rtl';
	} else {
		embed.dir = 'ltr';
	}

	window.addEventListener('resize', function(e) {
		resizeEmbed(e, inst);
	});
	resizeEmbed(null, inst);
}

const resizeEmbed = (e, inst) => {
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
	let photo, img,
			embed = inst.elems.embed,
			width = inst.photo.width,
			height = inst.photo.height,
			ratio = width/height,
			imgSelector = '.fc-img';

	embed.style.paddingBottom = 100/ratio+'%';
	img = embed.querySelector(imgSelector);
	if(!img) {
		embed.classList.add('fc-empty');
	}

	let pseudoImg = new Image;
	embed.classList.add('fc-loading');

	pseudoImg.onload = (e) => {
		embed.style.paddingBottom = '';
		embed.classList.remove('fc-loading');
		embed.dispatchEvent(inst.onImgLoad);
	}
	pseudoImg.onerror = (e) => {
		embed.classList.remove('fc-loading');
		embed.classList.add('fc-empty');
		embed.dispatchEvent(inst.onImgFail);
	}
	pseudoImg.src = img ? img.src : null;

	return img;
}

const addPanels = (inst) => {	
	let data, panels = {};
	let embed = inst.elems.embed;
	if(!embed){return}
	inst.cornerSlugs.forEach(function(slug, i) {
		const active = inst.opts.active,
					panel = inst.getPanel(slug);
		if(panel) {
			panel.remove();
		}
		let panelInner = '';
		if(inst.content && inst.content[slug]) {
			const panelContent = inst.content[slug];
			switch(slug) {
				case 'authorship':
					panelInner = buildAuthorship(inst, panelContent);
					break;
				case 'backstory':
					panelInner = buildBackstory(inst, panelContent);
					break;
				case 'imagery':
					panelInner = buildImagery(inst, panelContent);
					break;
				case 'links':
					panelInner = buildLinks(inst, panelContent);
					break;
			}
		}
		const panelTile = inst.strings[slug];
		let panelClass = 'fc-panel fc-'+slug;
		if(slug==active) {
			panelClass += ' fc-active'
		}
		const panelHTML =
			`<div data-fc-slug="${slug}" class="${panelClass}">
				<div class="fc-panel-title">
					<span>${panelTile}</span>
					<div class="fc-icon fc-expand" title="Expand this panel"></div>
					<div class="fc-icon fc-close" title="Close this panel"></div>
				</div>
				<div class="fc-panel-title fc-pseudo">
					<span>${inst.cornerSlugs.indexOf(slug)}</span>
				</div>
				${panelInner ?
				`<div class="fc-scroll">
					<div class="fc-inner">
						${panelInner}
					</div>
				</div>` : ''}
			</div>`;
		inst.elems.embed.innerHTML += panelHTML;
	});

	inst.cornerSlugs.forEach(function(slug, i) {
		const panel = inst.getPanel(slug);
		panels[slug] = panel;
		const panelExpand = panel.querySelector('.fc-expand');
		panelExpand.addEventListener('click', function(e) {
			inst.toggleExpandPanel();
		});
		const panelClose = panel.querySelector('.fc-close');
		panelClose.addEventListener('click', function(e) {
			inst.closePanel(slug);
			inst.elems.embed.classList.remove('fc-full');
		});
	});
	return panels;
}

const createRow = (panelContent, obj, includeLabel) => {
	const label = includeLabel ? `<div class="fc-label">${obj.label}</div>` : '';
	const content = panelContent[obj.prop];
	return panelContent[obj.prop] ?
		`<div class="fc-row">
			${label}
			${content}
		</div>` : '';
}

const buildAuthorship = (inst, panelContent) => {
	let html, innerHtml = ``;

	innerHtml +=
		panelContent['caption'] ? 
		`<div class="fc-field">
			<em>${panelContent['caption']}</em>
		</div>` : '';

	let creditHtml = [];
	if(!panelContent.license){panelContent.license={}}
	const hasCopyright = panelContent.license.type=='copyright';
	if(panelContent.license.year) {
		creditHtml.push(`<span>${panelContent.license.year}</span>`);
	}
	if(panelContent.credit) {
		creditHtml.push(`<span>${panelContent.license.holder ? panelContent.credit+'/'+panelContent.license.holder : panelContent.credit}</span>`);
	}

	innerHtml +=
		hasCopyright||panelContent.credit ?
			`<div class="fc-field" data-fc-field="credit">
				<div class="fc-content">
					${hasCopyright ?
						`<div class="fc-copyright">
							${creditHtml.join('')}
						</div>`
					: `<div>${panelContent.credit}</div>`}
				</div>
			</div>` : '';

	innerHtml +=
		panelContent.license &&
		panelContent.license.label &&
		panelContent.license.type=='commons' ?
			`<div class="fc-field" data-fc-field="license">
				<span class="fc-label">${inst.strings.license}</span>
				<span class="fc-content">
					${panelContent.license.url ?
					`<a href="${panelContent.license.url}" target="_blank">
						${panelContent.license.label ? panelContent.license.label : ''}
					</a>`
					: panelContent.license.label ? panelContent.license.label : ''}
				</span>
			</div>` : '';
			
	innerHtml +=
		panelContent.ethics &&
		panelContent.ethics.desc ?
			`<div class="fc-field" data-fc-field="ethics">
				<span class="fc-label">${inst.strings.cod}</span>
				<span class="fc-content">${panelContent.ethics.desc}</span>
			</div>` : '';
	
	innerHtml +=
		panelContent['bio'] ?
		`<div class="fc-field">
			<span class="fc-label">${inst.strings.bio}</span>
			${panelContent['bio']}
		</div>` : '';


	innerHtml +=
		panelContent['website']||panelContent['0-contact']||panelContent['1-contact'] ?
		`<div class="fc-field fc-contact">

			${panelContent['website'] ?
			`<div class="fc-field fc-card">
				<div class="fc-label">${inst.strings.website}</div>
				${createLink(panelContent['website'])}
			</div>`: ''}

			${panelContent['0-contact'] ?
			`<div class="fc-field fc-card">
				<div class="fc-label">${inst.strings.info}</div>
				${createLink(panelContent['0-contact'])}
			</div>`: ''}

			${panelContent['1-contact'] ?
			`<div class="fc-field fc-card">
				<div class="fc-label">${inst.strings.rights}</div>
				${createLink(panelContent['1-contact'])}
			</div>` : ''}

		</div>` : '';

	if(innerHtml.length) {
		html = `<div class="fc-row">${innerHtml}</div>`
	}
	return html;
}

const buildBackstory = (inst, panelContent) => {
	let html = 
		`${panelContent['text'] ?
		`<div class="fc-row">
			${wrapParagraphs(panelContent['text'])}
		</div>`:''}
		${panelContent.media?
			panelContent.media.map((obj, i) => {
			embedIframe(inst,obj,'backstory',i);
			return `<div class="fc-row">
				<div class="fc-media" data-fc-source="${obj.source}"></div>
				${obj.caption ?
				`<div class="fc-sub-caption">${obj.caption}</div>`
				: ''}
				${obj.credit ?
				`<div class="fc-sub-credit">${obj.credit}</div>`
				: ''}
			</div>`
		}).join(''):''}`
	return html;
}

const buildImagery = (inst, panelContent) => {
	if(!panelContent.media){
		return;
	}
	let html = 
		`${panelContent.media.map((obj, i) => {
			return `<div class="fc-row">
				<div class="fc-media" data-fc-source="${obj.source}">
				</div>
				${obj.caption?
				`<div class="fc-sub-caption">${obj.caption}</div>`
				:''}
				${obj.credit?
				`<div class="fc-sub-credit">${obj.credit}</div>`
				:''}
			</div>`
		}).join('')}`;
	return html;
}

const buildLinks = (inst, panelContent) => {
	if(!panelContent.links){
		return
	}
	let html = panelContent.links.map(obj => {
		if(!obj || !obj.url){
			return null
		}
		let rootUrl = extractRootDomain(obj.url);
		let text = obj.url ?
			`${obj.title?obj.title:rootUrl}
			<div class="fc-sub-url">${rootUrl}</div>` : '';
		return `<div class="fc-row">${createLink(obj.url, text, ['fc-card'])}</div>`
	}).join('');
	return html;
}


const embedMedia = (inst) => {
	const media = inst.content.imagery.media;
	if(!media) {return}
	const mediaKeys = Object.keys(media);
	mediaKeys.forEach(function(key, i) {
		const obj = media[key];
		if(obj.source == 'image' || obj.source == 'instagram' || !obj.source) {
			embedImage(inst, obj, 'imagery', i);
		} else {
			embedIframe(inst, obj, 'imagery', i);
		}
	});
	// panelContent.media.map((obj, i) => {
	// 	obj.source == 'image' || !obj.source ? embedImage(inst, obj, 'imagery', i) : embedIframe(inst, obj, 'imagery', i);
	// });
}

const embedImage = (inst, obj, panelKey, index) => {
	if(!obj.url){ return }
	const pseudoImg = new Image();
	pseudoImg.onload = (e) => {
		const img = `<img src="${obj.url}"/>`;
		const panel = inst.elems.panels[panelKey];
		let media = panel.querySelectorAll('.fc-media')[index];
		media.innerHTML += img;
	}
	// pseudoImg.onerror = (e) => {
		// console.warn('Four Corners cannot load this as an image: '+obj.url, e);
		// const img = `<img src="${obj.url}"/>`;
		// const panel = inst.elems.panels[panelKey];
		// let media = panel.querySelectorAll('.fc-media')[index];
		// media.innerHTML += img;
	// }
	pseudoImg.src = obj.url;
	return;
}

const embedIframe = (inst, obj, panelKey, index) => {
	//requests third party APIs to retrieve embed data
	let req = '';
	switch(obj.source) {
		case 'youtube':
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
	const headers = new Headers();
	fetch(req, {
			method: 'GET',
			headers: headers
		})
		.then(res => {
			if (!res.ok) {throw Error(res.statusText)}
			return res.json();
		})
		.then(res => {
			const panel = inst.elems.panels[panelKey];
			let subMedia = panel.querySelectorAll('.fc-media')[index],
					html = res.html;
			if(Number.isInteger(res.width, res.height)) {
				const ratio = res.height/res.width;
				subMedia.classList.add('fc-responsive')
				subMedia.style.paddingBottom = (ratio*100)+'%';
			}
			subMedia.innerHTML = html;
		})
		.catch(function(err) {
			console.warn('Four Corners cannot load this media source: '+obj.url, err);
		});
}

const addCorners = (inst) => {
	let data, corners = {};
	let embed = inst.elems.embed;
	let photo = inst.elems.photo;
	const active = inst.opts.active;
	inst.cornerSlugs.forEach(function(slug, i) {
		const cornerSelector = '.fc-corner[data-fc-slug="'+slug+'"]';
		let cornerElem = embed.querySelector(cornerSelector);
		if(cornerElem) {
			cornerElem.remove();
		}
		cornerElem = document.createElement('div');
		cornerElem.dataset.fcSlug = slug;
		cornerElem.title = 'View '+translations[inst.lang][slug];
		cornerElem.classList.add('fc-corner');
		cornerElem.classList.add('fc-'+slug);

		if(slug==active) {cornerElem.classList.add('fc-active')}
		if(inst.content) {
			data = inst.content[slug];
			if(!data||!Object.keys(data).length) {
				cornerElem.classList.add('fc-empty');
			}
		}
		corners[slug] = cornerElem;
		embed.appendChild(cornerElem);
	});

	return corners;
}

const addCutline = (inst) => {
	const content = inst.content.authorship;
	if(!content&&!inst.opts.caption&&!inst.opts.credit&&!inst.opts.logo) {return}
	const data = inst.content['authorship'];
	if(!data) {return}
	const embed = inst.elems.embed;
	const caption = inst.opts.caption && content.caption ? `<span class="fc-caption">${content.caption}</span>`:'';
	const credit = inst.opts.credit && (content.credit||content.license.holder) ?
		`<span class="fc-credit">
			${(content.credit ? `<span>${content.credit}</span>` : '')+(content.license.holder ? `<span>${content.license.holder}</span>` : '')}
		</span>`
	: '';
	const logo = inst.opts.logo ? `<a href="https://fourcornersproject.org" target="_blank" class="fc-logo" title="This is a Four Corners photo"></a>`:'';
	const cutline =
		`<div class="fc-cutline">
			${caption+credit+logo}
		</div>`;
	embed.insertAdjacentHTML('afterend', cutline);
	return cutline;
}

const parseData = (inst) => {
	if(!inst.elems||!inst.elems.embed) {return}
	let stringData = inst.elems.embed.dataset.fc;
	if(!stringData){return}
	// delete inst.elems.embed.dataset.fc;
	return JSON.parse(stringData);
}

const hoverCorner = (e, inst) => {
	let cornerElem = e.target;
	cornerElem.classList.add('fc-hover');
}

const unhoverCorner = (e, inst) => {
	let cornerElem = e.target;
	cornerElem.classList.remove('fc-hover');
}

const clickCorner = (e, inst) => {
	let cornerElem = e.target;
	let slug = cornerElem.dataset.fcSlug;
	const active = inst.elems.embed.dataset.fcActive;
	if(!slug) {return}	
	if(slug==active) {
		inst.closePanel(slug);	
	} else {
		inst.openPanel(slug);
	}	
}

const isChildOf = (target, ref) => {
	let answer = false;
	Object.entries(ref).forEach(([key, elem]) => {
		if(elem&&elem.contains&&elem.contains(target)) {
			answer = true;
		}
	});
	return answer;
}

const wrapParagraphs = (val) => {
	let array = val.split(/\n/g);
	let text = [];
	let html = 
		array ?
		`${array.map((str,i) => {
			return str ? `<p>${str}</p>` : `<br/>`
		}).join('')}`
		: '';
	return html;
}

const createLink = (href, text, classes = []) => {
	if(!text){text=extractRootDomain(href)}
	if(href.indexOf('@')>-1){href='mailto:'+href}
	return `<a href="${href}" target="_blank" class="${classes.join(' ')}">${text}</a>`;
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

const hasField = (panelContent, fieldKey, subFieldKey) => {
	if(!panelContent){return false}
	if(!panelContent[fieldKey]){return false}
	if(typeof panelContent[fieldKey] == 'object') {
		if(!Object.keys(panelContent[fieldKey]).length){return false}	
	} else {
		if(!panelContent[fieldKey].length){return false}	
	}
	if(!subFieldKey||!panelContent[fieldKey][subFieldKey]){return false}
	if(typeof panelContent[fieldKey][subFieldKey] == 'object') {
		if(!Object.keys(panelContent[fieldKey][subFieldKey]).length){return false}	
	} else {
		if(!panelContent[fieldKey][subFieldKey].length){return false}	
	}
	return true;
}

const translations = {
	en: {
		authorship: 'Authorship',
		backstory: 'Backstory',
		imagery: 'Related Imagery',
		links: 'Links',
		license: 'License',
		cod: 'Code of ethics',
		bio: 'Bio',
		website: 'Website',
		info: 'For more info',
		rights: 'للحصول على حقوق النسخ',
	},
	ar: {
		authorship: 'التأليف',
		backstory: 'القصة وراء الصورة ',
		imagery: 'الصور ذات الصلة',
		links: 'الروابط',
		license: 'الترخيص',
		cod: 'ميثاق أخلاقيات',
		bio: 'السيرة الذاتية',
		website: 'الموقع الكتروني',
		info: 'لمزيد من المعلومات',
		rights: 'للحصول على حقوق النسخ',
	}
}

const defaultOpts = {
	selector: '.fc-embed',
	static: false,
	caption: false,
	credit: false,
	logo: false,
	active: '',
};


module.exports = FourCorners;