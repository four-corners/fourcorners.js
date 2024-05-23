export function isChildOf(target, ref) {
	let answer = false;
	Object.entries(ref).forEach(([key, elem]) => {
		if(elem && elem.contains && elem.contains(target)) {
			answer = true;
		}
	});
	return answer;
}

export function validateEmail(string) {
  return String(string)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function simplifyUrl(url) {
	return url.replace('www.', '').replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function extractHostname(url) {
	let hostname;
	if(!url) return null;
	if(url.indexOf('//') > -1) {
		hostname = url.split('/')[2];
	} else {
		hostname = url.split('/')[0];
	}
	hostname = hostname.split(':')[0];
	hostname = hostname.split('?')[0];
	return hostname;
}

export function extractRootDomain(url) {
	if(!url) return null;
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

export function getVerifyUrl(src, beta = false) {
	return `https://verify${beta ? '-beta' : ''}.contentauthenticity.org/inspect?source=${src}`;
}