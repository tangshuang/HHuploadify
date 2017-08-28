import {foreach, invoke, merge, getImageFakeSize, getFileName} from './functions'

export default class {
	constructor(options = {}) {
		if (!options.container || options.container.indexOf('#') !== 0) {
			throw new Error('The container field you passed into HHuploadify is not correct!')
			return
		}

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
		this.options = merge(defaults, options)

		// force to choose only one file
		if(this.options.single) {
			this.options.multiple = false
		}

		this.id = Date.now()
		this.files = []

		this.init()
		this.events()

		return this
	}

	init() {
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
				class="uploadify-upload-button"
				style="display:none"
				>
				<span>${options.uploadText}</span>
			</a>
		`
		let queueHTML = `
			<span id="uploadify-queue-${id}" class="uploadify-queue"></span>
		`
		let sectionHTML = `
			<span class="uploadify">
				${queueHTML}
				${inputHTML}
				${uploadHTML}
			</span>
		`

		this.container = document.getElementById(options.container.replace('#', ''))
		let container = this.container
		container.innerHTML = sectionHTML
		this.input = container.getElementsByClassName('uploadify-input')[0]
		this.queue = container.getElementsByClassName('uploadify-queue')[0]
		this.chooseButton = container.getElementsByClassName('uploadify-choose-button')[0]
		this.uploadButton = container.getElementsByClassName('uploadify-upload-button')[0]

		if (options.auto) {
			this.uploadButton.style.display = 'none'
		}

		invoke(options.onInit)

		if (options.files instanceof Array && options.files.length > 0) {
			this.reset(options.files)
		}
	}
	events() {
		this.input.onchange = this.onSelectFiles.bind(this)
		this.uploadButton.onclick = this.onClickUpload.bind(this)
		this.chooseButton.onclick = () => {
			this.input.click()
		}
	}
	onSelectFiles() {
		let files = this.getSelectedFiles()
		let count = this.getExistsFilesCount()
		let options = this.options

		foreach(files, file => {
			file.index = ++count
			file.status = 0 // not begin to upload
		})

		invoke(options.onSelect, files)

		let existsCount = this.files.length

		foreach(files, file => {
			this.appendFile(file)
			if (options.auto) {
				this.uploadFile(file)
			}
		})

		let finalCount = this.files.length

		if(options.single) {
			this.chooseButton.style.display = 'none'
		}

		if (!options.auto && finalCount > existsCount) {
			this.uploadButton.style.display = 'block'
		}

		this.input.value = ''
	}
	getSelectedFiles() {
		let files = this.input.files
		// < IE 10, only one can be selected
		if (files === undefined) {
			files = this.input.value.split(',').map(item => {
				let src = item.trim()
				let file = {
					path: src,
					name: getFileName(src),
					size: getImageFakeSize(src),
				}
				return file
			})
		}

		let options = this.options
		let arr = []
		let typeArray = options.fileTypeExts.split(',')

		foreach(files, file => {
			if (typeArray.indexOf(file.name.split('.').pop()) === -1) {
				invoke(options.onSelectError, 1, file)
				console.error(`${file.name}'s file type is not allowed!`)
			}
			else if (parseInt(this.formatFileSize(file.size, true)) > options.fileSizeLimit) {
				invoke(options.onSelectError, 2, file)
				console.error(`${file.name}'s file size is over limited!`)
			}
			else if (this.isFileExists(file)) {
				invoke(options.onSelectError, 3, file)
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
		foreach(this.files, f => {
			if (f.name === file.name && f.size === file.size) {
				flag = true
			}
		})
		return flag
	}
	getExistsFilesCount() {
		return this.queue.getElementsByClassName('uploadify-item').length
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
			// chrome
			if(window.navigator.userAgent.toLowerCase().indexOf("chrome") >= 1) {
				src = window.URL.createObjectURL(file);
			}
			// firefox
			else if(window.navigator.userAgent.toLowerCase().indexOf("firefox") >= 1) {
				src = window.URL.createObjectURL(file);
			}
			else {
				src = file.path
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
		file.element.getElementsByClassName('uploadify-item-delete')[0].onclick = e => {
			this.onClickDelete(element, e.target)
		}

		this.files.push(file)
	}
	uploadFile(file) {
		if (file.status !== 0) {
			return
		}

		let options = this.options
		let xhr = new XMLHttpRequest()

		xhr.upload.onprogress = e => {
			this.onProgress(file, e.loaded, e.total)
		}

		xhr.onreadystatechange = e => {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					file.status = 2

					invoke(options.onUploadSuccess, file, xhr.responseText)

					file.element.getElementsByClassName('uploadify-item-container')[0].removeChild(file.element.getElementsByClassName('uploadify-item-progress')[0])
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
					invoke(options.onUploadError, file, xhr.responseText)
					file.element.className += ' error'
				}

				invoke(options.onUploadComplete)

				if (this.files.filter(file => file.status < 2).length === 0) {
					invoke(options.onQueueComplete)
				}
			}
		}

		xhr.open(options.method, options.url, true)
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
		let fd = new FormData()
		fd.append(options.field, file)
		let data = options.data
		if (data) {
			for (let key in data) {
				fd.append(key, data[key])
			}
		}
		xhr.send(fd)

		file.status = 1
		file.xhr = xhr
		invoke(options.onUploadStart, file)
	}
	onProgress(file, loaded, total) {
		let percent = (loaded / total * 100).toFixed(2) +'%'
		let processEl = file.element.getElementsByClassName('uploadify-item-progress')[0]
		let html

		switch (this.options.showUploadProcess) {
			case 'bar':
				html = `
					<span class="uploadify-progress-bar">
						<span class="uploadify-progress-bar-inner" style="width:${percent}"></span>
					</span>
				`
				processEl.innerHTML = html
				break
			case 'percent':
				html = `
					<span class="uploadify-progress-percent">${percent}</span>
				`
				processEl.innerHTML = html
				break
			case 'size':
			default:
				html = `
					<span class="uploadify-progress-size">${this.formatFileSize(loaded)} / ${this.formatFileSize(total)}</span>
				`
				processEl.innerHTML = html
		}
	}
	onClickUpload() {
		foreach(this.files, file => this.uploadFile(file))
		this.uploadButton.style.display = 'none'
	}
	onClickDelete(element, target) {
		let fileid = target.getAttribute('data-fileid')
		let file = this.getFileByIndex(fileid)
		if (file.xhr) {
			file.xhr.abort()
			invoke(this.onUploadCancel, file)
		}

		this.queue.removeChild(element)
		this.files.splice(this.files.indexOf(file), 1)
		invoke(this.onRemoved, file)

		if (this.files.length === 0) {
			this.uploadButton.style.display = 'none'
		}

		if (this.options.single) {
			this.chooseButton.style.display = 'block'
		}
	}
	reset(files) {
		let template = this.options.template
		let id = this.idea

		this.queue.innerHTML = ''

		foreach(files, (file, index) => {
			let tpl = template.replace(/\{queueId}/g, this.id).replace(/\{fileId}/g, index + 1)
			let el = document.createElement('div')
			el.innerHTML = tpl
			let element = el.children[0]
			element.className += ' success'
			element.style.backgroundImage = `url(${file.path})`
			element.style.backgroundSize = 'cover'

			this.queue.appendChild(element)

			file.element = element
			file.element.getElementsByClassName('uploadify-item-delete')[0].onclick = e => {
				this.onClickDelete(element, e.target)
			}

			file.index = index + 1
			file.status = 2
			file.name = file.name || getFileName(file.path)
			file.size = file.size || getImageFakeSize(file.path)
			this.files.push(file)
		})

		invoke(this.onReset)
	}
}
