import {TweenMax} from 'gsap/all';

class FourCorners {

	constructor(userOptions) {
		const defaultOptions = {
			selector: '.fc_embed',
			cornerStroke: '6px',
			cornerSize: '25px',
			cornerColor: 'white',
			cornerActiveColor: 'blue',
			cornerHoverColor: 'red',
			posDur: 0.2,
			transDur: 0.1,
		};
		this.elems = {};
		this.opts = Object.assign(defaultOptions, userOptions);
		this.opts.cornerMargin = parseInt(this.opts.cornerSize)/2+'px'
		this.corners = ['backstory','copyright','media','links'];
		this.elems.embed = initEmbed(this);
		this.data = parseData(this);
		this.elems.photo = addPhoto(this);
		this.elems.panels = addPanels(this);
		this.elems.corners = addCorners(this);
	}

}

const initEmbed = (inst) => {
	let embed = document.querySelector(inst.opts.selector);
	if(!embed){return}
	// embed = addStyles(embed, {
	// 	position: 'relative',
	// 	overflow: 'hidden'
	// });
	return embed;
}

const addPhoto = (inst)  => {
	const imgSrc = inst.data.image.src;
	let img = document.createElement('img');
	img.classList.add(fc('photo'));
	img.src = imgSrc;
	// img = addStyles(img, {
	// 	width: '100%',
	// 	height: 'auto',
	// 	display: 'table'
	// });
	inst.elems.embed.appendChild(img);
	return img;
}

const addPanels = (inst) => {
	let panels = {};
	let embed = inst.elems.embed;
	inst.corners.forEach(function(id, i) {
		let panel = document.createElement('div');
		panel.classList.add(...fc('panel'));
		panel.dataset.id = id;
		// const margin = parseInt(inst.opts.cornerSize)*2
		// const len = 'calc(100% - '+margin+'px)';
		// let panelStyles = {
		// 	width: len,
		// 	height: len,
		// 	position: 'absolute',
		// 	top: inst.opts.cornerSize,
		// 	left: inst.opts.cornerSize,
		// 	zIndex: '2',
		// 	backgroundColor: 'white',
		// 	display: 'none',
		// 	opacity: 0,
		// };
		// panel = addStyles(panel, panelStyles);
		const data = inst.data[id];
		// let panelInner = '';
		let panelInner = document.createElement('div');
		panelInner.classList.add(...fc('panel_inner'));
		Object.entries(data).forEach(([prop, val]) => {
			let panelRow = document.createElement('div');
			panelRow.classList.add(...fc('panel_row'))
			panelRow.innerHTML = `<strong>${prop}</strong>&nbsp;<span>${val}</span>`;
			panelInner.appendChild(panelRow);
			// panelInner += `<div><strong>${prop}</strong>&nbsp;<span>${val}</span></div>`;
		});
		panel.appendChild(panelInner);
		embed.appendChild(panel);
		panels[id] = panel;
	});
	return panels;
}

const addCorners = (inst) => {
	let corners = {};
	let embed = inst.elems.embed;
	let cornerStroke = inst.opts.cornerStroke;
	let cornerSize = inst.opts.cornerSize
	let cornerMargin = inst.opts.cornerMargin
	// inst.css = {
	// 	'backstory': {
	// 		// edges: ['top','left'],
	// 		borderWidth: [cornerStroke,0,0,cornerStroke],
	// 		origin: {
	// 			top: '-'+cornerSize,
	// 			left: '-'+cornerSize
	// 		},
	// 		hover: {
	// 			top: cornerMargin,
	// 			left: cornerMargin
	// 		}
	// 	},
	// 	'copyright': {
	// 		// edges: ['top','right'],
	// 		borderWidth: [cornerStroke,cornerStroke,0,0],
	// 		origin: {
	// 			top: '-'+cornerSize,
	// 			right: '-'+cornerSize
	// 		},
	// 		hover: {
	// 			top: cornerMargin,
	// 			right: cornerMargin
	// 		}
	// 	},
	// 	'media': {
	// 		// edges: ['bottom','right'],
	// 		borderWidth: [0,cornerStroke,cornerStroke,0],
	// 		origin: {
	// 			bottom: '-'+cornerSize,
	// 			right: '-'+cornerSize
	// 		},
	// 		hover: {
	// 			bottom: cornerMargin,
	// 			right: cornerMargin
	// 		}
	// 	},
	// 	'links': {
	// 		// edges: ['bottom','left'],
	// 		borderWidth: [0,0,cornerStroke,cornerStroke],
	// 		origin: {
	// 			bottom: '-'+cornerSize,
	// 			left: '-'+cornerSize
	// 		},
	// 		hover: {
	// 			bottom: cornerMargin,
	// 			left: cornerMargin
	// 		}
	// 	}
	// };
	inst.corners.forEach(function(id, i) {
		// let cssClone = Object.assign({},inst.css[id]);
		let corner = document.createElement('div');
		corner.classList.add(...fc('corner'));
		corner.dataset.id = id;
		// let cornerStyles = {
		// 	width: cornerSize,
		// 	height: cornerSize,
		// 	position: 'absolute',
		// 	zIndex: '3',
		// 	borderStyle: 'solid',
		// 	borderColor: inst.opts.cornerColor
		// };
		// const originClone = Object.assign({}, cssClone.origin);
		// Object.assign(cornerStyles, originClone);
		// cornerStyles['borderWidth'] = cssClone.borderWidth.join(' ');
		// corner = addStyles(corner, cornerStyles);

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
	let stringData = inst.elems.embed.dataset.json
		.replace(/(\')/g,'"');
	delete inst.elems.embed.dataset.json;
	return JSON.parse(stringData);
}

const hoverEmbed = (e, inst) => {
	let embed = inst.elems.embed;
	let corners = inst.elems.corners;
	const css = inst.css;
	const posDur = inst.opts.posDur;
	// Object.entries(corners).forEach(([id, corner]) => {
	// 	TweenMax.to(corner, posDur, css[id].hover);
	// });
}

const unhoverEmbed = (e, inst) => {
	let embed = inst.elems.embed;
	let corners = inst.elems.corners;
	const css = inst.css;
	const posDur = inst.opts.posDur;
	// Object.entries(corners).forEach(([id, corner]) => {
	// 	TweenMax.to(corner, inst.opts.posDur, css[id].origin);
	// });
}

const hoverCorner = (e, inst) => {
	let corner = e.target;
	corner.classList.add(fc('hover'));
	// corner = addStyles(corner, {cursor: 'pointer'});
	// const transDur = inst.opts.transDur;
	// let cornerColor = '';
	// if(corner.classList.contains(fc('active'))) {
	// 	cornerColor = inst.opts.cornerColor;
	// } else {
	// 	cornerColor = inst.opts.cornerHoverColor;
	// }
	// cornerColor = inst.opts.cornerHoverColor;
	// TweenMax.to(corner, transDur, {
	// 	borderColor: cornerColor
	// });
}

const unhoverCorner = (e, inst) => {
	let corner = e.target;
	corner.classList.remove(fc('hover'));
	// corner = addStyles(corner, {cursor: ''});
	// let transDur = inst.opts.transDur;;
	// let cornerColor = '';
	// cornerColor = '';
	// if(corner.classList.contains(fc('active'))) {
	// 	cornerColor = inst.opts.cornerActiveColor;
	// } else {
	// 	cornerColor = inst.opts.cornerColor;
	// }
	// TweenMax.to(corner, transDur, {
	// 	borderColor: cornerColor
	// });
}

const clickCorner = (e, inst) => {
	let corner = e.target;
	const id = corner.dataset.id;
	const isActive = corner.classList.contains(fc('active'));
	// const transDur = inst.opts.transDur;
	// let cornerColor = '';

	const activePanelSelector = '.'+fc('panel')+'.'+fc('active');
	let activePanel = document.querySelector(activePanelSelector);
	if(activePanel) {
		activePanel.classList.remove(fc('active'));
		// TweenMax.to(activePanel, transDur, {
		// 	opacity: 0,
		// 	onComplete: () => {
		// 		activePanel = addStyles(activePanel, {display:'none'});
		// 	}
		// });
	}
	const activeCornerSelector = '.'+fc('corner')+'.'+fc('active');
	let activeCorner = document.querySelector(activeCornerSelector);
	if(activeCorner) {
		activeCorner.classList.remove(fc('active'));
		// TweenMax.to(activeCorner, transDur, {
		// 	borderColor: inst.opts.cornerColor,
		// });
	}
	if(isActive) {
		return;
	}
	corner.classList.toggle(fc('active'));
	// if(corner.classList.contains(fc('active'))) {
	// 	cornerColor = inst.opts.cornerActiveColor;
	// } else {
	// 	cornerColor = inst.opts.cornerColor;
	// }
	// TweenMax.to(corner, transDur, {
	// 	borderColor: cornerColor
	// });

	let panel = inst.elems.panels[id];
	panel.classList.toggle(fc('active'));
	// if(corner.classList.contains(fc('active'))) {
	// 	panel = addStyles(panel, {display:'block'});
	// 	TweenMax.to(panel, transDur, {
	// 		opacity: 1
	// 	});
	// } else {
	// 	TweenMax.to(panel, transDur, {
	// 		opacity: 0,
	// 		onComplete: () => {
	// 			panel = addStyles(panel, {display:'none'});
	// 		}
	// 	});
	// }

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

export default FourCorners;