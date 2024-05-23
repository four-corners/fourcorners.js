import { createC2pa } from 'c2pa'
import wasmSrc from 'c2pa/dist/assets/wasm/toolkit_bg.wasm?file'
import workerSrc from 'c2pa/dist/c2pa.worker.min.js?file'

import {
	initC2paPrerelease,
} from './c2pa-prerelease'

import {
	getVerifyUrl
} from './../helpers'

export async function initC2pa() {
	const data = await readC2paManifest.call(this)
	return data
}

async function readC2paManifest() {
	const c2pa = await createC2pa({
		wasmSrc,
		workerSrc,
	});

	try {
		const blob = await fetch(this.src, {
			mode: 'no-cors'
		}).then(response =>
			response.blob()
		)
		// Read in the image and get a manifest store
		const C2paReadResult = await c2pa.read(blob)
		const { manifestStore } = C2paReadResult
		// Get the active manifest
		this.manifest = manifestStore?.activeManifest
		// If manifest read was successful, parse data
		if(this.manifest) {
			return await getC2paData.call(this)
		} else {
			return null
		}
	} catch (err) {
		// If error message is "prerelease content detected", retry init with `c2pa-prerelease`
		if(err.message.includes('prerelease content detected')) {
			console.log('Prerelease content detected, reverting to \'@contentauth/sdk\'')
			return await initC2paPrerelease.call(this)
		} else {
			console.error('Error reading image:', err);
			return null
		}
	}
}

async function getC2paData() {
	// TODO: Parse out what non–Four Corners authorship data can be obtained from the C2PA image
	// TODO: Parse custom Four Corners data from C2PA image
	const data = {
		'authorship': {
			// 'caption': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipCaption'),
			// 'credit': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipCredit'),
			// 'license': {
			// 	'type': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseType'),
			// 	'year': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseYear'),
			// 	'holder': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseHolder'),
			// 	'label': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseLabel'),
			// 	'desc': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseDesc'),
			// 	'url': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipLicenseUrl'),
			// },
			// 'ethics': {
			// 	'label': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipEthicsLabel'),
			// 	'desc': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipEthicsDescription'),
			// },
			// 'bio': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipBio'),
			// 'website': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipWebsite'),
			// 'contact': {
			// 	'info': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipContactInfo'),
			// 	'rights': getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipContactRights'),
			// },
			// 'location': getIptcLocation(),
			// 'time': getGpsTime(),
			'verify': getVerifyUrl(this.src, true),
			// 'registration': parseContentAuthArray('fourcorners:', getNestedValue(FC_ASSERTION_KEY, 'fourcorners:authorshipRegistration')),
		},
		'backstory': {
		},
		'imagery': {
		},
		'links': {
		}
	};
	return data;
}