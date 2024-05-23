import {
	FC_STRINGS,
	FC_CORNER_KEYS
} from './../constants'

import {
	simplifyUrl,
	validateEmail,
	extractRootDomain
} from './../helpers'

export function addPanels() {	
	const { data, elems, options } = this
	const { container } = elems
	const strings = FC_STRINGS[options.lang]
	const panels = {}
	FC_CORNER_KEYS.forEach(cornerKey => {
		const cornerTitle = strings[cornerKey] || null
		const panelTile = strings[cornerKey] || null
		let panelClass = `fc-panel fc-${cornerKey}`
		let panelInner

		switch(cornerKey) {
			case 'authorship':
				panelInner = addAuthorshipPanel.call(this)
				break
			case 'backstory':
				panelInner = addBackstoryPanel.call(this)
				break
			case 'imagery':
				panelInner = addImageryPanel.call(this)
				break
			case 'links':
				panelInner = addLinksPanel.call(this)
				break
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
			</div>`
		container.insertAdjacentHTML('afterbegin', panelHTML)
		panels[cornerKey] = this.getPanel(cornerKey)
	})
	return panels
}

function insertParagraphs(val) {
	let array = val.split(/\n/g);
	let text = [];
	let html = array ?
		`${array.map((str,i) => {
			return str ? `<p>${str}</p>` : `<br/>`
		}).join('')}`
		: ';'
	return html;
}

function createLink(href, text, classes = []) {
	if(!text) text = simplifyUrl(href);
	if(validateEmail(href)) href = `mailto:${href}`

	return `<a href='${href}' target='_blank' class='${classes.join(' ')}'>${text}</a>`;
}

function addAuthorshipPanel() {
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
	} = this.data.authorship
	
	const strings = FC_STRINGS[this.options.lang]
	const hasContact = Boolean(contact && (contact.info || contact.rights))
	const hasAuthorshipContent = Boolean(caption || credit || bio || ethics || website || license || location || time || verify || hasContact)
	const hasInfoCard = Boolean(credit || (ethics && ethics.desc) || bio || website || hasContact)
	const hasCertCard = Boolean(location || time || (registration && registration.length))

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
										${createLink(website)}
									</span>
								</div>`
							: ''}

							${hasContact && contact.info ? 
								`<div class='fc-field'>
									<span class='fc-label'>
										${strings.info}:
									</span>
									<span class='fc-content'>
										${createLink(contact.info)}
									</span>
								</div>`
							: ''}

							${hasContact && contact.rights ? 
								`<div class='fc-field'>
									<span class='fc-label'>
										${strings.rights}:
									</span>
									<span class='fc-content'>
										${createLink(contact.rights)}
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
								`&#169
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
											&nbsp
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
								${strings.verify_intro} ${createLink(verify, strings.verify_link)}
							</div>`
						: ''}

					</div>`
				: ''}

				${!hasCertCard && verify ?
					`<div class='fc-field fc-sub-source'>
							${strings.verify_intro} ${createLink(verify, strings.verify_link)}
					</div>`
				: ''}
			</div>`
		: ''
	)
}

function addBackstoryPanel() {
	const {
		text,
		media,
	} = this.data.backstory
	const hasBackstoryContent = text || media
	return(
		hasBackstoryContent ?
			`${text ?
				`<div class='fc-row'>
					${insertParagraphs(text)}
				</div>`
			: ''}
			${media ?
				media.map((obj, index) => {
					// this.embedExternal(this, obj, 'backstory', index)
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
	)
}

function addImageryPanel() {
	const { media } = this.data.imagery

	return (
		`${media ?
			media.map((obj, index) => {
				const isExternal = ['instagram', 'youtube', 'vimeo'].includes(obj.source)
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
												`(<a href='${obj.url}' target='_blank'>View on ${extractRootDomain(obj.url)}</a>)`
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
	)
}

function addLinksPanel() {
	const { links } = this.data.links

	return(
		`${links ?
			links.filter(obj => obj.url).map((obj, index) => {
				const simpleUrl = simplifyUrl(obj.url)
				const text = `${obj.title ? obj.title : simpleUrl}<div class='fc-sub-url'>${simpleUrl}</div>`
				return (
					`<div class='fc-row'>
						${createLink(obj.url, text, ['fc-card'])}
					</div>`
				)
			}).join('')
		: ''}`
	)
}