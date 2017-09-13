export default class HHuploadify {
	constructor(options = {}) {
		let defaults = {

			container: '', // i.e. #upload

			// upload options
			url: '', // upload to which server url
			method: 'post', // http request type: post/put
			field: 'file', // upload file name field, php $_FILES['file']
			data: null, // append data in your request like: {key1:value1,key2:value2}

			// view options
			fileTypeExts: 'jpg,jpeg,png,gif,JPG,PNG,GIF,JPEG', // file can be uploaded exts like: 'jpg,png'
			fileSizeLimit: 2048, // max upload file size: KB

			multiple: true, // be or not be able to choose multi files
			single: false, // force to upload only one item, even through multiple is true
			auto: false, // auto begin to upload after select local files

			chooseText: 'Choose', // words on choose button
			uploadText: 'Upload', // words on upload button, if auto is true, upload button will not show

			template: `
				<span id="uploadify-{queueId}-{fileId}" class="uploadify-item">
					<span class="uploadify-item-container">
						<span class="uploadify-item-progress"></span>
						<a href="javascript:void(0);" class="uploadify-item-delete" data-fileid="{fileId}">&times;</a>
					</span>
				</span>
			`,

			files: null, // array, if files is not empty, list will be rendered when plugin loaded, see demo

			showUploadProcess: 'size', // bar|percent|size, when uploading, which one to show the process of uploading status
			showPreview: 1, // preview file, 0: close; 1: only preview local origin file; 2: preview file on server by result 'url' fields after complate uploading
			showPreviewField: 'url', // when showPreview is 2, which field will be used as image url from server side in response json

			// envents callback functions
			onInit: null, // when plugin is ready
			onSelect: null, // when select a file
			onSelectError: null,
			onUploadStart: null, // when a file upload start
			onUploadSuccess: null,// when a file upload success
			onUploadError: null, // when a file upload fail
			onUploadComplete: null, // when a file upload finished, success or failure
			onUploadCancel: null, // when cancel a file to upload
			onQueueComplete: null, // when all of the files in a queue complate (success or error), may you have more than one queue
			onRemoved: null, // when remove a file in the list
			onDestroy: null, // when all resource removed
			onReset: null, // when after reset done
		}
		this.options = this.merge(defaults, options)

		this.id = Date.now()
		this.files = []

		let appVersion = window.navigator.appVersion
		this.isIE = appVersion.indexOf('MSIE') !== -1
		this.isIE9 = this.isIE && appVersion.indexOf('MSIE 9') !== -1
		this.isOldIE = this.isIE && appVersion.indexOf('MSIE 10') === -1 && appVersion.indexOf('MSIE 9') === -1

		// force to choose only one file
		if(this.options.single) {
			this.options.multiple = false
		}
		if (this.isIE9) {
			this.options.multiple = false
		}

		this.init()
		this.events()
	}
	init() {
		let id = this.id
		let options = this.options
		let chooseHTML = `
			<a id="uploadify-choose-button-${id}"
				href="javascript:void(0)"
				class="uploadify-choose-button"
				>
				<span>${options.chooseText}</span>
			</a>
		`
		let uploadHTML = `
			<a id="uploadify-upload-button-${id}"
				href="javascript:void(0)"
				class="uploadify-upload-button hidden"
				>
				<span>${options.uploadText}</span>
			</a>
		`
		let errorHTML = `
			<span id="uploadify-error-${id}" class="uploadify-error hidden"><span class="uploadify-error-container"><span class="uploadify-error-msg"></span></span></span>
		`
		let queueHTML = `
			<span id="uploadify-queue-${id}" class="uploadify-queue"></span>
		`
		let sectionHTML = `
			<span class="uploadify">
				${queueHTML}
				${chooseHTML}
				${uploadHTML}
				${errorHTML}
			</span>
		`

		this.container = document.querySelector(options.container)
		let container = this.container
		container.innerHTML = sectionHTML
		this.queue = container.querySelector('.uploadify-queue')
		this.chooseButton = container.querySelector('.uploadify-choose-button')
		this.uploadButton = container.querySelector('.uploadify-upload-button')
		this.resetInput()

		if (options.auto) {
			this.hide(this.uploadButton)
		}

		this.invoke(options.onInit)

		if (options.files instanceof Array && options.files.length > 0) {
			this.reset(options.files)
		}

		if (this.isOldIE) {
			this.showError('Browser Not Support!', true)
		}
	}
	resetInput() {
		let id = this.id
		let options = this.options
		let inputHTML = `
			<input id="uploadify-input-${id}"
				class="uploadify-input"
				style="display:none"
				type="file"
				name="uploadifyfile[]"
				${options.multiple ? 'multiple' : ''}
				accept="${options.fileTypeExts}"
				>
		`
		let el = document.createElement('div')
		el.innerHTML = inputHTML
		let input = el.children[0]
		let wrapper = this.container.children[0]
		input.parentNode.removeChild(input)
		wrapper.appendChild(input)
		input.onchange = () => this.onSelectFiles()
		this.input = input
	}
	events() {
		this.uploadButton.onclick = () => this.onClickUpload()
		this.chooseButton.onclick = () => this.input.click()
	}
	onSelectFiles() {
		let options = this.options

		// if not multiple and there are some files are waiting for upload
		if (!options.multiple && this.files.filter(item => item.status < 2).length > 0) {
			this.showError('Waiting upload!')
			return
		}

		let files = this.getSelectedFiles()
		let count = this.getExistsFilesCount()

		this.foreach(files, file => {
			file.index = ++count
			file.status = 0 // not begin to upload
		})

		this.invoke(options.onSelect, files, this.files)

		let existsCount = this.files.length

		this.foreach(files, file => {
			this.appendFile(file)
			if (options.auto) {
				this.uploadFile(file)
			}
		})

		let finalCount = this.files.length

		if(options.single) {
			this.hide(this.chooseButton)
		}

		if (!options.auto && finalCount > existsCount) {
			this.fadeIn(this.uploadButton)
		}
	}
	getImageFakeSize(file) {
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
	getFileName(file) {
		let eos = file.indexOf(':\\') > -1 ? '\\' : '/'
		return file.split(eos).pop()
	}
	getSelectedFiles() {
		let inputValue = this.input.value
		let files = this.isIE9 ? [{
					path: inputValue,
					name: this.getFileName(inputValue),
					size: this.getImageFakeSize(inputValue),
				}] : this.input.files

		let options = this.options
		let arr = []
		let typeArray = options.fileTypeExts.split(',')

		this.foreach(files, file => {
			if (typeArray.indexOf(file.name.split('.').pop()) === -1) {
				this.showError('Type Error!')
				this.invoke(options.onSelectError, 1, file)
				console.error(`${file.name}'s file type is not allowed!`)
			}
			else if (parseInt(this.formatFileSize(file.size, true)) > options.fileSizeLimit) {
				this.showError('Size Limit!')
				this.invoke(options.onSelectError, 2, file)
				console.error(`${file.name}'s file size is over limited!`)
			}
			else if (this.isFileExists(file)) {
				this.showError('File(s) Exists!')

				let existsFile = this.isFileExists(file)
				let element = existsFile.element
				this.blink(element)

				this.invoke(options.onSelectError, 3, file)
				console.error(`${file.name} is in selected list.`)
			}
			else {
				arr.push(file)
			}
		})

		return arr
	}
	isFileExists(file) {
		let flag = false
		this.foreach(this.files, (f, i) => {
			if (f.name === file.name && f.size === file.size) {
				flag = f
			}
		})
		return flag
	}
	getExistsFilesCount() {
		return this.files.length
	}
	formatFileSize(size, withKB) {
	  if (size > 1024 * 1024 && !withKB) {
	    size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB'
	  }
	  else{
	    size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB'
	  }
	  return size
	}
	getFileByIndex(index){
		let files = this.files
	  for (var i = 0, len = files.length; i < len; i++) {
	    if (files[i].index == index) {
	      return files[i]
	    }
	  }
	  return null
	}
	appendFile(file) {
		let src
		if (this.options.showPreview) {
			if (typeof window.URL !== 'undefined') {
				src = window.URL.createObjectURL(file)
			}
			else {
				src = 'file:///' + file.path.replace(/\\/g, '/')
			}
		}
		let template = this.options.template
		let html = template.replace(/\{queueId}/g, this.id).replace(/\{fileId}/g, file.index)
		let el = document.createElement('div')
		el.innerHTML = html
		let element = el.children[0]

		if (src) {
			element.style.backgroundImage = `url(${src})`
			element.style.backgroundSize = 'cover'
		}

		this.queue.appendChild(element)

		file.element = element
		file.element.querySelector('.uploadify-item-delete').onclick = e => {
			this.onClickDelete(element, e.target)
		}

		this.files.push(file)
	}
	uploadFile(file) {
		this.isIE9 ? this.uploadFileByIFrame(file) : this.uploadFileByXHR(file)
		this.resetInput()
	}
	uploadFileByIFrame(file) {
		if (file.status !== 0) {
			return
		}
		let id = this.id
		let options = this.options
		let f = document.createElement('div')
		f.style.position = 'absolute'
		f.style.top = '-1000px'
    		f.style.left = '-1000px'
		f.style.height = '1px'
		f.style.overflow = 'auto'
		f.innerHTML = `
			<form action="${options.url}" method="${options.method}" target="upload-iframe-${id}-${file.index}" enctype="multipart/form-data">
				<button type="submit"></button>
			</form>
			<iframe name="upload-iframe-${id}-${file.index}"></iframe>
		`
		f.querySelector('form').appendChild(this.input)

		let iframe = f.querySelector('iframe')
		let iframeOnload = (isTimeout) => {
			if (file.status !== 1) {
				return
			}
			if (isTimeout === 'timeout') {
				file.status = 4
				this.invoke(options.onUploadError, file, 'timeout')
				file.element.className += ' error'
			}
			else {
				file.status = 2
				file.element.querySelector('.uploadify-item-container').removeChild(file.element.querySelector('.uploadify-item-progress'))
				file.element.className += ' success'

				let notify = () => {
					let responseDoc = iframe.contentDocument || iframe.contentWindow.document
					let responseText = responseDoc.body.children.length && responseDoc.body.children[0].innerText

					if (responseText) {
						this.invoke(options.onUploadSuccess, file, responseText)
						if (options.showPreview > 1) {
							let data = JSON.parse(responseText)
							if (data && data[options.showPreviewField]) {
								file.element.style.backgroundImage = `url(${data[options.showPreviewField]})`
							}
						}
					}

					return responseText
				}

				let count = 1
				let timer = setInterval(() => {
					let responseText = notify()
					if (responseText || count === 10) {
						clearInterval(timer)
					}
					count ++
				}, 500)
			}

			this.invoke(options.onUploadComplete)

			if (this.files.filter(file => file.status < 2).length === 0) {
				this.invoke(options.onQueueComplete)
			}
		}
		if (window.addEventListener) {
		      iframe.addEventListener('load', iframeOnload, false)
		}
		else {
		      iframe.attachEvent('onload', iframeOnload)
		}

		document.body.appendChild(f)
		f.querySelector('button').click()

		file.status = 1
		file.iframe = iframe.parentNode
		this.invoke(options.onUploadStart, file)
	}
	uploadFileByXHR(file) {
		if (file.status !== 0) {
			return
		}

		let options = this.options
		let xhr = new XMLHttpRequest()

		if (xhr.upload) {
			xhr.upload.onprogress = e => {
				this.onProgress(file, e.loaded, e.total)
			}
		}

		xhr.onreadystatechange = e => {
			if (file.status !== 1) {
				return
			}
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					file.status = 2

					this.invoke(options.onUploadSuccess, file, xhr.responseText)

					file.element.querySelector('.uploadify-item-container').removeChild(file.element.querySelector('.uploadify-item-progress'))
					file.element.className += ' success'

					if (options.showPreview > 1) {
						let data = JSON.parse(xhr.responseText)
						if (data && data[options.showPreviewField]) {
							file.element.style.backgroundImage = `url(${data[options.showPreviewField]})`
						}
					}
				}
				else {
					file.status = 3
					this.invoke(options.onUploadError, file, xhr.responseText)
					file.element.className += ' error'
				}

				this.invoke(options.onUploadComplete)

				if (this.files.filter(file => file.status < 2).length === 0) {
					this.invoke(options.onQueueComplete)
				}
			}
		}

		xhr.open(options.method, options.url, true)
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
		let fd
		if (typeof FormData === 'undefined') {
			fd = []
			fd.push(options.field, file)
		}
		else {
			fd = new FormData()
			fd.append(options.field, file)
		}
		let data = options.data
		if (data) {
			for (let key in data) {
				fd.append(key, data[key])
			}
		}
		xhr.send(fd)

		file.status = 1
		file.xhr = xhr
		this.invoke(options.onUploadStart, file)
	}
	onProgress(file, loaded, total) {
		let percent = (loaded / total * 100).toFixed(2) +'%'
		let processEl = file.element.querySelector('.uploadify-item-progress')
		let html = ''

		switch (this.options.showUploadProcess) {
			case 'bar':
				html = `
					<span class="uploadify-progress-bar">
						<span class="uploadify-progress-bar-inner" style="width:${percent}"></span>
					</span>
				`
				break
			case 'percent':
				html = `
					<span class="uploadify-progress-percent">${percent}</span>
				`
				break
			case 'size':
				html = `
					<span class="uploadify-progress-size">${this.formatFileSize(loaded)} / ${this.formatFileSize(total)}</span>
				`
				break
			default:
				html = ''
		}
		
		processEl.innerHTML = html
	}
	onClickUpload() {
		this.foreach(this.files, file => this.uploadFile(file))
		this.fadeOut(this.uploadButton)
		this.resetInput()
	}
	onClickDelete(element, target) {
		let fileid = target.getAttribute('data-fileid')
		let file = this.getFileByIndex(fileid)
		if (file.xhr) {
			file.xhr.abort()
			this.invoke(this.options.onUploadCancel, file)
		}
		if (file.iframe) {
			document.body.removeChild(file.iframe)
			this.invoke(this.options.onUploadCancel, file)
		}

		this.queue.removeChild(element)
		this.files.splice(this.files.indexOf(file), 1)
		this.resetInput()
		this.invoke(this.options.onRemoved, file)

		if (this.files.length === 0) {
			this.fadeOut(this.uploadButton)
		}

		if (this.options.single) {
			this.show(this.chooseButton)
		}
	}
	reset(files) {
		let template = this.options.template
		let id = this.idea

		this.queue.innerHTML = ''

		this.foreach(files, (file, index) => {
			let tpl = template.replace(/\{queueId}/g, this.id).replace(/\{fileId}/g, index + 1)
			let el = document.createElement('div')
			el.innerHTML = tpl
			let element = el.children[0]
			element.className += ' success'
			element.style.backgroundImage = `url(${file.path})`
			element.style.backgroundSize = 'cover'

			this.queue.appendChild(element)

			file.element = element
			file.element.querySelector('.uploadify-item-delete').onclick = e => {
				this.onClickDelete(element, e.target)
			}

			file.index = index + 1
			file.status = 2
			file.name = file.name || this.getFileName(file.path)
			file.size = file.size || this.getImageFakeSize(file.path)
			this.files.push(file)
		})

		this.invoke(this.options.onReset)
	}
	showError(msg, notDisappear = false) {
		let errorEl = this.container.querySelector('.uploadify-error')
		errorEl.querySelector('.uploadify-error-msg').innerText = msg
		this.fadeIn(errorEl)
		if (!notDisappear) {
			setTimeout(() => this.fadeOut(errorEl), 1500)
		}
	}
	// =============== functions ================
	invoke(factory, ...args) {
		if (typeof factory === 'function') {
			factory.apply(this, args)
		}
	}
	hide(element) {
		let className = element.className
		if (className.indexOf('hidden') === -1) {
			element.className += ' hidden'
		}
	}
	show(element) {
		element.className = element.className.replace('hidden', '')
	}
	fadeOut(element) {
		let className = element.className
		if (className.indexOf('hidden') > -1) {
			return
		}
		element.className += ' fade fadeIn'
		element.className = element.className.replace('fadeIn', 'fadeOut')
		setTimeout(() => element.className = className + ' hidden', 500)
	}
	fadeIn(element) {
		let className = element.className
		if (className.indexOf('hidden') === -1) {
			return
		}
		if (className.indexOf('fadeIn') > -1) {
			return
		}
		element.className = className.replace('hidden', 'fade fadeOut')
		setTimeout(() => element.className = element.className.replace('fadeOut', 'fadeIn'), 0)
		setTimeout(() => element.className = className.replace('hidden', ''), 500)
	}
	blink(element) {
		let className = element.className
		if (className.indexOf('hidden') > -1) {
			return
		}
		if (className.indexOf('fade') > -1) {
			return
		}

		let newClassName = className + ' blink'
		let count = 4
		let timer = setInterval(() => {
			element.className = newClassName + ' fade60'
			setTimeout(() => element.className = newClassName, 100)
			count --
			if (count <= 0) {
				clearInterval(timer)
				element.className = className
			}
		}, 200)
	}
	foreach(arr, callback) {
		for (let i = 0, len = arr.length; i < len; i ++) {
			if (callback(arr[i], i, arr) === false) return
		}
	}
	merge(obj1, obj2) {
		for (let key in obj2) {
			if (obj2.hasOwnProperty(key)) {
				let value = obj2[key]
				obj1[key] = value
			}
		}
		return obj1
	}
}
