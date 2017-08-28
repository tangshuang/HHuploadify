window["HHuploadify"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = foreach;
/* harmony export (immutable) */ __webpack_exports__["d"] = invoke;
/* harmony export (immutable) */ __webpack_exports__["e"] = merge;
/* harmony export (immutable) */ __webpack_exports__["c"] = getImageFakeSize;
/* harmony export (immutable) */ __webpack_exports__["b"] = getFileName;
function foreach(arr, callback) {
	for (var i = 0, len = arr.length; i < len; i++) {
		if (callback(arr[i], i, arr) === false) return;
	}
}
function invoke(factory) {
	if (typeof factory === 'function') {
		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}

		factory.apply(undefined, args);
	}
}
function merge(obj1, obj2) {
	for (var key in obj2) {
		var value = obj2[key];
		obj1[key] = value;
	}
	return obj1;
}
function getImageFakeSize(file) {
	var el = document.createElement('img');
	el.style.postion = 'fixed';
	el.style.top = -1000000 + 'px';
	el.src = file;
	document.body.appendChild(el);
	var w = el.clientWidth;
	var h = el.clientHeight;
	document.body.removeChild(el);
	return w * h;
}
function getFileName(file) {
	var eos = file.indexOf(':\\') > -1 ? '\\' : '/';
	return file.split(eos).pop();
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__functions__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var _class = function () {
	function _class() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, _class);

		if (!options.container || options.container.indexOf('#') !== 0) {
			throw new Error('The container field you passed into HHuploadify is not correct!');
			return;
		}

		var defaults = {

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

			template: '\n\t\t\t\t<span id="uploadify-{queueId}-{fileId}" class="uploadify-item">\n\t\t\t\t\t<span class="uploadify-item-container">\n\t\t\t\t\t\t<span class="uploadify-item-progress"></span>\n\t\t\t\t\t\t<a href="javascript:void(0);" class="uploadify-item-delete" data-fileid="{fileId}">&times;</a>\n\t\t\t\t\t</span>\n\t\t\t\t</span>\n\t\t\t',

			files: null, // array, if files is not empty, list will be rendered when plugin loaded, see demo

			showUploadProcess: 'size', // bar|percent|size, when uploading, which one to show the process of uploading status
			showPreview: 1, // preview file, 0: close; 1: only preview local origin file; 2: preview file on server by result 'url' fields after complate uploading
			showPreviewField: 'url', // when showPreview is 2, which field will be used as image url from server side in response json

			// envents callback functions
			onInit: null, // when plugin is ready
			onSelect: null, // when select a file
			onSelectError: null,
			onUploadStart: null, // when a file upload start
			onUploadSuccess: null, // when a file upload success
			onUploadError: null, // when a file upload fail
			onUploadComplete: null, // when a file upload finished, success or failure
			onUploadCancel: null, // when cancel a file to upload
			onQueueComplete: null, // when all of the files in a queue complate (success or error), may you have more than one queue
			onRemoved: null, // when remove a file in the list
			onDestroy: null, // when all resource removed
			onReset: null // when after reset done
		};
		this.options = Object(__WEBPACK_IMPORTED_MODULE_0__functions__["e" /* merge */])(defaults, options);

		// force to choose only one file
		if (this.options.single) {
			this.options.multiple = false;
		}

		this.id = Date.now();
		this.files = [];

		this.init();
		this.events();

		return this;
	}

	_createClass(_class, [{
		key: 'init',
		value: function init() {
			var id = this.id;
			var options = this.options;
			var inputHTML = '\n\t\t\t<input id="uploadify-input-' + id + '"\n\t\t\t\tclass="uploadify-input"\n\t\t\t\tstyle="display:none"\n\t\t\t\ttype="file"\n\t\t\t\tname="uploadifyfile[]"\n\t\t\t\t' + (options.multiple ? 'multiple' : '') + '\n\t\t\t\taccept="' + options.fileTypeExts + '"\n\t\t\t\t>\n\t\t\t<a id="uploadify-choose-button-' + id + '"\n\t\t\t\thref="javascript:void(0)"\n\t\t\t\tclass="uploadify-choose-button"\n\t\t\t\t>\n\t\t\t\t<span>' + options.chooseText + '</span>\n\t\t\t</a>\n\t\t';
			var uploadHTML = '\n\t\t\t<a id="uploadify-upload-button-' + id + '"\n\t\t\t\thref="javascript:void(0)"\n\t\t\t\tclass="uploadify-upload-button"\n\t\t\t\tstyle="display:none"\n\t\t\t\t>\n\t\t\t\t<span>' + options.uploadText + '</span>\n\t\t\t</a>\n\t\t';
			var queueHTML = '\n\t\t\t<span id="uploadify-queue-' + id + '" class="uploadify-queue"></span>\n\t\t';
			var sectionHTML = '\n\t\t\t<span class="uploadify">\n\t\t\t\t' + queueHTML + '\n\t\t\t\t' + inputHTML + '\n\t\t\t\t' + uploadHTML + '\n\t\t\t</span>\n\t\t';

			this.container = document.getElementById(options.container.replace('#', ''));
			var container = this.container;
			container.innerHTML = sectionHTML;
			this.input = container.getElementsByClassName('uploadify-input')[0];
			this.queue = container.getElementsByClassName('uploadify-queue')[0];
			this.chooseButton = container.getElementsByClassName('uploadify-choose-button')[0];
			this.uploadButton = container.getElementsByClassName('uploadify-upload-button')[0];

			if (options.auto) {
				this.uploadButton.style.display = 'none';
			}

			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onInit);

			if (options.files instanceof Array && options.files.length > 0) {
				this.reset(options.files);
			}
		}
	}, {
		key: 'events',
		value: function events() {
			var _this = this;

			this.input.onchange = this.onSelectFiles.bind(this);
			this.uploadButton.onclick = this.onClickUpload.bind(this);
			this.chooseButton.onclick = function () {
				_this.input.click();
			};
		}
	}, {
		key: 'onSelectFiles',
		value: function onSelectFiles() {
			var _this2 = this;

			var files = this.getSelectedFiles();
			var count = this.getExistsFilesCount();
			var options = this.options;

			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["a" /* foreach */])(files, function (file) {
				file.index = ++count;
				file.status = 0; // not begin to upload
			});

			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onSelect, files);

			var existsCount = this.files.length;

			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["a" /* foreach */])(files, function (file) {
				_this2.appendFile(file);
				if (options.auto) {
					_this2.uploadFile(file);
				}
			});

			var finalCount = this.files.length;

			if (options.single) {
				this.chooseButton.style.display = 'none';
			}

			if (!options.auto && finalCount > existsCount) {
				this.uploadButton.style.display = 'block';
			}

			this.input.value = '';
		}
	}, {
		key: 'getSelectedFiles',
		value: function getSelectedFiles() {
			var _this3 = this;

			var files = this.input.files;
			// < IE 10, only one can be selected
			if (files === undefined) {
				files = this.input.value.split(',').map(function (item) {
					var src = item.trim();
					var file = {
						path: src,
						name: Object(__WEBPACK_IMPORTED_MODULE_0__functions__["b" /* getFileName */])(src),
						size: Object(__WEBPACK_IMPORTED_MODULE_0__functions__["c" /* getImageFakeSize */])(src)
					};
					return file;
				});
			}

			var options = this.options;
			var arr = [];
			var typeArray = options.fileTypeExts.split(',');

			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["a" /* foreach */])(files, function (file) {
				if (typeArray.indexOf(file.name.split('.').pop()) === -1) {
					Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onSelectError, 1, file);
					console.error(file.name + '\'s file type is not allowed!');
				} else if (parseInt(_this3.formatFileSize(file.size, true)) > options.fileSizeLimit) {
					Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onSelectError, 2, file);
					console.error(file.name + '\'s file size is over limited!');
				} else if (_this3.isFileExists(file)) {
					Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onSelectError, 3, file);
					console.error(file.name + ' is in selected list.');
				} else {
					arr.push(file);
				}
			});

			return arr;
		}
	}, {
		key: 'isFileExists',
		value: function isFileExists(file) {
			var flag = false;
			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["a" /* foreach */])(this.files, function (f) {
				if (f.name === file.name && f.size === file.size) {
					flag = true;
				}
			});
			return flag;
		}
	}, {
		key: 'getExistsFilesCount',
		value: function getExistsFilesCount() {
			return this.queue.getElementsByClassName('uploadify-item').length;
		}
	}, {
		key: 'formatFileSize',
		value: function formatFileSize(size, withKB) {
			if (size > 1024 * 1024 && !withKB) {
				size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
			} else {
				size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
			}
			return size;
		}
	}, {
		key: 'getFileByIndex',
		value: function getFileByIndex(index) {
			var files = this.files;
			for (var i = 0, len = files.length; i < len; i++) {
				if (files[i].index == index) {
					return files[i];
				}
			}
			return null;
		}
	}, {
		key: 'appendFile',
		value: function appendFile(file) {
			var _this4 = this;

			var src = void 0;
			if (this.options.showPreview) {
				// chrome
				if (window.navigator.userAgent.toLowerCase().indexOf("chrome") >= 1) {
					src = window.URL.createObjectURL(file);
				}
				// firefox
				else if (window.navigator.userAgent.toLowerCase().indexOf("firefox") >= 1) {
						src = window.URL.createObjectURL(file);
					} else {
						src = file.path;
					}
			}
			var template = this.options.template;
			var html = template.replace(/\{queueId}/g, this.id).replace(/\{fileId}/g, file.index);
			var el = document.createElement('div');
			el.innerHTML = html;
			var element = el.children[0];

			if (src) {
				element.style.backgroundImage = 'url(' + src + ')';
				element.style.backgroundSize = 'cover';
			}

			this.queue.appendChild(element);

			file.element = element;
			file.element.getElementsByClassName('uploadify-item-delete')[0].onclick = function (e) {
				_this4.onClickDelete(element, e.target);
			};

			this.files.push(file);
		}
	}, {
		key: 'uploadFile',
		value: function uploadFile(file) {
			var _this5 = this;

			if (file.status !== 0) {
				return;
			}

			var options = this.options;
			var xhr = new XMLHttpRequest();

			xhr.upload.onprogress = function (e) {
				_this5.onProgress(file, e.loaded, e.total);
			};

			xhr.onreadystatechange = function (e) {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						file.status = 2;

						Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onUploadSuccess, file, xhr.responseText);

						file.element.getElementsByClassName('uploadify-item-container')[0].removeChild(file.element.getElementsByClassName('uploadify-item-progress')[0]);
						file.element.className += ' success';

						if (options.showPreview > 1) {
							var _data = JSON.parse(xhr.responseText);
							if (_data && _data[options.showPreviewField]) {
								file.element.style.backgroundImage = 'url(' + _data[options.showPreviewField] + ')';
							}
						}
					} else {
						file.status = 3;
						Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onUploadError, file, xhr.responseText);
						file.element.className += ' error';
					}

					Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onUploadComplete);

					if (_this5.files.filter(function (file) {
						return file.status < 2;
					}).length === 0) {
						Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onQueueComplete);
					}
				}
			};

			xhr.open(options.method, options.url, true);
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			var fd = new FormData();
			fd.append(options.field, file);
			var data = options.data;
			if (data) {
				for (var key in data) {
					fd.append(key, data[key]);
				}
			}
			xhr.send(fd);

			file.status = 1;
			file.xhr = xhr;
			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(options.onUploadStart, file);
		}
	}, {
		key: 'onProgress',
		value: function onProgress(file, loaded, total) {
			var percent = (loaded / total * 100).toFixed(2) + '%';
			var processEl = file.element.getElementsByClassName('uploadify-item-progress')[0];
			var html = void 0;

			switch (this.options.showUploadProcess) {
				case 'bar':
					html = '\n\t\t\t\t\t<span class="uploadify-progress-bar">\n\t\t\t\t\t\t<span class="uploadify-progress-bar-inner" style="width:' + percent + '"></span>\n\t\t\t\t\t</span>\n\t\t\t\t';
					processEl.innerHTML = html;
					break;
				case 'percent':
					html = '\n\t\t\t\t\t<span class="uploadify-progress-percent">' + percent + '</span>\n\t\t\t\t';
					processEl.innerHTML = html;
					break;
				case 'size':
				default:
					html = '\n\t\t\t\t\t<span class="uploadify-progress-size">' + this.formatFileSize(loaded) + ' / ' + this.formatFileSize(total) + '</span>\n\t\t\t\t';
					processEl.innerHTML = html;
			}
		}
	}, {
		key: 'onClickUpload',
		value: function onClickUpload() {
			var _this6 = this;

			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["a" /* foreach */])(this.files, function (file) {
				return _this6.uploadFile(file);
			});
			this.uploadButton.style.display = 'none';
		}
	}, {
		key: 'onClickDelete',
		value: function onClickDelete(element, target) {
			var fileid = target.getAttribute('data-fileid');
			var file = this.getFileByIndex(fileid);
			if (file.xhr) {
				file.xhr.abort();
				Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(this.onUploadCancel, file);
			}

			this.queue.removeChild(element);
			this.files.splice(this.files.indexOf(file), 1);
			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(this.onRemoved, file);

			if (this.files.length === 0) {
				this.uploadButton.style.display = 'none';
			}

			if (this.options.single) {
				this.chooseButton.style.display = 'block';
			}
		}
	}, {
		key: 'reset',
		value: function reset(files) {
			var _this7 = this;

			var template = this.options.template;
			var id = this.idea;

			this.queue.innerHTML = '';

			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["a" /* foreach */])(files, function (file, index) {
				var tpl = template.replace(/\{queueId}/g, _this7.id).replace(/\{fileId}/g, index + 1);
				var el = document.createElement('div');
				el.innerHTML = tpl;
				var element = el.children[0];
				element.className += ' success';
				element.style.backgroundImage = 'url(' + file.path + ')';
				element.style.backgroundSize = 'cover';

				_this7.queue.appendChild(element);

				file.element = element;
				file.element.getElementsByClassName('uploadify-item-delete')[0].onclick = function (e) {
					_this7.onClickDelete(element, e.target);
				};

				file.index = index + 1;
				file.status = 2;
				file.name = file.name || Object(__WEBPACK_IMPORTED_MODULE_0__functions__["b" /* getFileName */])(file.path);
				file.size = file.size || Object(__WEBPACK_IMPORTED_MODULE_0__functions__["c" /* getImageFakeSize */])(file.path);
				_this7.files.push(file);
			});

			Object(__WEBPACK_IMPORTED_MODULE_0__functions__["d" /* invoke */])(this.onReset);
		}
	}]);

	return _class;
}();

/* harmony default export */ __webpack_exports__["default"] = (_class);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HHuploadify__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__functions__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var _class = function (_HHuploadify) {
  _inherits(_class, _HHuploadify);

  function _class(options) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, options));

    var defaults = {
      dragable: true
    };

    _this.options = Object(__WEBPACK_IMPORTED_MODULE_1__functions__["e" /* merge */])(defaults, _this.options);

    if (_this.options.ingle) {
      _this.options.dragable = false;
    }

    var onQueueComplete = _this.options.onQueueComplete;
    _this.options.onQueueComplete = function () {
      if (typeof onQueueComplete === 'function') {
        onQueueComplete();
      }
      if (_this.options.dragable) {
        var $queue = $(_this.options.container).find('.uploadify-queue');
        $queue.find('.uploadify-item').addClass('dragable');
        $queue.dragsort({
          dragSelector: '.uploadify-item',
          placeHolderTemplate: '<span class="uploadify-item drag-placeholder"></span>',
          dragBetween: true
        });
      }
    };
    return _this;
  }

  _createClass(_class, [{
    key: 'onSelectFiles',
    value: function onSelectFiles() {
      _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'onSelectFiles', this).call(this);

      if (this.options.dragable) {
        $(this.options.container).find('.uploadify-queue').dragsort("destroy");
      }
    }
  }]);

  return _class;
}(__WEBPACK_IMPORTED_MODULE_0__HHuploadify__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (_class);

/***/ })
/******/ ]).default;