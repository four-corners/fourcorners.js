require("regenerator-runtime/runtime");
require("styles.scss");

import { ContentAuth } from '@contentauth/sdk';
import wasmSrc from '@contentauth/sdk/dist/assets/wasm/toolkit_bg.wasm?file';
import workerSrc from '@contentauth/sdk/dist/cai-sdk.worker.min.js?file';

class FourCorners {
	constructor(elem, opts, c2pa) {

		if(!elem) return;
		this.elems = {};
		this.elems.img = this.addImg(elem);
		this.elems.embed = this.addWrapper(elem);
		this.lang = opts.lang || "en";
		this.strings = STRINGS[this.lang];

		const sdk = new ContentAuth({
			wasmSrc,
			workerSrc,
		});
		
		(async () => {
			const provenance = await sdk.processImage(elem.src);
			if(provenance.exists) {
			  this.data = this.parseC2paData(provenance);
			} else {
			  this.data = this.parseData();
			}
		})().then(() => {
			this.opts = { ...DEFAULT_OPTS, ...opts, ...this.data.opts };
			this.elems.panels = this.addPanels();
			this.elems.corners = this.addCorners();
			this.elems.cutline = this.addCutline();
			this.addEmbeddedMedia();
			this.addInteractivity();
			if(this.opts.dark) this.elems.embed.classList.add("fc-dark");
			this.elems.embed.classList.add("fc-init");
		});
	}

	//DATA HANDLING

	parseData() {
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

	parseC2paData(rawC2pa) {
		let c2pa;
		if(rawC2pa) {
			rawC2pa.claims.forEach((claim, key) => {
				c2pa = claim.assertions.get("org.fourcorners.context").data;
			});
		}

		const parseC2paArray = (arr) => {
			if(arr) {
				arr = arr.map((obj) => {
					const newObj = {};
					const keys = Object.keys(obj).map((k, i) => {
						const splitArr = k.replace("fourcorners:","").split(/(?=[A-Z])/);
						const newKey = splitArr[splitArr.length - 1].toLowerCase();
						newObj[newKey] = obj[k];
					});
					return newObj;
				});
			}
			return arr;
		};

		const getC2paValue = (key) => {
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
		 	searchKeys(c2pa, key);
		 	return value;
		}

		const data = {
			"authorship": {
				"caption": getC2paValue("fourcorners:authorshipCaption"),
				"credit": getC2paValue("fourcorners:authorshipCredit"),
				"license": {
					"type": getC2paValue("fourcorners:authorshipLicenseType"),
					"year": getC2paValue("fourcorners:authorshipLicenseYear"),
					"holder": getC2paValue("fourcorners:authorshipLicenseHolder"),
					"label": getC2paValue("fourcorners:authorshipLicenseLabel"),
					"desc": getC2paValue("fourcorners:authorshipLicenseDesc"),
					"url": getC2paValue("fourcorners:authorshipLicenseUrl"),
				},
				"ethics": {
					"label": getC2paValue("fourcorners:authorshipEthicsLabel"),
					"desc": getC2paValue("fourcorners:authorshipEthicsDescription"),
				},
				"bio": getC2paValue("fourcorners:authorshipBio"),
				"website": getC2paValue("fourcorners:authorshipWebsite"),
				"contactInfo": getC2paValue("fourcorners:authorshipContactInfo"),
				"contactRights": getC2paValue("fourcorners:authorshipContactRights"),
			},
			"backstory": {
				"text": getC2paValue("fourcorners:backstoryText"),
				"media": parseC2paArray(getC2paValue("fourcorners:backstoryMedia")),
			},
			"imagery": {
				"media": parseC2paArray(getC2paValue("fourcorners:imageryMedia")),
			},
			"links": {
				"links": parseC2paArray(getC2paValue("fourcorners:linksLinks")),
			}
		};
		return data;
	}

	//BUILDING DOM ELEMENTS
	addImg(elem) {
		if(elem.tagName === "IMAGE") {
			return elem;
		} else {
			return elem.querySelector("img");
		}
	}

	addWrapper(elem) {
		let embed;
		if(elem.tagName === "IMG") {
			embed = document.createElement("div");
			const { width, height } = elem.getBoundingClientRect();
			embed.style.width = `${width}px`;
			embed.style.height = `${height}px`;
			elem.parentNode.insertBefore(embed, elem);
			embed.appendChild(elem);
			embed.classList.add("fc-embed");
		} else {
			embed = elem;
		}
		return embed;
	}

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
						// cornerSvg = this.insertCornerSvg();
						// cornerSvg = require("./svg/corner.svg");
						// cornerSvg = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M75 24.75H0.25V0.25H75H99.75V25V99.75H75.25L75.25 25V24.75H75Z" fill="white" stroke="black" stroke-width="0.5"/></svg>`;


			cornerElem.setAttribute("data-fc-key", cornerKey);
			cornerElem.title = `View ${cornerTitle}`;
			cornerElem.classList.add("fc-corner", `fc-${cornerKey}`);

			// cornerElem.appendChild(cornerSvg);

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
			const cornerTitle = strings[cornerKey] || null;

			let panelInner = "";

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
			const panelTile = strings[cornerKey];
			let panelClass = `fc-panel fc-${cornerKey}`;
		
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
			elems.embed.innerHTML += panelHTML;
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
									${obj.caption ? `<div class="fc-sub-caption">${obj.caption}</div>` : ""}
									${obj.credit ? `<div class="fc-sub-credit">${obj.credit}</div>` : ""}
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
									${obj.caption ? `<div class="fc-sub-caption">${obj.caption}</div>` : ""}
									${obj.credit ? `<div class="fc-sub-credit">${obj.credit}</div>` : ""}
									${isExternal ?
										`<div class="fc-sub-credit">
											${isExternal && obj.url ?
												`<a href="${obj.url}" target="_blank">
													View on ${this.extractRootDomain(obj.url)}
												</a>`
											: ""}
											${isExternal && !obj.url ?
												`View on ${this.extractRootDomain(obj.url)}`
											: ""}
										</div>`
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
					showLogo = opts.logo;

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
		pseudoImg.onload = () => {
			html = `<img src="${obj.url}" />`;
			subMedia.innerHTML = html;
		};
		pseudoImg.onerror = () => {
			subMedia.parentNode.remove();
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
		console.log(req);
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
			panel.querySelector(".fc-expand").addEventListener("click", () => {
				this.toggleExpandPanel();
			});

			panel.querySelector(".fc-close").addEventListener("click", () => {
				this.closePanel(key);
				// this.elems.embed.classList.remove("fc-full");
			});

			corner.addEventListener("mouseenter", this.hoverCorner.bind(this) );
			corner.addEventListener("mouseleave", this.unhoverCorner.bind(this) );
			corner.addEventListener("click", this.clickCorner.bind(this));
			corner.classList.add("fc-interactive");
		});

		this.elems.embed.addEventListener("click", (e) => {
			const onPanels = this.isChildOf(e.target, this.getPanels());
			const onCorners = this.isChildOf(e.target, this.elems.corners);
			if(!onPanels && !onCorners) {
				this.closePanels();
			}
		});

		this.elems.embed
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

	toggleExpandPanel() {
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
		return url.replace("www.", "").replace(/^https?:\/\//, "");
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
	dark: false
};

export default FourCorners;