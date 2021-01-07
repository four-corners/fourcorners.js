require('styles.scss');

class FourCorners {
	constructor(opts = {}) {
		let embeds = [];
		if(opts.elem instanceof Element) {
			embeds = [opts.elem];
		} else if(NodeList.prototype.isPrototypeOf(opts.elem)) {
			embeds = Array.from(opts.elem);
		} else {
			const selector = (typeof opts.selector == 'string' ? opts.selector : '.fc-embed');
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
		this.opts = opts;
		const data = parseData(this);
		this.strings = {};
		this.setUpData(data);
		this.onImgLoad = new Event('onImgLoad');
		this.onImgFail = new Event('onImgFail');
		this.initModule();
	}

	setUpData(data) {
		this.lang = data && data.lang ? data.lang : 'en';
		this.strings = translations[this.lang];
		this.photo = getPhoto(this, data);
		this.opts = Object.assign(defaultOpts, this.opts);
		this.opts = data ? Object.assign(this.opts, data.opts) : {};
		this.content = {
			authorship: data ? data.authorship : {},
			backstory: data ? data.backstory : {},
			imagery: data ? data.imagery : {},
			links: data ? data.links : {},
		};
		this.elems.photo = this.addPhoto();
		this.elems.panels = this.addPanels();
		this.elems.corners = this.addCorners();
		this.elems.media = this.embedMedia();
		this.elems.cutline = this.addCutline();

		const inst = this;
		Object.keys(this.elems.corners).forEach(function(cornerSlug, i) {
			let cornerElem = inst.elems.corners[cornerSlug];
			if(inst.opts.static || cornerElem.classList.contains('fc-interactive')) {
				return;
			}
			cornerElem.addEventListener('mouseenter', inst.hoverCorner.bind(inst) );
			cornerElem.addEventListener('mouseleave', inst.unhoverCorner.bind(inst) );
			cornerElem.addEventListener('click', inst.clickCorner.bind(inst) );
			cornerElem.classList.add("fc-interactive");
		});

		return this;
	}


	initModule() {
		const self = this,
					embed = this.elems.embed;
		embed.classList.add('fc-init');
		if(this.opts.dark) {
			embed.classList.add('fc-dark');
		}
		if(this.opts.static) {
			embed.classList.add('fc-static');
		} else {
			embed.addEventListener('click', function(e) {
				const onPanels = isChildOf(e.target, self.getPanel());
				const onCorners = isChildOf(e.target, self.elems.corners);
				const inCreator = isChildOf(e.target, Array.from(document.querySelectorAll('#creator')));
				if(!onPanels && !onCorners && !inCreator) {
					self.closePanel();
					self.elems.embed.classList.remove('fc-full');
				}
			});
		}
		embed.lang = this.lang;
		if(['ar'].includes(this.lang)) {
			embed.dir = 'rtl';
		} else {
			embed.dir = 'ltr';
		}

		window.addEventListener('resize', this.resizeModule.bind(this));
		this.resizeModule();
	}

	updateModule(data) {
		if(!data) {
			const data = parseData(this);
		}
		this.setUpData(data);
		this.initModule();
		return this;
	}

	getPanel(cornerSlug) {
		const embed = this.elems.embed;
		if(!embed){return}
		let panelSelector = '.fc-panel';
		if(cornerSlug) {
			panelSelector += '[data-fc-slug="'+cornerSlug+'"]';
			return embed.querySelector(panelSelector);
		}
		return embed.querySelectorAll(panelSelector);
	}

	openPanel(cornerSlug) {
		const inst = this;
		const corners = inst.cornerSlugs;
		const embed = inst.elems.embed;
		const corner = inst.elems.corners[cornerSlug];
		let panel = inst.getPanel(cornerSlug);
		embed.classList.remove('fc-full');
		if(embed && corner && panel) {
			embed.dataset.fcActive = cornerSlug;
			embed.classList.add('fc-active');
			corner.classList.add('fc-active');
			panel.classList.add('fc-active');
		}
		corners.forEach(function(_cornerSlug, i) {
			if(_cornerSlug!=cornerSlug) {
				inst.closePanel(_cornerSlug);
			}
		});
	}

	closePanel(cornerSlug) {
		const inst = this;
		const embed = inst.elems.embed;
		if(!cornerSlug) {cornerSlug = embed.dataset.fcActive}
		if(!cornerSlug) {return}
		const corner = inst.elems.corners[cornerSlug];
		const panel = inst.getPanel(cornerSlug);
		if(cornerSlug==embed.dataset.fcActive) {
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

	hoverCorner(e) {
		let cornerElem = e.target;
		cornerElem.classList.add('fc-hover');
	}

	unhoverCorner(e) {
		let cornerElem = e.target;
		cornerElem.classList.remove('fc-hover');
	}

	clickCorner(e) {
		let cornerElem = e.target,
				cornerSlug = cornerElem.dataset.fcSlug;
		const active = this.elems.embed.dataset.fcActive;
		if(!cornerSlug) {return}	
		if(cornerSlug==active) {
			this.closePanel(cornerSlug);	
		} else {
			this.openPanel(cornerSlug);
		}	
	}

	addCorners() {
		let data, self = this, corners = {};
		let embed = this.elems.embed,
				photo = this.elems.photo;
		const active = this.opts.active,
					langTrans = translations[this.lang];
		this.cornerSlugs.forEach(function(cornerSlug, i) {
			const cornerSelector = '.fc-corner[data-fc-slug="'+cornerSlug+'"]',
						cornerTitle = langTrans ? langTrans[cornerSlug] : null;
			let cornerElem = embed.querySelector(cornerSelector),
					cornerExists = cornerElem ? true : false;
			if(!cornerElem) {
				cornerElem = document.createElement('div');
			}
			cornerElem.dataset.fcSlug = cornerSlug;
			cornerElem.title = cornerTitle ? 'View '+cornerTitle : null;
			cornerElem.classList.add('fc-corner');
			cornerElem.classList.add('fc-'+cornerSlug);

			if(cornerSlug==active) {cornerElem.classList.add('fc-active')}
			if(self.content) {
				data = self.content[cornerSlug];
				if(!data||!Object.keys(data).length) {
					cornerElem.classList.add('fc-empty');
				}
			}
			corners[cornerSlug] = cornerElem;
			if(!cornerExists) {
				embed.appendChild(cornerElem);
			}
		});

		return corners;
	}

	addPanels() {	
		let data, self = this, panels = {};
		let embed = this.elems.embed;
		if(!embed){return}
		this.cornerSlugs.forEach(function(cornerSlug, i) {
			const active = self.opts.active,
						panel = self.getPanel(cornerSlug);
			if(panel) {
				// return;
				panel.remove();
			}
			let panelInner = '';
			if(self.content && self.content[cornerSlug]) {
				const panelContent = self.content[cornerSlug];
				switch(cornerSlug) {
					case 'authorship':
						panelInner = buildAuthorship(self, panelContent);
						break;
					case 'backstory':
						panelInner = buildBackstory(self, panelContent);
						break;
					case 'imagery':
						panelInner = buildImagery(self, panelContent);
						break;
					case 'links':
						panelInner = buildLinks(self, panelContent);
						break;
				}
			}
			const panelTile = self.strings[cornerSlug];
			let panelClass = 'fc-panel fc-'+cornerSlug;
			if(cornerSlug==active) {
				panelClass += ' fc-active'
			}
			const panelHTML =
				`<div data-fc-slug="${cornerSlug}" class="${panelClass}">
					<div class="fc-panel-title">
						<span>${panelTile}</span>
						<div class="fc-icon fc-expand" title="Expand this panel"></div>
						<div class="fc-icon fc-close" title="Close this panel"></div>
					</div>
					<div class="fc-panel-title fc-pseudo">
						<span>${self.cornerSlugs.indexOf(cornerSlug)}</span>
					</div>
					${panelInner ?
					`<div class="fc-scroll">
						<div class="fc-inner">
							${panelInner}
						</div>
					</div>` : ''}
				</div>`;
			self.elems.embed.innerHTML += panelHTML;
		});

		this.cornerSlugs.forEach(function(cornerSlug, i) {
			const panel = self.getPanel(cornerSlug);
			panels[cornerSlug] = panel;
			const panelExpand = panel.querySelector('.fc-expand');
			panelExpand.addEventListener('click', function(e) {
				self.toggleExpandPanel();
			});
			const panelClose = panel.querySelector('.fc-close');
			panelClose.addEventListener('click', function(e) {
				self.closePanel(cornerSlug);
				self.elems.embed.classList.remove('fc-full');
			});
		});
		return panels;
	}

	addPhoto() {
		let photo, img,
				self = this,
				embed = this.elems.embed,
				width = this.photo ? this.photo.width : null,
				height = this.photo ? this.photo.height : null,
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
			embed.dispatchEvent(self.onImgLoad);
		}
		pseudoImg.onerror = (e) => {
			embed.classList.remove('fc-loading');
			embed.classList.add('fc-empty');
			embed.dispatchEvent(self.onImgFail);
		}
		pseudoImg.src = img ? img.src : null;

		return img;
	}

	addCutline() {
		const content = this.content.authorship;
		if(!content&&!this.opts.caption&&!this.opts.credit&&!this.opts.logo) {return}
		const data = this.content['authorship'];
		if(!data) {return}
		const embed = this.elems.embed;
		const caption = this.opts.caption && content.caption ? `<span class="fc-caption">${content.caption}</span>`: '';
		const credit = this.opts.credit && (content.credit||content.license.holder) ?
			`<div class="fc-credit">
				${(content.credit ? `<span>${content.credit}</span>` : '')+(content.license.holder ? `<span>${content.license.holder}</span>` : '')}
			</div>`
		: '';
		const logo = this.opts.logo ? `<a href="https://fourcornersproject.org" target="_blank" class="fc-logo" title="This is a Four Corners photo"></a>`: '';
		const cutline =
			`<div class="fc-cutline">
				${caption+credit+logo}
			</div>`;
		embed.insertAdjacentHTML('afterend', cutline);
		return cutline;
	}

	embedMedia() {
		const self = this,
					imageryContent = this.content.imagery;
		if(!imageryContent) {return}
		const media = imageryContent.media;
		if(!media) {return}
		const mediaKeys = Object.keys(media);
		mediaKeys.forEach(function(key, i) {
			const obj = media[key];
			if(obj.source == 'image' || !obj.source) {
				embedImage(self, obj, 'imagery', i);
			} else {
				embedExternal(self, obj, 'imagery', i);
			}
		});
		// panelContent.media.map((obj, i) => {
		// 	obj.source == 'image' || !obj.source ? embedImage(inst, obj, 'imagery', i) : embedExternal(inst, obj, 'imagery', i);
		// });
	}

	resizeModule(e) {
		const panels = this.getPanel();
		if(!panels){return}
		Object.keys(panels).forEach(function(cornerSlug, i) {
			resizePanel(panels[cornerSlug]);
		});
	}

}

const getPhoto = (inst, data) => {
	if(data && data.photo && data.photo.src) {
		return data.photo;
	}
	const img = inst.elems.embed ? inst.elems.embed.querySelector('img') : null,
				imgSrc = img ? img.src : null;
	return {
		src: imgSrc
	}
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
		</div>`: ''}
		${panelContent.media?
			panelContent.media.map((obj, i) => {
			embedExternal(inst,obj,'backstory',i);
			return `<div class="fc-row">
				<div class="fc-media" data-fc-source="${obj.source}"></div>
				${obj.caption ?
				`<div class="fc-sub-caption">${obj.caption}</div>`
				: ''}
				${obj.credit ?
				`<div class="fc-sub-credit">${obj.credit}</div>`
				: ''}
			</div>`
		}).join(''): ''}`
	return html;
}

const buildImagery = (inst, panelContent) => {
	if(!panelContent.media){
		return;
	}
	let html = 
		`${panelContent.media.map((obj, i) => {
			const isExternal = ['instagram', 'youtube', 'vimeo'].includes(obj.source);
			return `<div class="fc-row">
				<div class="fc-media" data-fc-source="${obj.source}">
				</div>
				${obj.caption ?
				`<div class="fc-sub-caption">${obj.caption}</div>`
				: ''}
				${obj.credit || isExternal ?
					`<div class="fc-sub-credit">
						${isExternal && obj.url ? `<a href="${obj.url}" target="_blank">` : ''}
							${obj.credit || 'View on '+extractRootDomain(obj.url)}
						${isExternal ? `</a>` : ''}
					</div>`
				: ''}
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

const embedExternal = (inst, obj, panelKey, index) => {
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
		case 'instagram':
			req = 'https://api.instagram.com/oembed/?url='+obj.url;
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
					html = '';
			if(obj.source == 'instagram') {
				html = `<img src="${res.thumbnail_url}"/>`;
			} else {
				html = res.html;
			}

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

const parseData = (inst) => {
	if(!inst.elems||!inst.elems.embed) {return}
	const embed = inst.elems.embed,
				scriptTag = embed.querySelector("script");
	let stringData;
	if(scriptTag) {
		//If embed JSON is stored in child script tag (NEW)
		stringData = scriptTag.innerHTML;
		scriptTag.remove();
	} else if(embed.hasAttribute("data-fc")) {
		//If embed JSON is stored in data-fc attributte (OLD)
		stringData = embed.dataset.fc;
		delete embed.dataset.fc;
	}
	if(!stringData){return}
	return JSON.parse(stringData);
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
	if(!url){return null}
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
	if(!url){return null}
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