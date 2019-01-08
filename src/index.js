class FourCorners {

	constructor(embed, opts) {
		this.elems = {};
		this.opts = opts;
		this.corners = ['context','links','authorship','backstory'];
		this.elems.embed = embed;
		this.data = parseData(this);
		this.elems.photo = addPhoto(this);
		this.elems.panels = addPanels(this);
		this.elems.corners = addCorners(this);
		this.elems.caption = addCaption(this);
		initEmbed(this);
	}

	init(userOpts) {
		let proto = this;
		proto.embeds = [];
		const defaultOpts = {
			selector: '.fc-embed:not(.fc-init)',
			noPanels: false,
			noCorners: false,
			cornerStroke: '6px',
			cornerSize: '25px',
			cornerColor: 'white',
			cornerActiveColor: 'blue',
			cornerHoverColor: 'red',
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
		if(corner && panel) {
			embed.dataset.active = slug;
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
			slug = embed.dataset.active;
		}
		const corner = inst.elems.corners[slug];
		const panel = inst.elems.panels[slug];
		if(slug==embed.dataset.active) {
			embed.dataset.active = '';
			embed.classList.remove('fc-active');
		}
		if(corner){ corner.classList.remove('fc-active'); }
		if(panel) { panel.classList.remove('fc-active'); }
	}
}


const initEmbed = (inst) => {
	const embed = inst.elems.embed;
	embed.classList.add('fc-init');
	if(inst.data&&inst.data.dark) {
		embed.classList.add('fc-dark');
	}

	embed.addEventListener('mouseenter', function(e) {
		hoverEmbed(e, inst);
	});
	embed.addEventListener('mouseleave', function(e) {
		unhoverEmbed(e, inst);
	});

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
	let img = document.createElement('img');
	img.classList.add('fc-img');
	let photo = '';
	const photoSelector = '.fc-photo';
	if(!embed.querySelector(photoSelector)) {
		photo = document.createElement('div');
		photo.classList.add('fc-photo');
		const pseudoImg = new Image();
		const photoData = inst.data.photo;
		if(!photoData) {return}
		const src = photoData.file;
		pseudoImg.onload = (e) => {
			img.src = src;
			photo.classList.add('fc-loaded');
		}
		pseudoImg.onerror = (e) => {
			console.log(e);
		}
		pseudoImg.src = src;
		photo.appendChild(img);
	} else {
		photo = embed.querySelector(photoSelector);
	}
	embed.appendChild(photo);
	return photo;
}

const addPanels = (inst) => {
	let data, panels = {};
	let embed = inst.elems.embed;
	inst.corners.forEach(function(slug, i) {
		let data = null;
		if(inst.data) {
			data = inst.data[slug];
			const dataKeys = Object.keys(data);
			if(!data||!dataKeys.length) {return;}
		}
		let panel, panelSelector = '.fc-panel[data-slug="'+slug+'"]';
		if(!embed.querySelector(panelSelector)) {
			panel = document.createElement('div');
			panel.classList.add('fc-panel');
			panel.dataset.slug = slug;
			let panelScroll = document.createElement('div');
			panelScroll.classList.add('fc-scroll');
			let panelInner = document.createElement('div');
			panelInner.classList.add('fc-inner');
			let panelTitle = document.createElement('div');
			panelTitle.classList.add('fc-panel-title');
			panelInner.appendChild(panelTitle);
			panelTitle.innerHTML = slug;
			if(data) {
				Object.entries(data).forEach(([prop, val]) => {
					if(!val){return}
					let row = document.createElement('div');
					row.classList.add('fc-row', 'fc-'+prop);
					if(prop == 'media') {
						row.append(addMedia(val));
					} else if(prop == 'links') {
						row.append(addLinks(val));
					} else if(prop == 'license') {
						row.append(addLicense(val));
					} else {
						val = wrapUrls(val);
						row.innerHTML += val;
					}
					panelInner.appendChild(row);
				});
			}
			panelScroll.appendChild(panelInner);
			panel.appendChild(panelScroll);
			embed.appendChild(panel);
		} else {
			panel = embed.querySelector(panelSelector);
		}
		panels[slug] = panel;
	});
	return panels;
}

const addMedia = (arr) => {
	let subRows = document.createElement('div');
	subRows.className = 'fc-sub-rows';
	arr.forEach(function(obj, index) {
		let subRow = document.createElement('div');
		subRow.className = 'fc-sub-row';
		if(obj.type == 'image') {
			embedImage(obj, subRow)
		} else {
			embedIframe(obj, subRow)
		}
		if(obj.credit) {
			let credit = document.createElement('div');
			credit.className = 'fc-sub-credit';
			credit.innerHTML = obj.credit;
			subRow.appendChild(credit);
		}
		subRows.appendChild(subRow);
	});
	return subRows;
}	

const addLinks = (arr) => {
	let subRows = document.createElement('div');
	subRows.className = 'fc-sub-rows';
	arr.forEach(function(obj, index) {
		let subRow = document.createElement('div');
		subRow.className = 'fc-sub-row';
		let a = document.createElement('a');
		a.href = obj.url;
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
		subRows.appendChild(subRow);
	});
	return subRows;
}

const addLicense = (val) => {
	let a = document.createElement('a');
	a.href = val;
	a.target = '_blank';
	a.innerHTML = val;
	let text = document.createTextNode('License this photo: ');
	let span = document.createElement('span');
	span.append(text);
	span.append(a);
	return span;
}

const embedImage = (obj, subRow) => {
	var mediaWrap = document.createElement('div');
	mediaWrap.className = 'fc-media';
	let img = document.createElement('img');
	img.src = obj.url;
	mediaWrap.appendChild(img);
	// subRow.appendChild(mediaWrap);
	subRow.prepend(mediaWrap);
}


const embedIframe = (obj, subRow) => {
	let req = '';
	switch(obj.type) {
		case 'youtube':
			req = 'https://www.youtube.com/oembed?url='+obj.url;
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
			headers: headers,
			mode: 'cors',
			cache: 'default'
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
			subRow.prepend(mediaWrap);
		})
		.catch(function(err) {
			subRow.remove();
			console.log(err);
		});
}

const extractHostname = (url) => {
  let hostname;
  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
}

const extractRootDomain = (url)  => {
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
	inst.corners.forEach(function(slug, i) {
		const cornerSelector = '.fc-corner[data-slug="'+slug+'"]';
		if(embed.querySelector(cornerSelector)) {return}
		let corner = document.createElement('div');
		corner.dataset.slug = slug;
		corner.classList.add('fc-corner');
		if(inst.data) {
			data = inst.data[slug];
			if(!data||!Object.keys(data).length) {
				corner.classList.add('fc-inactive');
			}
		}
		corner.addEventListener('mouseenter', function(e) {
			hoverCorner(e, inst);
		});
		corner.addEventListener('mouseleave', function(e) {
			unhoverCorner(e, inst);
		});
		corner.addEventListener('click', function(e) {
			clickCorner(e, inst);
		});
		corners[slug] = corner;
		embed.appendChild(corner);
	});

	return corners;
}

const addCaption = (inst) => {
	if(!inst.data) {return}
	const data = inst.data['authorship'];
	if(!data||!Object.keys(data).length) {return}
	const embed = inst.elems.embed
	let caption = document.createElement('div');
	caption.classList.add('fc-caption');
	let captionArray = [];
	if(data.credit) {
		captionArray.push(data.credit);
	}
	if(data.copyright) {
		captionArray.push('&copy;');
	}
	const fcLink = '<a href="#">Four Corners</a>';
	captionArray.push(fcLink);
	const captionText = captionArray.join(' ');
	caption.innerHTML = captionText;
	embed.parentNode.insertBefore(caption, embed.nextSibling);
}

const parseData = (inst) => {
	let stringData = inst.elems.embed.dataset.fc;
	if(!stringData){return}
	stringData = stringData;
	delete inst.elems.embed.dataset.fc;
	return JSON.parse(stringData);
}

const hoverEmbed = (e, inst) => {
	let embed = inst.elems.embed;
	let corners = inst.elems.corners;
	const css = inst.css;
	const posDur = inst.opts.posDur;
}

const unhoverEmbed = (e, inst) => {
	let embed = inst.elems.embed;
	let corners = inst.elems.corners;
	const css = inst.css;
	const posDur = inst.opts.posDur;
}

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
	let slug = corner.dataset.slug;
	const active = inst.elems.embed.dataset.active;
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

const isChildOf = (target, ref) => {
	let answer = false;
	Object.entries(ref).forEach(([key, elem]) => {
	  if(elem.contains(target)) {
	  	answer = true;
	  }
	});
	return answer;
}

var wrapUrls = function (str) {
	var urlPattern = /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}\-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/ig;
	return str.replace(urlPattern, function (url) {
		var protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i;
		var href = protocol_pattern.test(url) ? url : 'http://' + url;
		return '<a href="' + href + '" target="_blank">' + url + '</a>';
	});
};

export default FourCorners;