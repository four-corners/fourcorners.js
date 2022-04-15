require("regenerator-runtime/runtime");
require("styles.scss");

import { ContentAuth } from "@contentauth/sdk";
// import wasmSrc from "@contentauth/sdk/dist/assets/wasm/toolkit_bg.wasm?url";
// import workerSrc from "@contentauth/sdk/dist/cai-caSdk.worker.min.js?url";

class FourCorners {
	constructor(elem, opts, caSdkSrcs) {
		if(!elem) return;
		this.elems = {};
		this.elems.embed = elem;
		this.elems.img = this.getImg();
		this.src = this.elems.img ? this.elems.img.src : null;
		this.lang = opts.lang || "en";
		this.strings = STRINGS[this.lang];
		// this.provenance = provenance
		// this.data = provenance ? this.parseContentAuthData() : this.parseJsonData();
		// if(!this.data) return;
		// this.opts = { ...DEFAULT_OPTS, ...opts, ...this.data.opts };
		// this.elems.cutline = this.addCutline();
		// this.elems.panels = this.addPanels();
		// this.elems.corners = this.addCorners();
		// this.addEmbeddedMedia();
		// this.addInteractivity();
		// if(this.opts.dark) this.elems.embed.classList.add("fc-dark");
		// this.elems.embed.classList.add("fc-init");

		const caSdk = new ContentAuth(caSdkSrcs);
		(async () => {
			this.data = this.parseJsonData();
			if(!this.data) {
				const contentAuthData = this.src ? await caSdk.processImage(this.src) : null;	
				if(contentAuthData && contentAuthData.exists) {
					this.provenance = contentAuthData;
					this.data = this.parseContentAuthData();
				}
			}
		})().then(() => {
			this.opts = { ...DEFAULT_OPTS, ...opts, ...this.data.opts };
			this.elems.cutline = this.addCutline();
			this.elems.panels = this.addPanels();
			this.elems.corners = this.addCorners();
			this.addEmbeddedMedia();

			this.handleHoverCorner = this.hoverCorner.bind(this);
			this.handleUnhoverCorner = this.unhoverCorner.bind(this);
			this.handleClickCorner = this.clickCorner.bind(this);
			this.handleClickEmpty = this.clickEmpty.bind(this);
			this.handleClickClose = this.clickClosePanel.bind(this);
			this.handleClickExpand = this.clickExpandPanel.bind(this);

			this.addInteractivity();
			if(this.opts.dark) this.elems.embed.classList.add("fc-dark");
			this.elems.embed.classList.add("fc-init");
		}).catch(e => {
			console.warn(e);
		});
	}

	//DATA HANDLING

	parseJsonData() {
		const { embed } = this.elems;
		const script = embed.querySelector("script");
		let stringData;
		if(script) {
			//If embed JSON is stored in child script tag
			stringData = script.innerHTML;
			script.remove();
		} else if(embed.hasAttribute("data-fc")) {
			//If embed JSON is stored in data-fc attributte
			stringData = embed.dataset.fc;
			delete embed.dataset.fc;
		}
		if(!stringData) return;
		return JSON.parse(stringData);
	}

	parseContentAuthData() {
		let fourCornersAssertion;
		if(this.provenance) {
			this.provenance.claims.forEach((claim, key) => {
				if(claim.assertions.get("org.fourcorners.context")) {
					fourCornersAssertion = claim.assertions.get("org.fourcorners.context").data;
				}
			});
		}
		const parseContentAuthArray = (arr) => {
			if(arr) {
				arr = arr.map((obj) => {
					const newObj = {};
					const keys = Object.keys(obj).map((k, i) => {
						const splitArr = k.replace("fourcorners:", "").split(/(?=[A-Z])/);
						const newKey = splitArr[splitArr.length - 1].toLowerCase();
						newObj[newKey] = obj[k];
					});
					return newObj;
				});
			}
			return arr;
		};

		const getContentAuthValue = (key) => {
			let value;
			const searchKeys = (obj, key) => {
				if(typeof obj !== "object") return;
				Object.keys(obj).forEach(k => {
					if(k === key) {
						return value = obj[k];
					}
					if(typeof obj[k] === "object") {
						return searchKeys(obj[k], key);
					}
				});
		 	}
		 	searchKeys(fourCornersAssertion, key);
		 	return value;
		}

		const data = {
			"authorship": {
				"caption": getContentAuthValue("fourcorners:authorshipCaption"),
				"credit": getContentAuthValue("fourcorners:authorshipCredit"),
				"license": {
					"type": getContentAuthValue("fourcorners:authorshipLicenseType"),
					"year": getContentAuthValue("fourcorners:authorshipLicenseYear"),
					"holder": getContentAuthValue("fourcorners:authorshipLicenseHolder"),
					"label": getContentAuthValue("fourcorners:authorshipLicenseLabel"),
					"desc": getContentAuthValue("fourcorners:authorshipLicenseDesc"),
					"url": getContentAuthValue("fourcorners:authorshipLicenseUrl"),
				},
				"ethics": {
					"label": getContentAuthValue("fourcorners:authorshipEthicsLabel"),
					"desc": getContentAuthValue("fourcorners:authorshipEthicsDescription"),
				},
				"bio": getContentAuthValue("fourcorners:authorshipBio"),
				"website": getContentAuthValue("fourcorners:authorshipWebsite"),
				"contactInfo": getContentAuthValue("fourcorners:authorshipContactInfo"),
				"contactRights": getContentAuthValue("fourcorners:authorshipContactRights"),
			},
			"backstory": {
				"text": getContentAuthValue("fourcorners:backstoryText"),
				"media": parseContentAuthArray(getContentAuthValue("fourcorners:backstoryMedia")),
			},
			"imagery": {
				"media": parseContentAuthArray(getContentAuthValue("fourcorners:imageryMedia")),
			},
			"links": {
				"links": parseContentAuthArray(getContentAuthValue("fourcorners:linksLinks")),
			}
		};
		return data;
	}

	//BUILDING DOM ELEMENTS
	getImg() {
		const img = [...this.elems.embed.querySelectorAll("img")].find(img => {
			const ext = ((/[.]/.exec(img.src)) ? /[^.]+$/.exec(img.src) : [])[0];
			return ext && ["jpg", "jpeg", "png", "gif"].includes(ext);
		});
		return img;
	}

	// addWrapper(elem) {
		// let embed;
		// if(elem.tagName === "IMG") {
		// 	embed = document.createElement("div");
		// 	const { width, height } = elem.getBoundingClientRect();
		// 	embed.style.width = `${width}px`;
		// 	embed.style.height = `${height}px`;
		// 	elem.parentNode.insertBefore(embed, elem);
		// 	embed.appendChild(elem);
		// 	embed.classList.add("fc-embed");
		// 	embed.removeAttribute("style");
		// } else {
		// 	embed = elem;
		// }
		// return embed;
	// }

	insertCornerSvg() {
	  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	  const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

	  iconSvg.setAttribute("viewBox", "0 0 100 100");
	  iconPath.setAttribute("d", "M75 24.75H0.25V0.25H75H99.75V25V99.75H75.25L75.25 25V24.75H75Z");

	  iconSvg.appendChild(iconPath);
	  return iconSvg;
	}

	addCorners() {
		const corners = {},
					{ data, strings, elems } = this,
					{ embed } = elems;

		CORNER_KEYS.forEach(cornerKey => {
			const cornerTitle = strings[cornerKey] || null,
						cornerElem = document.createElement("div");

			cornerElem.setAttribute("data-fc-key", cornerKey);
			cornerElem.title = `View ${cornerTitle}`;
			cornerElem.classList.add("fc-corner", `fc-${cornerKey}`);

			const cornerIsEmpty = function() {
				if(data.hasOwnProperty(cornerKey)) {
					if(Object.keys(data[cornerKey]).length) return false;	
					return true;
				}	else {
					return true;
				}
			}();

			if(cornerIsEmpty) {
				cornerElem.classList.add("fc-empty");
			}

			embed.appendChild(cornerElem);
			corners[cornerKey] = cornerElem;
		});

		return corners;
	}

	addPanels() {	
		const { data, strings, elems } = this,
					{ embed } = elems,
					panels = {};

		CORNER_KEYS.forEach(cornerKey => {
			const cornerTitle = strings[cornerKey] || null,
						panelTile = strings[cornerKey] || null;
			let panelClass = `fc-panel fc-${cornerKey}`,
					panelInner;

			switch(cornerKey) {
				case "authorship":
					panelInner = this.buildAuthorship();
					break;
				case "backstory":
					panelInner = this.buildBackstory();
					break;
				case "imagery":
					panelInner = this.buildImagery();
					break;
				case "links":
					panelInner = this.buildLinks();
					break;
			}
		
			const panelHTML =
				`<div data-fc-key="${cornerKey}" class="${panelClass}">
					<div class="fc-panel-title">
						<span>${panelTile}</span>
						<div class="fc-icon fc-expand" title="Expand this panel"></div>
						<div class="fc-icon fc-close" title="Close this panel"></div>
					</div>
					<div class="fc-panel-title fc-pseudo">
						<span>${CORNER_KEYS.indexOf(cornerKey)}</span>
					</div>
					${panelInner ?
						`<div class="fc-scroll">
							<div class="fc-inner ${cornerKey === "imagery" || cornerKey === "links" ? "fc-grid" : ""}">
								${panelInner}
							</div>
						</div>`
					: ""}
				</div>`;
			elems.embed.insertAdjacentHTML('afterbegin', panelHTML);
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
			license,
		} = this.data.authorship;

		const hasInfoCard = credit && ((ethics && ethics.desc) || bio || website);

		let html =
			`<div class="fc-row">
				${caption ? 
					`<div class="fc-field">
						<span class="fc-label">
							${this.strings.caption}:
						</span>
						<span class="fc-content">
							${caption}
						</span>
					</div>`
				: ""}

				${hasInfoCard ?
					`<details class="fc-details">

						<summary class="fc-summary">
							<div class="fc-field">
								<span class="fc-label">
									${this.strings.credit}:
								</span>
								<span class="fc-content">
									${credit ? credit : "Unknown"}
								</span>
								<div class="fc-icon fc-expand" title="Read more about ${credit}"></div>
							</div>
						</summary>

						<div class="fc-card">

							${bio ? 
								`<div class="fc-field">
									<span class="fc-label">
										${this.strings.bio}:
									</span>
									<span class="fc-content">
										${bio}
									</span>
								</div>`
							: ""}

							${ethics && ethics.desc ? 
								`<div class="fc-field">
									<span class="fc-label">
										${this.strings.coe}:
									</span>
									<span class="fc-content">
										${ethics.desc}
									</span>
								</div>`
							: ""}

							${website ? 
								`<div class="fc-field">
									<span class="fc-label">
										${this.strings.website}:
									</span>
									<span class="fc-content">
										${this.createLink(website)}
									</span>
								</div>`
							: ""}

						</div>

					</details>`

				: `<div class="fc-field">
						<span class="fc-label">
							${this.strings.credit}:
						</span>
						<span class="fc-content">
							${credit ? credit : "Unknown"}
						</span>
					</div>`}

				${license && license.type ? 
					`<div class="fc-field">
						<span class="fc-label">
							${this.strings.license}:
						</span>
						<span class="fc-content">
							${license.type === "copyright" ?
								`&#169;
								${license.holder ?
									`${license.holder}${license.year ? `, ${license.year}` : ""}`
								: `${credit}${license.year ? `, ${license.year}` : ""}`}`
							: ""}
							${license.type === "commons" ?
								`${license.url ?
									`<a href="${license.url}" target="_blank">
										${license.label ? license.label : ""}
									</a>`
								: license.label ? license.label : ""}`
							: ""}
						</span>
					</div>`
				: ""}
			</div>`;
		return html;
	}

	buildBackstory() {
		const {
			text,
			media,
		} = this.data.backstory;

		let html = 
			`${text ?
			`<div class="fc-row">
				${this.insertParagraphs(text)}
			</div>`: ""}
			${media ? media.map((obj, index) => {
				this.embedExternal(this, obj, "backstory", index);
				return (
					`<div class="fc-row">
						<div class="fc-media">
							<div class="fc-media-embed" data-fc-source="${obj.source}" data-fc-url="${obj.url}" data-fc-index="${index}"></div>
							${obj.caption || obj.credit ?
								`<div class="fc-media-info">
									${obj.caption ? `<span class="fc-sub-caption">${obj.caption}</span>` : ""}
									${obj.credit ? `<span class="fc-sub-credit">${obj.credit}</span>` : ""}
								</div>`
							: ""}
						</div>
					</div>`
				)
			}).join("") : ""}`;

		return html;
	}

	buildImagery() {
		const { media } = this.data.imagery;

		let html = 
			`${media ? media.map((obj, index) => {
				const isExternal = ["instagram", "youtube", "vimeo"].includes(obj.source);
				return (
					`<div class="fc-row">
						<div class="fc-media">
							<div class="fc-media-embed" data-fc-source="${obj.source}" data-fc-url="${obj.url}" data-fc-index="${index}">
							</div>
							${obj.caption || obj.credit ?
								`<div class="fc-media-info">
									${obj.caption ? `<span class="fc-sub-caption">${obj.caption}</span>` : ""}
									${obj.credit ? `<em class="fc-sub-credit">${obj.credit}</em>` : ""}
									${!isExternal ?
										`<span class="fc-sub-source">
											${obj.url ?
												`(<a href="${obj.url}" target="_blank">View full image</a>)`
											: ""}
										</span>`
									: ""}
									${isExternal ?
										`<span class="fc-sub-source">
											${obj.url ?
												`(<a href="${obj.url}" target="_blank">View on ${this.extractRootDomain(obj.url)}</a>)`
											: ""}
										</span>`
									: ""}
								</div>`
							: ""}
						</div>
					</div>`
				)
			}).join("") : ""}`;
		return html;
	}

	buildLinks() {
		const { links } = this.data.links;

		const html = 
			`${links ?
				links.filter(obj => obj.url).map((obj, index) => {
					const simpleUrl = this.simplifyUrl(obj.url);
					const text = `${obj.title ? obj.title : simpleUrl}<div class="fc-sub-url">${simpleUrl}</div>`;
					return (
						`<div class="fc-row">
							${this.createLink(obj.url, text, ["fc-card"])}
						</div>`
					)
			}).join("") : ""}`;

		return html;
	}

	addCutline() {
		const { data, elems, opts } = this,
					{ embed } = elems,
					{ credit, caption, license } = data.authorship,
					showCaption = opts.caption && caption,
					showCredit = opts.credit && credit,
					showLicense = opts.license && license.holder && (credit !== license.holder),
					showLogo = opts.logo,
					showCutline = showCaption || showCredit || showLicense || showLogo;

		if(!showCutline) return false;

		const html = 
			`${showCaption || showCredit || showLogo ?
				`<div class="fc-cutline">
					${showCaption ?
						`<span class="fc-caption">
							${showCaption ? `<span>${caption}</span>` : ""}
						</span>`
					: ""}
					${showCredit ?
						`<span class="fc-credit">
							${showCredit ? `<span>${credit}</span>` : ""}
							${showCredit && showLicense ? `/` : ""}
							${showLicense ? `<span>${license.holder}</span>` : ""}
						</span>`
					: ""}
					${showLogo ?
						`<a href="https://fourcornersproject.org" target="_blank" class="fc-logo" title="This is a Four Corners Project photo">
							<span>Four Corners Project</span>
						</a>`
					: ""}
				</div>`
			: ""}`;

		embed.insertAdjacentHTML("afterend", html);
		return embed.querySelector(".fc-cutline");
	}

	addEmbeddedMedia() {
		["imagery", "backstory"].forEach((panelKey) => {
			const panel = this.getPanel(panelKey);
			const mediaWrappers = panel.querySelectorAll(".fc-media-embed");
			mediaWrappers.forEach((elem) => {
				const { fcSource, fcUrl, fcIndex } = elem.dataset;
				const obj = {
					source: fcSource,
					url: fcUrl,
					index: fcIndex
				}
				if(obj.source === "image") {
				  this.insertMediaImage(obj, panelKey);
				} else {
					this.insertMediaEmbed(obj, panelKey);
				}
			});
		});
	}

	insertMediaImage(obj, panelKey) {
		const panel = this.getPanel(panelKey),
					subMedia = panel.querySelectorAll(".fc-media-embed")[obj.index],
					pseudoImg = new Image();
		let html = "";
		html = `<img src="${obj.url}" />`;
		subMedia.innerHTML = html;
		// pseudoImg.onload = () => {
		// 	html = `<img src="${obj.url}" />`;
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
		let req = "";
		switch(obj.source) {
			case "youtube":
				req = "https://noembed.com/embed?url="+obj.url;
				break;
			case "vimeo":
				req = "https://vimeo.com/api/oembed.json?url="+obj.url;
				break;
			case "soundcloud":
				req = "https://soundcloud.com/oembed?format=json&url="+obj.url;
				break;
			case "instagram":
				req = "https://api.instagram.com/oembed/?url="+obj.url;
				break;
			default:
				return false;
				break;
		}
		const headers = new Headers();
		fetch(req, {
			method: "GET",
			headers: headers
		}).then(res => {
			if (!res.ok) {throw Error(res.statusText)}
			return res.json();
		}).then(res => {
			const panel = this.getPanel(panelKey),
						subMedia = panel.querySelectorAll(".fc-media-embed")[obj.index];
			let html = "";

			if(obj.source == "instagram") {
				html = `<img src="${res.thumbnail_url}"/>`;
			} else {
				html = res.html;
			}

			if(Number.isInteger(res.width, res.height)) {
				const ratio = res.height/res.width;
				subMedia.classList.add("fc-responsive")
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
			}).join("")}`
			: "";
		return html;
	}

	createLink(href, text, classes = []) {
		if(!text) {
			text = this.simplifyUrl(href);
		}
		if(this.validateEmail(href)) {
			href = `mailto:${href}`;
		}
		return `<a href="${href}" target="_blank" class="${classes.join(" ")}">${text}</a>`;
	}

	//INTERACTIVITY

	addInteractivity() {
		CORNER_KEYS.forEach(key => {
			const panel = this.getPanel(key);
			const corner = this.elems.corners[key];
			panel.querySelector(".fc-expand").addEventListener("click", this.handleClickExpand);
			panel.querySelector(".fc-close").addEventListener("click", this.handleClickClose);
			corner.addEventListener("mouseenter", this.handleHoverCorner);
			corner.addEventListener("mouseleave", this.handleUnhoverCorner);
			corner.addEventListener("click", this.handleClickCorner);
			corner.classList.add("fc-interactive");
		});
		this.elems.embed.addEventListener("click", this.handleClickEmpty);
		this.elems.embed.classList.add("fc-embed");
	}

	destroy() {
		CORNER_KEYS.forEach(key => {
			const panel = this.getPanel(key);
			const corner = this.elems.corners ? this.elems.corners[key] : null;
			if(panel) {
				panel.querySelector(".fc-expand").removeEventListener("click", this.handleClickExpand);
				panel.querySelector(".fc-close").removeEventListener("click", this.handleClickClose);
				panel.remove();
			}
			if(corner) {
				corner.removeEventListener("mouseenter", this.handleHoverCorner);
				corner.removeEventListener("mouseleave", this.handleUnhoverCorner);
				corner.removeEventListener("click", this.handleClickCorner);
				corner.remove();
			}
		});
		this.elems.embed.removeEventListener("click", this.handleClickEmpty);
	}

	openPanel(cornerKey) {
		const { elems } = this,
					{ embed, corners, panels } = elems,
					corner = elems.corners[cornerKey],
					panel = this.getPanel(cornerKey);
		embed.classList.remove("fc-full");
		embed.classList.add("fc-active");
		embed.setAttribute("data-fc-active", cornerKey);
		corner.classList.add("fc-active");
		panel.classList.add("fc-active");
		CORNER_KEYS.forEach(key => {
			if(key !== cornerKey) this.closePanel(key);
		});
	}

	closePanel(cornerKey) {
		const { elems } = this,
					{ embed, corners, panels } = elems,
					corner = corners[cornerKey],
					panel = this.getPanel(cornerKey);
		corner.classList.remove("fc-active");
		panel.classList.remove("fc-active");
		embed.classList.remove("fc-active");
		embed.setAttribute("data-fc-active", "");
		setTimeout(() => embed.classList.remove("fc-full"));
	}

	closePanels() {
		CORNER_KEYS.forEach(cornerKeys => this.closePanel(cornerKeys));
	}

	clickClosePanel(e) {
		this.closePanels();
	}

	clickExpandPanel() {
		this.elems.embed.classList.toggle("fc-full");
	}

	hoverCorner(e) {
		let cornerElem = e.target;
		cornerElem.classList.add("fc-hover");
	}

	unhoverCorner(e) {
		let cornerElem = e.target;
		cornerElem.classList.remove("fc-hover");
	}

	clickCorner(e) {
		const cornerElem = e.target,
					cornerKey = cornerElem.getAttribute("data-fc-key"),
					activeKey = this.elems.embed.getAttribute("data-fc-active");

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

	getPanel(cornerKey) {
		return this.elems.embed.querySelector(`.fc-panel[data-fc-key="${cornerKey}"]`);
	}

	getPanels() {
		return Array.from(this.elems.embed.querySelectorAll(".fc-panel"));
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
	      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	    );
	}

	simplifyUrl(url) {
		return url.replace("www.", "").replace(/^https?:\/\//, "").replace(/\/$/, "");
	}

	extractHostname(url) {
		let hostname;
		if(!url) return null;
		if(url.indexOf("//") > -1) {
			hostname = url.split("/")[2];
		} else {
			hostname = url.split("/")[0];
		}
		hostname = hostname.split(":")[0];
		hostname = hostname.split("?")[0];
		return hostname;
	}

	extractRootDomain(url) {
		if(!url) return null;
		let domain = this.extractHostname(url);
		let splitArr = domain.split(".");
		let arrLen = splitArr.length;
		if (arrLen > 2) {
			domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
			if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
				domain = splitArr[arrLen - 3] + "." + domain;
			}
		}
		return domain;
	}

}

const CORNER_KEYS = [
	"authorship",
	"backstory",
	"imagery",
	"links"
];

const STRINGS = {
	en: {
		authorship: "Authorship",
		backstory: "Backstory",
		imagery: "Related Imagery",
		links: "Links",
		caption: "Caption",
		credit: "Credit",
		license: "License",
		coe: "Code of ethics",
		bio: "About the photographer",
		website: "Website",
		info: "For more info",
		rights: "For reproduction rights",
	},
	ar: {
		authorship: "التأليف",
		backstory: "القصة وراء الصورة ",
		imagery: "الصور ذات الصلة",
		links: "الروابط",
		caption: "Caption",
		credit: "Credit",
		license: "الترخيص",
		coe: "ميثاق أخلاقيات",
		bio: "السيرة الذاتية",
		website: "الموقع الكتروني",
		info: "لمزيد من المعلومات",
		rights: "للحصول على حقوق النسخ",
	}
}

const DEFAULT_OPTS = {
	caption: false,
	credit: false,
	logo: false,
	dark: false,
	inherit: false,
};

export default FourCorners;