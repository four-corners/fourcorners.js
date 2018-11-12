import {TweenMax} from 'gsap/all';

class FourCorners {

	constructor(embed, opts) {
		this.elems = {};
		this.opts = opts;
		this.corners = ['backstory','copyright','media','links'];
		this.elems.embed = embed;
		this.data = parseData(this);
		this.elems.photo = addPhoto(this);
		this.elems.panels = addPanels(this);
		this.elems.corners = addCorners(this);
	}

	// const init = () => {
	init(userOpts) {
		window.FOURCORNERS = [];
		const defaultOpts = {
			selector: '.fc_embed',
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
			FOURCORNERS.push(inst);
		});
	}

}


const initEmbed = (inst) => {
	let embed = document.querySelector(inst.opts.selector);
	if(!embed){return}
	return embed;
}

const addPhoto = (inst)  => {
	const imgSrc = inst.data.img;
	let img = document.createElement('img');
	img.classList.add('fc_photo');
	img.src = imgSrc;
	inst.elems.embed.appendChild(img);
	return img;
}

const addPanels = (inst) => {
	let panels = {};
	let embed = inst.elems.embed;
	inst.corners.forEach(function(id, i) {
		let panel = document.createElement('div');
		panel.classList.add('fc_panel');
		panel.dataset.id = id;
		const data = inst.data[id];
		let panelInner = document.createElement('div');
		panelInner.classList.add('fc_inner');
		Object.entries(data).forEach(([prop, val]) => {
			let row = document.createElement('div');
			row.className = 'fc_row';
			let label = document.createElement('div');
			label.className = 'fc_label';
			label.innerHTML = prop;
			row.appendChild(label);

			if(id == 'media') {
				row.append(addMedia(val));
			} else if(id == 'links') {
				row.append(addLinks(val));
			} else {
				val = wrapUrls(val);
				row.innerHTML += val;
			}
			panelInner.appendChild(row);
		});
		panel.appendChild(panelInner);
		embed.appendChild(panel);
		panels[id] = panel;
	});
	return panels;
}

const addMedia = (arr) => {
	let grid = document.createElement('div');
	grid.className = 'fc_grid';
	arr.forEach(function(obj, index) {
		if(obj.type == 'image') {
			let image = document.createElement('div');
			image.className = 'fc_image';
			let img = document.createElement('img');
			img.src = obj.url;
			image.appendChild(img)
			grid.appendChild(image);
		}
	});
	return grid;
}

const addLinks = (arr) => {

}


const addCorners = (inst) => {
	let corners = {};
	let embed = inst.elems.embed;
	let cornerStroke = inst.opts.cornerStroke;
	let cornerSize = inst.opts.cornerSize;
	let cornerMargin = inst.opts.cornerMargin;
	inst.corners.forEach(function(id, i) {
		let corner = document.createElement('div');
		corner.classList.add('fc_corner');
		corner.dataset.id = id;
		embed.addEventListener('mouseenter', function(e) {
			hoverEmbed(e, inst);
		});
		embed.addEventListener('mouseleave', function(e) {
			unhoverEmbed(e, inst);
		});
		corner.addEventListener('mouseenter', function(e) {
			hoverCorner(e, inst);
		});
		corner.addEventListener('mouseleave', function(e) {
			unhoverCorner(e, inst);
		});
		corner.addEventListener('click', function(e) {
			clickCorner(e, inst);
		});
		corners[id] = corner;
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
	corner.classList.add('fc_hover');
}

const unhoverCorner = (e, inst) => {
	let corner = e.target;
	corner.classList.remove('fc_hover');
}

const clickCorner = (e, inst) => {
	let corner = e.target;
	const id = corner.dataset.id;
	let panel = inst.elems.panels[id];
	
	corner.classList.toggle('fc_active');
	panel.classList.toggle('fc_active');	

	const otherPanelSelector = '.fc_panel.fc_active:not([data-id="'+id+'"])';
	let otherPanel = document.querySelector(otherPanelSelector);
	if(otherPanel) {
		otherPanel.classList.remove('fc_active');
	}
	const otherCornerSelector = '.fc_corner.fc_active:not([data-id="'+id+'"])';
	let otherCorner = document.querySelector(otherCornerSelector);
	if(otherCorner) {
		otherCorner.classList.remove('fc_active');
	}
	const activeCornerSelector = '.fc_corner.fc_active';
	let activeCorner = document.querySelector(activeCornerSelector);
	if(activeCorner) {
		inst.elems.embed.classList.add('fc_active');
	} else {
		inst.elems.embed.classList.remove('fc_active');
	}
}


const addStyles = (elem, styles) => {
	Object.entries(styles).forEach(([prop, val]) => {
		elem.style[prop] = val;
	});
	return elem;
}


//Adds namespace to all classes
const fc = (input) => {
	const ns = 'fc';
	let output = [];
	if(!Array.isArray(input)){input = [input];}
	input.forEach(function(str, i) {
		output[i] = ns+'_'+str;
	});
	return output;
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