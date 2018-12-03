class FourCorners {

	constructor(embed, opts) {
		this.elems = {};
		this.opts = opts;
		this.corners = ['context','links','copyright','backstory'];
		this.elems.embed = embed;
		this.elems.embed.classList.add('fc-init');
		this.data = parseData(this);
		this.elems.photo = addPhoto(this);
		this.elems.panels = addPanels(this);
		this.elems.corners = addCorners(this);
	}

	init(userOpts) {
		let proto = this;
		proto.embeds = [];
		const defaultOpts = {
			selector: '.fc-embed:not(.fc-init)',
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
	let embed = document.querySelector(inst.opts.selector);
	if(!embed){return}
	return embed;
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
		const src = inst.data.img;
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
	let panels = {};
	let embed = inst.elems.embed;
	inst.corners.forEach(function(slug, i) {
		let panel = '';
		const panelSelector = '.fc-panel[data-slug="'+slug+'"]';
		if(!embed.querySelector(panelSelector)) {
			panel = document.createElement('div');
			panel.classList.add('fc-panel');
			panel.dataset.slug = slug;
			let panelInner = document.createElement('div');
			panelInner.classList.add('fc-inner');
			let panelTitle = document.createElement('div');
			panelTitle.classList.add('fc-panel-title');
			panelTitle.innerHTML = slug;
			panel.appendChild(panelTitle);
			if(inst.data) {
				const data = inst.data[slug];
				Object.entries(data).forEach(([prop, val]) => {
					if(!val){return}
					let row = document.createElement('div');
					row.classList.add('fc-row', 'fc-'+prop);
					if(!['media','links'].includes(prop)) {
						let label = document.createElement('div');
						label.className = 'fc-label';
						label.innerHTML = prop;
						row.appendChild(label);
					}
					if(prop == 'media') {
						row.append(addMedia(val));
					} else if(prop == 'links') {
						row.append(addLinks(val));
					} else {
						val = wrapUrls(val);
						row.innerHTML += val;
					}
					panelInner.appendChild(row);
				});
			}
			panel.appendChild(panelInner);
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
			let img = document.createElement('img');
			img.src = obj.url;
			subRow.appendChild(img);
		} else {
			getMediaEmbed(obj, subRow)
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

const getMediaEmbed = (obj, subRow) => {
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
	fetch(req)
		.then(res => {
			if (!res.ok) {throw Error(res.statusText)}
			return res.json();
		})
		.then(res => {
			var mediaWrap = document.createElement('div');
			mediaWrap.className = 'fc-media-wrap';
			mediaWrap.innerHTML =  res.html;
			if(Number.isInteger(res.width,res.height)) {
				const ratio = res.height/res.width;
				mediaWrap.classList.add('fc-responsive')
				mediaWrap.style.paddingBottom = (ratio*100)+'%';
			}
			subRow.prepend(mediaWrap);
		})
		.catch(function(err) {
			console.log(err);
		});
}

	

const addLinks = (arr) => {
	let subRows = document.createElement('div');
	subRows.className = 'fc-sub-rows';
	arr.forEach(function(obj, index) {
		let subRow = document.createElement('a');
		subRow.className = 'fc-sub-row';
		subRow.href = obj.url;
		subRow.target = '_blank'
		if(obj.title) {
			let title = document.createElement('div');
			title.className = 'fc-sub-title';
			title.innerHTML = obj.title;
			subRow.appendChild(title);
		}
		if(obj.url) {
			let url = document.createElement('div');
			url.className = 'fc-sub-url';
			url.innerHTML = obj.url;
			subRow.appendChild(url);
		}
		subRows.appendChild(subRow);
	});
	return subRows;
}


const addCorners = (inst) => {
	let corners = {};
	let embed = inst.elems.embed;
	let photo = inst.elems.photo;

	embed.addEventListener('mouseenter', function(e) {
		hoverEmbed(e, inst);
	});
	embed.addEventListener('mouseleave', function(e) {
		unhoverEmbed(e, inst);
	});

	if(photo) {
		photo.addEventListener('click', function(e) {
			clickPhoto(e, inst);
		});
	}

	inst.corners.forEach(function(slug, i) {
		const cornerSelector = '.fc-corner[data-slug="'+slug+'"]';
		if(embed.querySelector(cornerSelector)) {return;}
		let corner = document.createElement('div');
		if(!corner) {return;}
		corner.classList.add('fc-corner');
		corner.dataset.slug = slug;
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

const parseData = (inst) => {
	let stringData = inst.elems.embed.dataset.fc;
	if(!stringData){return}
	stringData = stringData.replace(/(\')/g,'"');
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

// const addStyles = (elem, styles) => {
// 	Object.entries(styles).forEach(([prop, val]) => {
// 		elem.style[prop] = val;
// 	});
// 	return elem;
// }

//Adds namespace to all classes
// const fc = (input) => {
// 	const ns = 'fc';
// 	let output = [];
// 	if(!Array.isArray(input)){input = [input];}
// 	input.forEach(function(str, i) {
// 		output[i] = ns+'_'+str;
// 	});
// 	return output;
// }

var wrapUrls = function (str) {
	var urlPattern = /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}\-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/ig;
	return str.replace(urlPattern, function (url) {
		var protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i;
		var href = protocol_pattern.test(url) ? url : 'http://' + url;
		return '<a href="' + href + '" target="_blank">' + url + '</a>';
	});
};

export default FourCorners;