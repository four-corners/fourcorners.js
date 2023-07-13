require('regenerator-runtime/runtime');
require('styles.scss');

import { ContentAuth } from '@contentauth/sdk';
// import wasmSrc from '@contentauth/sdk/dist/assets/wasm/toolkit_bg.wasm?url';
// import workerSrc from '@contentauth/sdk/dist/cai-caSdk.worker.min.js?url';

class FourCorners {
	constructor(arg) {
		let args = {};
		if(typeof arg === 'object') {
			if(arg.tagName !== undefined) {
				args.container = arg;
			} else {
				args = arg;
			}
		}
		if(!args.container) return;
		this.elems = {};
		this.elems.container = args.container;
		this.elems.img = this.getImg();
		this.src = args.src ? args.src : (this.elems.img ? this.elems.img.src : null);
		const jsonData = this.parseJsonData();
		this.data = {
			...FC_DEFAULT_DATA,
			...jsonData
		};
		this.options = {
			...FC_DEFAULT_OPTIONS,
			...args.opts,
			...jsonData.options,
		};
		if(this.data.authorship.verify) {
			this.data.authorship.verify = this.getVerifyUrl(false);
		}

		let caSdk;
		if(!Object.values(jsonData).length && args.wasmSrc && args.workerSrc) {
			try {
			  caSdk = new ContentAuth({
			  	wasmSrc: args.wasmSrc,
			  	workerSrc: args.workerSrc
			  });
			} catch (error) {
			  console.warn(error);
			}
		}
		
		setTimeout(async () => {
			let contentAuthData;
			(async () => {
				// console.log(`Before processImage on ${this.src}`);
				contentAuthData = caSdk && this.src ? await caSdk.processImage(this.src) : null;
				// console.log(`After processImage on ${this.src}`);
				if(contentAuthData && contentAuthData.exists) {
					this.provenance = contentAuthData;
					this.data = this.parseContentAuthData();
				}
			})().then(() => {
				this.elems.cutline = this.addCutline();
				this.elems.panels = this.addPanels();
				this.elems.corners = this.addCorners();
				this.addEmbeddedMedia();
				this._handleHoverCorner = this.hoverCorner.bind(this);
				this._handleUnhoverCorner = this.unhoverCorner.bind(this);
				this._handleClickCorner = this.clickCorner.bind(this);
				this._handleClickEmpty = this.clickEmpty.bind(this);
				this._handleClickClose = this.clickClosePanel.bind(this);
				this._handleClickExpand = this.clickExpandPanel.bind(this);
				this.addInteractivity();
				if(this.options.dark) this.elems.container.classList.add('fc-dark');
				this.elems.container.classList.add('fc-init');
			}).catch(e => {
				console.warn(e);
			});
		}, 0);
	}

	//DATA HANDLING

	getVerifyUrl(beta) {
		return `https://verify${beta ? '-beta' : ''}.contentauthenticity.org/inspect?source=${this.src}`;
	}

	parseJsonData() {
		const { container } = this.elems;
		const script = container.querySelector('script');
		let stringData;
		if(script) {
			//If embed JSON is stored in child script tag
			stringData = script.innerHTML
			script.remove();
		} else if(container.hasAttribute('data-fc')) {
			//If embed JSON is stored in data-fc attributte
			stringData = container.dataset.fc;
			delete container.dataset.fc;
		}
		if(!stringData) return {};
		const jsonData = JSON.parse(stringData);
		return jsonData;
	}

	parseContentAuthData() {

		const getAssertionData = (assertion) => {
			let data = {};
			if(this.provenance) {
				this.provenance.claims.forEach((claim, key) => {
					if(claim.assertions.get(assertion)) {
						data = { ...data, ...claim.assertions.get(assertion).data };
					}
				});
			}
			return data;
		}

		const parseContentAuthArray = (prefix, arr) => {
			if(arr) {
				arr = arr.map((obj) => {
					const newObj = {};
					const keys = Object.keys(obj).map((k, i) => {
						const splitArr = k.replace(prefix, '').split(/(?=[A-Z])/);
						const newKey = splitArr[splitArr.length - 1].toLowerCase();
						newObj[newKey] = obj[k];
					});
					return newObj;
				});
			}
			return arr;
		};

		const getNestedValue = (assertionKey, key) => {
			let value;
			const searchKeys = (obj, key) => {
				if(typeof obj !== 'object') return;
				Object.keys(obj).forEach(k => {
					if(k === key) return value = obj[k];
					if(typeof obj[k] === 'object') return searchKeys(obj[k], key);
				});
		 	}
		 	let assertionsData = getAssertionData(assertionKey);
		 	searchKeys(assertionsData, key);
		 	return value;
		}

		const getIptcLocation = () => {
			const data = getNestedValue('stds.iptc.photo-metadata', 'Iptc4xmpExt:LocationCreated');
			if(!data) return;
			const fields = ['Iptc4xmpExt:City', 'Iptc4xmpExt:ProvinceState', 'Iptc4xmpExt:CountryName'];
			const locationStr = fields.map(f => data[f]).filter(d => d).join(', ');
			return locationStr;
		}

		//https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html#_exif_information
		const getGpsTime = () => {
			const data = getNestedValue('stds.exif', 'exif:GPSTimeStamp');
			if(!data) return;

            // We are parsing the invalid legacy time string used in this project
            // Not what the C2PA standard tells us
            // This legacy string looks like: 2022:01:25 01:16:41 +0000
            // This is unfortunately not a valid timestamp by RFC or ISO and so must be
            // parsed manually.

            // Convert into real format: 2022-01-25T01:16:41+0000
			const timeArr = data.split(/[ :]/);
		    const timeStr = `${timeArr[0]}-${timeArr[1]}-${timeArr[2]}T${timeArr[3]}:${timeArr[4]}:${timeArr[5]}${timeArr[6]}`;
            // Now that's parsed and converted into a human readable format:
            // Dec 19, 2012, 10:00:00 PM EST
			return Date(timeStr).toLocaleString('en-US', {dateStyle: 'medium', timeStyle: 'long'});
		}

		const data = {
			'authorship': {
				'caption': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipCaption'),
				'credit': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipCredit'),
				'license': {
					'type': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseType'),
					'year': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseYear'),
					'holder': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseHolder'),
					'label': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseLabel'),
					'desc': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseDesc'),
					'url': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseUrl'),
				},
				'ethics': {
					'label': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipEthicsLabel'),
					'desc': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipEthicsDescription'),
				},
				'bio': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipBio'),
				'website': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipWebsite'),
				'contact': {
					'info': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipContactInfo'),
					'rights': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipContactRights'),
				},
				'location': getIptcLocation(),
				'time': getGpsTime(),
				'verify': this.getVerifyUrl(true),
				'registration': parseContentAuthArray('fourcorners:', getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipRegistration')),
			},
			'backstory': {
				'text': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:backstoryText'),
				'media': parseContentAuthArray('fourcorners:', getNestedValue(FC_ASSERTION_KEY, 'fourcorners:backstoryMedia')),
			},
			'imagery': {
				'media': parseContentAuthArray('fourcorners:', getNestedValue(FC_ASSERTION_KEY, 'fourcorners:imageryMedia')),
			},
			'links': {
				'links': parseContentAuthArray('fourcorners:', getNestedValue(FC_ASSERTION_KEY, 'fourcorners:linksLinks')),
			}
		};
		return data;
	}

	

	//BUILDING DOM ELEMENTS
	getImg() {
		const img = [...this.elems.container.querySelectorAll('img')].find(img => {
			const ext = ((/[.]/.exec(img.src)) ? /[^.]+$/.exec(img.src) : [])[0];
			return ext && ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
		});
		return img;
	}

	insertCornerSvg() {
	  const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	  const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

	  iconSvg.setAttribute('viewBox', '0 0 100 100');
	  iconPath.setAttribute('d', 'M75 24.75H0.25V0.25H75H99.75V25V99.75H75.25L75.25 25V24.75H75Z');

	  iconSvg.appendChild(iconPath);
	  return iconSvg;
	}

	addCorners() {
		const corners = {},
					{ data, elems, options } = this,
					{ container } = elems,
					strings = FC_STRINGS[options.lang];

		FC_CORNER_KEYS.forEach(cornerKey => {
			const cornerTitle = strings[cornerKey] || null,
						cornerElem = document.createElement('div');

			cornerElem.setAttribute('data-fc-key', cornerKey);
			cornerElem.title = `View ${cornerTitle}`;
			cornerElem.classList.add('fc-corner', `fc-${cornerKey}`);

			const cornerIsEmpty = function() {
				if(data.hasOwnProperty(cornerKey)) {
					if(Object.keys(data[cornerKey]).length) return false;	
					return true;
				}	else {
					return true;
				}
			}();

			if(cornerIsEmpty) {
				cornerElem.classList.add('fc-empty');
			}

			container.appendChild(cornerElem);
			corners[cornerKey] = cornerElem;
		});

		return corners;
	}

	addPanels() {	
		const { data, elems, options } = this;
		const { container } = elems;
		const strings = FC_STRINGS[options.lang];
		const panels = {};
		FC_CORNER_KEYS.forEach(cornerKey => {
			const cornerTitle = strings[cornerKey] || null,
						panelTile = strings[cornerKey] || null;
			let panelClass = `fc-panel fc-${cornerKey}`,
					panelInner;

			switch(cornerKey) {
				case 'authorship':
					panelInner = this.buildAuthorship();
					break;
				case 'backstory':
					panelInner = this.buildBackstory();
					break;
				case 'imagery':
					panelInner = this.buildImagery();
					break;
				case 'links':
					panelInner = this.buildLinks();
					break;
			}
		
			const panelHTML =
				`<div data-fc-key='${cornerKey}' class='${panelClass}'>
					<div class='fc-panel-title'>
						<span>${panelTile}</span>
						<div class='fc-icon fc-expand' title='Expand this panel'></div>
						<div class='fc-icon fc-close' title='Close this panel'></div>
					</div>
					<div class='fc-panel-title fc-pseudo'>
						<span>${FC_CORNER_KEYS.indexOf(cornerKey)}</span>
					</div>
					${panelInner ?
						`<div class='fc-scroll'>
							<div class='fc-inner ${cornerKey === 'imagery' || cornerKey === 'links' ? 'fc-grid' : ''}'>
								${panelInner}
							</div>
						</div>`
					: ''}
				</div>`;
			container.insertAdjacentHTML('afterbegin', panelHTML);
			panels[cornerKey] = this.getPanel(cornerKey);
		});
		return panels;
	}

	buildAuthorship() {
		const {
			caption,
			credit,
			bio,
			ethics,
			website,
			contact,
			license,
			location,
			time,
			verify,
			registration,
		} = this.data.authorship;
		const strings = FC_STRINGS[this.options.lang];
		const hasContact = Boolean(contact && (contact.info || contact.rights))
		const hasAuthorshipContent = Boolean(caption || credit || bio || ethics || website || license || location || time || verify || hasContact);
		const hasInfoCard = Boolean(credit || (ethics && ethics.desc) || bio || website || hasContact);
		const hasCertCard = Boolean(location || time || (registration && registration.length));

		return(
			hasAuthorshipContent ?
				`<div class='fc-row'>
					${caption ? 
						`<div class='fc-field'>
							<span class='fc-label'>
								${strings.caption}:
							</span>
							<span class='fc-content'>
								${caption}
							</span>
						</div>`
					: ''}

					${hasInfoCard ?
						`<details class='fc-details'>

							<summary class='fc-summary'>
								<div class='fc-field'>
									<span class='fc-label'>
										${strings.credit}:
									</span>
									<span class='fc-content'>
										${credit ? credit : 'Unknown'}
									</span>
									<div class='fc-icon fc-expand' title='Read more ${credit ? `about ${credit}` : ''}'></div>
								</div>
							</summary>

							<div class='fc-card'>

								${bio ? 
									`<div class='fc-field'>
										<span class='fc-label'>
											${strings.bio}:
										</span>
										<span class='fc-content'>
											${bio}
										</span>
									</div>`
								: ''}

								${ethics && ethics.desc ? 
									`<div class='fc-field'>
										<span class='fc-label'>
											${strings.coe}:
										</span>
										<span class='fc-content'>
											${ethics.desc}
										</span>
									</div>`
								: ''}

								${website ? 
									`<div class='fc-field'>
										<span class='fc-label'>
											${strings.website}:
										</span>
										<span class='fc-content'>
											${this.createLink(website)}
										</span>
									</div>`
								: ''}

								${hasContact && contact.info ? 
									`<div class='fc-field'>
										<span class='fc-label'>
											${strings.info}:
										</span>
										<span class='fc-content'>
											${this.createLink(contact.info)}
										</span>
									</div>`
								: ''}

								${hasContact && contact.rights ? 
									`<div class='fc-field'>
										<span class='fc-label'>
											${strings.rights}:
										</span>
										<span class='fc-content'>
											${this.createLink(contact.rights)}
										</span>
									</div>`
								: ''}

							</div>

						</details>`

					: credit ?
						`<div class='fc-field'>
							<span class='fc-label'>
								${strings.credit}:
							</span>
							<span class='fc-content'>
								${credit ? credit : 'Unknown'}
							</span>
						</div>`
					: ''}

					${license && license.type ? 
						`<div class='fc-field'>
							<span class='fc-label'>
								${strings.license}:
							</span>
							<span class='fc-content'>
								${license.type === 'copyright' ?
									`&#169;
									${license.holder ?
										`${license.holder}${license.year ? `, ${license.year}` : ''}`
									: `${credit}${license.year ? `, ${license.year}` : ''}`}`
								: ''}
								${license.type === 'commons' ?
									`${license.url ?
										`<a href='${license.url}' target='_blank'>
											${license.label ? license.label : ''}
										</a>`
									: license.label ? license.label : ''}`
								: ''}
							</span>
						</div>`
					: ''}

					${hasCertCard ?
						`<div class='fc-card'>
							<div class='fc-field'>
								<strong class='fc-label'>
									${strings.cert}
								</strong>
							</div>
							${location  ?
								`<div class='fc-field'>
									${location ?
										`<span class='fc-label'>
											${strings.location}:
										</span>
										<span class='fc-content'>
											${location}
										</span>`
									: ''}
								</div>`
							: ''}

							${time  ?
								`<div class='fc-field'>
									${time ?
										`<span class='fc-label'>
											${strings.time}:
										</span>
										<span class='fc-content'>
											${time}
										</span>`
									: ''}
								</div>`
							: ''}

							${registration && registration.length ? 
								`<details class='fc-details'>
									<summary class='fc-summary'>
										<div class='fc-field'>
											<span class='fc-label'>
												${strings.reg}
											</span>
											<div class='fc-icon fc-expand' title='Open'></div>
										</div>
										<div>
									</summary>
									${registration.map(r =>
										`<div class='fc-field fc-indent'>
											<div class='fc-content fc-flex'>
												<span class='fc-label'>
													${r.title}:
												</span>
												&nbsp;
												<a href='${r.url}' target='_blank' class='fc-truncate fc-underline'>
													${r.text}
												</a>
											</div>
										</div>`
									).join('')}
									<div class='fc-field' />					
								</details>`
							: ''}

							${verify  ?
								`<div class='fc-field fc-sub-source'>
									${strings.verify_intro} ${this.createLink(verify, strings.verify_link)}
								</div>`
							: ''}

						</div>`
					: ''}

					${!hasCertCard && verify ?
						`<div class='fc-field fc-sub-source'>
								${strings.verify_intro} ${this.createLink(verify, strings.verify_link)}
						</div>`
					: ''}
				</div>`
			: ''
		);
	}

	buildBackstory() {
		const {
			text,
			media,
		} = this.data.backstory;
		const hasBackstoryContent = text || media;
		return(
			hasBackstoryContent ?
				`${text ?
					`<div class='fc-row'>
						${this.insertParagraphs(text)}
					</div>`
				: ''}
				${media ?
					media.map((obj, index) => {
						// this.embedExternal(this, obj, 'backstory', index);
						return (
							`<div class='fc-row'>
								<div class='fc-media'>
									<div class='fc-media-embed' data-fc-source='${obj.source}' data-fc-url='${obj.url}' data-fc-index='${index}'></div>
									${obj.caption || obj.credit ?
										`<div class='fc-media-info'>
											${obj.caption ? `<span class='fc-sub-caption'>${obj.caption}</span>` : ''}
											${obj.credit ? `<span class='fc-sub-credit'>${obj.credit}</span>` : ''}
										</div>`
									: ''}
								</div>
							</div>`
						)
					}).join('')
				: ''}`
			: ''
		);
	}

	buildImagery() {
		const { media } = this.data.imagery;

		return (
			`${media ?
				media.map((obj, index) => {
					const isExternal = ['instagram', 'youtube', 'vimeo'].includes(obj.source);
					return(
						`<div class='fc-row'>
							<div class='fc-media'>
								<div class='fc-media-embed' data-fc-source='${obj.source}' data-fc-url='${obj.url}' data-fc-index='${index}'>
								</div>
								${obj.caption || obj.credit ?
									`<div class='fc-media-info'>
										${obj.caption ? `<span class='fc-sub-caption'>${obj.caption}</span>` : ''}
										${obj.credit ? `<em class='fc-sub-credit'>${obj.credit}</em>` : ''}
										${!isExternal ?
											`<span class='fc-sub-source'>
												${obj.url ?
													`(<a href='${obj.url}' target='_blank'>View full image</a>)`
												: ''}
											</span>`
										: ''}
										${isExternal ?
											`<span class='fc-sub-source'>
												${obj.url ?
													`(<a href='${obj.url}' target='_blank'>View on ${this.extractRootDomain(obj.url)}</a>)`
												: ''}
											</span>`
										: ''}
									</div>`
								: ''}
							</div>
						</div>`
					)
				}).join('')
			: ''}`
		);
	}

	buildLinks() {
		const { links } = this.data.links;

		return(
			`${links ?
				links.filter(obj => obj.url).map((obj, index) => {
					const simpleUrl = this.simplifyUrl(obj.url);
					const text = `${obj.title ? obj.title : simpleUrl}<div class='fc-sub-url'>${simpleUrl}</div>`;
					return (
						`<div class='fc-row'>
							${this.createLink(obj.url, text, ['fc-card'])}
						</div>`
					)
				}).join('')
			: ''}`
		);
	}

	addCutline() {
		const { data, elems, options } = this,
					{ container } = elems,
					{ credit, caption, license } = data.authorship,
					showCaption = options.caption && caption,
					showCredit = options.credit && credit,
					showLicense = options.license && license.holder && (credit !== license.holder),
					showLogo = options.logo,
					showCutline = showCaption || showCredit || showLicense || showLogo;

		if(!showCutline) return false;

		const html = 
			`${showCaption || showCredit || showLogo ?
				`<div class='fc-cutline'>
					${showCaption ?
						`<span class='fc-caption'>
							${showCaption ? `<span>${caption}</span>` : ''}
						</span>`
					: ''}
					${showCredit ?
						`<span class='fc-credit'>
							${showCredit ? `<span>${credit}</span>` : ''}
							${showCredit && showLicense ? `/` : ''}
							${showLicense ? `<span>${license.holder}</span>` : ''}
						</span>`
					: ''}
					${showLogo ?
						`<a href='https://fourcornersproject.org' target='_blank' class='fc-logo' title='This is a Four Corners Project photo'>
							<span>Four Corners Project</span>
						</a>`
					: ''}
				</div>`
			: ''}`;

		container.insertAdjacentHTML('afterend', html);
		return container.querySelector('.fc-cutline');
	}

	addEmbeddedMedia() {
		['imagery', 'backstory'].forEach((panelKey) => {
			const panel = this.getPanel(panelKey);
			const mediaWrappers = panel.querySelectorAll('.fc-media-embed');
			mediaWrappers.forEach((elem) => {
				const { fcSource, fcUrl, fcIndex } = elem.dataset;
				const obj = {
					source: fcSource,
					url: fcUrl,
					index: fcIndex
				}
				if(obj.source === 'image') {
				  this.insertMediaImage(obj, panelKey);
				} else {
					this.insertMediaEmbed(obj, panelKey);
				}
			});
		});
	}

	insertMediaImage(obj, panelKey) {
		const panel = this.getPanel(panelKey),
					subMedia = panel.querySelectorAll('.fc-media-embed')[obj.index],
					pseudoImg = new Image();
		let html = '';
		html = `<img src='${obj.url}' />`;
		subMedia.innerHTML = html;
		// pseudoImg.onload = () => {
		// 	html = `<img src='${obj.url}' />`;
		// 	subMedia.innerHTML = html;
		// };
		pseudoImg.onerror = () => {
			subMedia.parentNode.parentNode.remove();
			console.warn(`Four Corners cannot load this media.`, {
				url: obj.url,
				error: `Embedding failed and was removed from the imagery panel`
			});
		};
		pseudoImg.src = obj.url;
	}

	insertMediaEmbed(obj, panelKey) {
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
		}).then(res => {
			if (!res.ok) {throw Error(res.statusText)}
			return res.json();
		}).then(res => {
			const panel = this.getPanel(panelKey),
						subMedia = panel.querySelectorAll('.fc-media-embed')[obj.index];
			let html = '';

			if(obj.source == 'instagram') {
				html = `<img src='${res.thumbnail_url}'/>`;
			} else {
				html = res.html;
			}

			if(Number.isInteger(res.width, res.height)) {
				const ratio = res.height/res.width;
				subMedia.classList.add('fc-responsive')
				subMedia.style.paddingBottom = `${ratio * 100}%`;
			}
			
			if(html) {
				subMedia.innerHTML = html;
			} else {
				subMedia.parentNode.remove();
				console.warn(`Four Corners cannot load this media.`, {
					url: obj.url,
					error: `Embedding failed and was removed from the ${panelKey} panel`
				});
			}
		}).catch(function(err) {
			console.warn(`Four Corners cannot load this media.`, {
				url: obj.url,
				error: err
			});
		});
	}

	insertParagraphs(val) {
		let array = val.split(/\n/g);
		let text = [];
		let html = 
			array ?
			`${array.map((str,i) => {
				return str ? `<p>${str}</p>` : `<br/>`
			}).join('')}`
			: ';'
		return html;
	}

	createLink(href, text, classes = []) {
		if(!text) {
			text = this.simplifyUrl(href);
		}
		if(this.validateEmail(href)) {
			href = `mailto:${href}`;
		}
		return `<a href='${href}' target='_blank' class='${classes.join(' ')}'>${text}</a>`;
	}

	//INTERACTIVITY

	addInteractivity() {
		FC_CORNER_KEYS.forEach(key => {
			const panel = this.getPanel(key);
			const corner = this.elems.corners[key];
			panel.querySelector('.fc-expand').addEventListener('click', this._handleClickExpand);
			panel.querySelector('.fc-close').addEventListener('click', this._handleClickClose);
			corner.addEventListener('mouseenter', this._handleHoverCorner);
			corner.addEventListener('mouseleave', this._handleUnhoverCorner);
			corner.addEventListener('click', this._handleClickCorner);
			corner.classList.add('fc-interactive');
		});
		this.elems.container.addEventListener('click', this._handleClickEmpty);
		this.elems.container.classList.add('fc-embed');
	}

	destroy() {
		FC_CORNER_KEYS.forEach(key => {
			const panel = this.getPanel(key);
			const corner = this.elems.corners ? this.elems.corners[key] : null;
			if(panel) {
				panel.querySelector('.fc-expand').removeEventListener('click', this._handleClickExpand);
				panel.querySelector('.fc-close').removeEventListener('click', this._handleClickClose);
				panel.remove();
			}
			if(corner) {
				corner.removeEventListener('mouseenter', this._handleHoverCorner);
				corner.removeEventListener('mouseleave', this._handleUnhoverCorner);
				corner.removeEventListener('click', this._handleClickCorner);
				corner.remove();
			}
		});
		this.elems.container.removeEventListener('click', this._handleClickEmpty);
	}

	openPanel(cornerKey) {
		const { elems } = this;
		const { container } = elems;
		const corner = this.getCorner(cornerKey);
		const panel = this.getPanel(cornerKey);
		container.classList.remove('fc-full');
		container.classList.add('fc-active');
		container.setAttribute('data-fc-active', cornerKey);
		if(corner) corner.classList.add('fc-active');
		if(panel) panel.classList.add('fc-active');
		FC_CORNER_KEYS.forEach(key => {
			if(key !== cornerKey) this.closePanel(key);
		});
	}

	closePanel(cornerKey) {
		const { elems } = this;
		const { container, corners, panels } = elems;
		const corner = this.getCorner(cornerKey);
		const panel = this.getPanel(cornerKey);
		if(corner) corner.classList.remove('fc-active');
		if(panel) panel.classList.remove('fc-active');
		container.classList.remove('fc-active');
		container.setAttribute('data-fc-active', '');
		setTimeout(() => container.classList.remove('fc-full'));
	}

	closePanels() {
		FC_CORNER_KEYS.forEach(cornerKeys => this.closePanel(cornerKeys));
	}

	clickClosePanel(e) {
		this.closePanels();
	}

	clickExpandPanel() {
		this.elems.container.classList.toggle('fc-full');
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
		const cornerElem = e.target,
					cornerKey = cornerElem.getAttribute('data-fc-key'),
					activeKey = this.elems.container.getAttribute('data-fc-active');

		if(cornerKey === activeKey) {
			this.closePanel(cornerKey);	
		} else {
			this.openPanel(cornerKey);
		}	
	}

	clickEmpty(e) {
		const onPanels = this.isChildOf(e.target, this.getPanels());
		const onCorners = this.isChildOf(e.target, this.elems.corners);
		if(!onPanels && !onCorners) {
			this.closePanels();
		}
	}

	//HELPERS
	getCorner(cornerKey) {
		return this.elems.container.querySelector(`.fc-corner[data-fc-key='${cornerKey}']`);
	}

	getPanel(cornerKey) {
		return this.elems.container.querySelector(`.fc-panel[data-fc-key='${cornerKey}']`);
	}

	getPanels() {
		return Array.from(this.elems.container.querySelectorAll('.fc-panel'));
	}

	isChildOf(target, ref) {
		let answer = false;
		Object.entries(ref).forEach(([key, elem]) => {
			if(elem && elem.contains && elem.contains(target)) {
				answer = true;
			}
		});
		return answer;
	}

	validateEmail(string) {
	  return String(string)
	    .toLowerCase()
	    .match(
	      /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	    );
	}

	simplifyUrl(url) {
		return url.replace('www.', '').replace(/^https?:\/\//, '').replace(/\/$/, '');
	}

	extractHostname(url) {
		let hostname;
		if(!url) return null;
		if(url.indexOf('//') > -1) {
			hostname = url.split('/')[2];
		} else {
			hostname = url.split('/')[0];
		}
		hostname = hostname.split(':')[0];
		hostname = hostname.split('?')[0];
		return hostname;
	}

	extractRootDomain(url) {
		if(!url) return null;
		let domain = this.extractHostname(url);
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

}


const FC_CORNER_KEYS = [
	'authorship',
	'backstory',
	'imagery',
	'links',
];

const FC_DEFAULT_DATA = {
	'authorship': {},
	'backstory': {},
	'imagery': {},
	'links': {},
};

const FC_OPTION_KEYS = [
	'caption',
	'credit',
	'logo',
	'dark',
	'inherit',
];

const FC_DEFAULT_OPTIONS = {
	caption: false,
	credit: false,
	logo: false,
	dark: false,
	inherit: false,
	verify: false,
	lang: 'en',
};

const FC_ASSERTION_KEY = 'org.fourcorners.context';

const FC_STRINGS = {
	en: {
		authorship: 'Authorship',
		backstory: 'Backstory',
		imagery: 'Related Imagery',
		links: 'Links',
		caption: 'Caption',
		credit: 'Credit',
		license: 'License',
		coe: 'Code of ethics',
		bio: 'About the photographer',
		website: 'Website',
		info: 'For more info',
		rights: 'For reproduction rights',
		auth: '& Authentication',
		cert: 'Capture Certificate',
		location: 'Location',
		time: 'Time of capture',
		reg: 'Registration links',
		verify_intro: 'Explore more authenticated data and credentials',
		verify_link: 'here',
	},
	ar: {
		authorship: 'التأليف',
		backstory: 'القصة وراء الصورة ',
		imagery: 'الصور ذات الصلة',
		links: 'الروابط',
		caption: 'Caption',
		credit: 'Credit',
		license: 'الترخيص',
		coe: 'ميثاق أخلاقيات',
		bio: 'السيرة الذاتية',
		website: 'الموقع الكتروني',
		info: 'لمزيد من المعلومات',
		rights: 'للحصول على حقوق النسخ',
	}
};

export default FourCorners;