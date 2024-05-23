export function addCutline() {
	const { data, elems, options } = this
	const { container } = elems
	const { credit, caption, license } = data.authorship
	const showCaption = Boolean(options.caption && caption)
	const showCredit = Boolean(options.credit && credit)
	const showLicense = Boolean(options.license && license.holder && (credit !== license.holder))
	const showLogo = Boolean(options.logo)
	const showCutline = Boolean(showCaption || showCredit || showLicense || showLogo)

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