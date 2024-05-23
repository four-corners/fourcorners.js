import { ContentAuth } from '@contentauth/sdk'
// import wasmSrc from 'c2pa/dist/assets/wasm/toolkit_bg.wasm?file'
// import workerSrc from 'c2pa/dist/c2pa.worker.min.js?file'
import wasmSrc from '@contentauth/sdk/dist/assets/wasm/toolkit_bg.wasm?file'
import workerSrc from '@contentauth/sdk/dist/cai-sdk.worker.min.js?file'

import {
	FC_CORNER_KEYS,
	FC_DEFAULT_DATA,
	FC_OPTION_KEYS,
	FC_DEFAULT_OPTIONS,
	FC_ASSERTION_KEY,
	FC_STRINGS
} from './../constants'

import {
	getVerifyUrl
} from './../helpers'

export async function initC2paPrerelease() {
	this.provenance = await readC2paPrereleaseProvenance.call(this)
	const data = await getC2paPrereleaseData.call(this)
	return data
}

async function readC2paPrereleaseProvenance() {
	let caSdk, c2paData
	try {
		caSdk = new ContentAuth({
			wasmSrc: wasmSrc,
			workerSrc: workerSrc
		})

		c2paData = caSdk && this.src
			? await caSdk.processImage(this.src)
			: null

		return c2paData?.exists ? c2paData : null
	} catch (error) {
		console.warn(error)
	}
}

function getC2paPrereleaseData() {
	const getAssertionData = (assertion) => {
		// console.log(this.provenance)
		let data = {};
		this?.provenance?.claims.forEach((claim, key) => {
			if(claim.assertions.get(assertion)) {
				data = { ...data, ...claim.assertions.get(assertion).data };
			}
		})
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
			'verify': getVerifyUrl(this.src, true),
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