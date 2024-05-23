export async function initJson() {
	const data = await parseJsonData.call(this)
	return data
}


async function parseJsonData() {
	const { container } = this.elems;
	const script = container.querySelector('script')
	let string
	if(script) {
		//If embed JSON is stored in child script tag
		string = script.innerHTML
		script.remove()
	} else if(container.hasAttribute('data-fc')) {
		//If embed JSON is stored in data-fc attributte
		string = container.dataset.fc
		delete container.dataset.fc
	}
	if(!string) return null
	const data = JSON.parse(string)
	return data
}