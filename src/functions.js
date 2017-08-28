export function foreach(arr, callback) {
	for (let i = 0, len = arr.length; i < len; i ++) {
		if (callback(arr[i], i, arr) === false) return
	}
}
export function invoke(factory, ...args) {
	if (typeof factory === 'function') {
		factory(...args)
	}
}
export function merge(obj1, obj2) {
	for (let key in obj2) {
		let value = obj2[key]
		obj1[key] = value
	}
	return obj1
}
export function	getImageFakeSize(file) {
	let el = document.createElement('img')
	el.style.postion = 'fixed'
	el.style.top = -1000000 + 'px'
	el.src = file
	document.body.appendChild(el)
	let w = el.clientWidth
	let h = el.clientHeight
	document.body.removeChild(el)
	return w * h
}
export function getFileName(file) {
	let eos = file.indexOf(':\\') > -1 ? '\\' : '/'
	return file.split(eos).pop()
}
