/**
 * version 1.0.2
 * HHuploadify - a jquery plugin for pictures uploading extending Huploadify ( which extends uploadify )
 * written on omd 1.1.2 https://github.com/tangshuang/omd
 */

!function(dependencies,factory){
	// amd || cmd
	if(typeof define == 'function' && (define.cmd || define.amd)) {
		define(dependencies,function() {
			return factory();
		});
	}
	else {
		var ex = factory();
		// CommonJS NodeJS
		if(typeof module !== 'undefined' && typeof exports === 'object') {
			module.exports = ex;
		}
		// Javascript: exports as window functions
		else {
			for(var i in ex) {
				window[i] = ex[i];
			}
		}
	}
}(['jquery'],function(){
	$.fn.HHuploadify = function(opts){
		var itemTemp = '<span id="${fileID}" class="uploadify-queue-item"><span class="uploadify-queue-item-container"><span class="uploadify-progress"><span class="uploadify-progress-bar"></span></span><span class="up_filename">${fileName}</span><a href="javascript:void(0);" class="uploadbtn">上传</a><a href="javascript:void(0);" class="delfilebtn">&times;</a></span></span>';
		var defaults = {
			fileTypeExts:'*.jpg;*.jpeg;*.png;*.gif',//file can be uploaded exts like: '*.jpg;*.doc'
			uploader:'',//upload to server url
			method:'post',//http request type: get/post
			formData:null,//append data like: {key1:value1,key2:value2}
			fileObjName:'file',//upload form file name field, php $_FILES['file']
			multi:true,//choose multi pictures
			isSingle:false,// force to upload only one item
			auto:true,//auto upload
			fileSizeLimit:2048,//max upload file size: KB
			showPreview:1,//preview picture, 0: close; 1: only preview local origin picture; 2: preview picture on server by result 'url' fields after complate uploading
			showUploadedFilename:false,
			showUploadedPercent:false,
			showUploadedSize:false,
			buttonText:'choose',//words on upload button
			itemTitle:false,//words in item area, you should use when isSingle=true
			removeTimeout: 500,//process bar fadeout time
			itemTemplate:itemTemp,
			onInit:null,//when plugin is ready
			onSelect:null,//when select a file
			onUploadStart:null,//when a picture upload start
			onUploadSuccess:null,//when a picture upload success
			onUploadError:null, //when a picture upload fail
			onUploadComplete:null,//when a picture upload success (or error)
			onCancel:null,//when cancel a picture to upload
			onQueueComplete:null,//when all of the pictures in a queue complate (success or error), may you have more than one queue
			onClearQueue:null,//when cancel a queue
			onDestroy:null//when cancel all queue
		};

		var option = $.extend(defaults,opts);

		// force to choose only one picture
		if(option.isSingle) {
			option.multi = false;
		}

		//定义一个通用函数集合
		var F = {
			//将文件的单位由bytes转换为KB或MB，若第二个参数指定为true，则永远转换为KB
			formatFileSize : function(size,withKB){
				if (size > 1024 * 1024 && !withKB){
					size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
				}
				else{
					size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
				}
				return size;
			},
			//将输入的文件类型字符串转化为数组,原格式为*.jpg;*.png
			getFileTypes : function(str){
				var result = [];
				var arr1 = str.split(";");
				for(var i=0, len=arr1.length; i<len; i++){
					result.push(arr1[i].split(".").pop());
				}
				return result;
			},
			//根据文件序号获取文件
			getFile : function(index,files){
				for(var i=0;i<files.length;i++){
					if(files[i].index == index){
						return files[i];
					}
				}
				return null;
			}
		};

		var returnObj = null;
		var originImageSrc; // 选择本地图片后，预览该图片，将本地图片的显示信息记录到该变量中用于展示

		this.each(function(index, element){
			var _this = $(element);
			var instanceNumber = $('.uploadify').length+1;
			var uploadManager = {
				container : _this,
				filteredFiles : [],//过滤后的文件数组
				init : function(){
					var inputStr = '<input id="select_btn_'+instanceNumber+'" class="selectbtn" style="display:none;" type="file" name="fileselect[]"';
					inputStr += option.multi ? ' multiple' : '';
					inputStr += ' accept="';
					inputStr += F.getFileTypes(option.fileTypeExts).join(",");
					inputStr += '"/>';
					inputStr += '<a id="file_upload_'+instanceNumber+'-button" href="javascript:void(0)" class="uploadify-button"><span>';
					inputStr += option.buttonText;
					inputStr += '</span></a>';
					var uploadFileListStr = '<span id="file_upload_'+instanceNumber+'-queue" class="uploadify-queue"></span>';
					_this.append('<span class="uploadify">' + uploadFileListStr + inputStr + '<span class="uploadify-clear"></span>' + '</span>');

					//初始化返回的实例
					returnObj =  {
						instanceNumber : instanceNumber,
						upload : function(fileIndex){
							if(fileIndex === '*'){
								for(var i=0,len=uploadManager.filteredFiles.length;i<len;i++){
									uploadManager._uploadFile(uploadManager.filteredFiles[i]);
								}
							}
							else{
								var file = F.getFile(fileIndex,uploadManager.filteredFiles);
								file && uploadManager._uploadFile(file);
							}
						},
						cancel : function(fileIndex){
							if(fileIndex === '*'){
								var len=uploadManager.filteredFiles.length;
								for(var i=len-1;i>=0;i--){
									uploadManager._deleteFile(uploadManager.filteredFiles[i]);
								}
								option.onClearQueue && option.onClearQueue(len);
							}
							else{
								var file = F.getFile(fileIndex,uploadManager.filteredFiles);
								file && uploadManager._deleteFile(file);
							}
						},
						disable : function(instanceID){
							var parent = instanceID ? $('file_upload_'+instanceID+'-button') : $('body');
							parent.find('.uploadify-button').css('background-color','#888').off('click');
						},
						ennable : function(instanceID){
							//点击上传按钮时触发file的click事件
							var parent = instanceID ? $('file_upload_'+instanceID+'-button') : $('body');
							parent.find('.uploadify-button').css('background-color','#707070').on('click',function(){
								parent.find('.selectbtn').trigger('click');
							});
						},
						destroy : function(){
							uploadManager.container.html('');
							uploadManager = null;
							option.onDestroy && option.onDestroy();
						},
						settings : function(name,value){
							if(arguments.length==1){
								return option[name];
							}
							else{
								if(name=='formData'){
									option.formData = $.extend(option.formData, value);
								}
								else{
									option[name] = value;
								}
							}
						},
						HHuploadify : function(){
							var method = arguments[0];
							if(method in this){
								Array.prototype.splice.call(arguments, 0, 1);
								this[method].apply(this[method], arguments);
							}
						}
					};

					//文件选择控件选择
					var fileInput = this._getInputBtn();
					if (fileInput.length>0) {
						fileInput.change(function(e) {
							// 为IE下获取当前选择的本地图片src做准备，具体展示在_renderFile中
							if(window.navigator.userAgent.toLowerCase().indexOf("msie") >= 1) {
								var fileInputElement = e.target;
								fileInputElement.select();
								fileInputElement.blur();
								originImageSrc = document.selection.createRange().text;
								document.selection.empty();
							}

							uploadManager._getFiles(e);
							// 如果是单个文件上传，那么要隐藏上传按钮
							var fileCount = _this.find('.uploadify-queue .uploadify-queue-item').length; // 注意这个一行，如果选择的文件有问题，弹出提示信息，如果没有这一行的话，上传按钮就会消失
							if(option.isSingle && fileCount > 0) {
								_this.find('.uploadify-button').hide();
							}
						});
					}

					//点击选择文件按钮时触发file的click事件
					_this.find('.uploadify-button').on('click',function(){
						_this.find('.selectbtn').trigger('click');
					});

					option.onInit && option.onInit(returnObj);
				},
				_filter: function(files) {		//选择文件组的过滤方法
					var arr = [];
					var typeArray = F.getFileTypes(option.fileTypeExts);
					if(typeArray.length>0){
						for(var i=0,len=files.length;i<len;i++){
							var f = files[i];
							if(parseInt(F.formatFileSize(f.size,true))<=option.fileSizeLimit){
								if($.inArray('*',typeArray)>=0 || $.inArray(f.name.split('.').pop(),typeArray)>=0){
									arr.push(f);
								}
								else{
									alert('文件 "'+f.name+'" 类型不允许！');
								}
							}
							else{
								alert('文件 "'+f.name+'" 大小超出限制！');
								continue;
							}
						}
					}
					return arr;
				},
				_getInputBtn : function(){
					return _this.find('.selectbtn');
				},
				_getFileList : function(){
					return _this.find('.uploadify-queue');
				},
				//根据选择的文件，渲染DOM节点
				_renderFile : function(file){
					var $html = $(option.itemTemplate.replace(/\${fileID}/g,'fileupload_'+instanceNumber+'_'+file.index).replace(/\${fileName}/g,file.name).replace(/\${fileSize}/g,F.formatFileSize(file.size)).replace(/\${instanceID}/g,_this.attr('id')));

					// 预览本地图片
					if(option.showPreview > 0) {
						// chrome
						if(window.navigator.userAgent.toLowerCase().indexOf("chrome") >= 1) {
							originImageSrc = window.URL.createObjectURL(file);
						}
						// firefox
						else if(window.navigator.userAgent.toLowerCase().indexOf("firefox") >= 1) {
							originImageSrc = window.URL.createObjectURL(file);
						}

						if(originImageSrc)
							$html.addClass('uploading').css('background-image','url(' + originImageSrc + ')');
					}


					//如果是非自动上传，显示上传按钮
					if(!option.auto){
						$html.find('.uploadbtn').css('display','inline-block');
					}
					else {
						$html.find('.uploadbtn').remove();
					}

					// 是否显示上传提示itemTitle
					if(option.itemTitle != false) {
						var title = '<span class="itemtitle">' + option.itemTitle + '</span>';
						$html.prepend(title);

					}

					//判断是否显示已上传文件大小
					if(option.showUploadedSize){
						var num = '<span class="progressnum"><span class="uploadedsize">0KB</span>/<span class="totalsize">${fileSize}</span></span>'.replace(/\${fileSize}/g,F.formatFileSize(file.size));
						$html.find('.uploadify-progress').after(num);
					}

					// 是否在上传时隐藏文件名
					if(!option.showUploadedFilename) {
						$html.find('.up_filename').remove();
					}

					//判断是否显示上传百分比
					if(option.showUploadedPercent){
						var percentText = '<span class="up_percent">0%</span>';
						$html.find('.uploadify-progress').after(percentText);
					}

					// 添加DOM
					uploadManager._getFileList().append($html);

					//触发select动作
					option.onSelect && option.onSelect(file);

					//判断是否是自动上传
					if(option.auto){
						uploadManager._uploadFile(file);
					}
					else{
						//如果配置非自动上传，绑定上传事件
						$html.find('.uploadbtn').on('click',function(){
							if(!$(this).hasClass('.disabledbtn')){
								$(this).addClass('.disabledbtn');
								uploadManager._uploadFile(file);
							}
						});
					}

					//为删除文件按钮绑定删除文件事件
					$html.find('.delfilebtn').on('click',function(){
						if(!$(this).hasClass('.disabledbtn')){
							$(this).addClass('.disabledbtn');
							uploadManager._deleteFile(file);
						}
					});
				},
				//获取选择后的文件
				_getFiles : function(e){
					var files = e.target.files;
					files = uploadManager._filter(files);
					var fileCount = _this.find('.uploadify-queue .uploadify-queue-item').length;//队列中已经有的文件个数
					for(var i=0,len=files.length;i<len;i++){
						files[i].index = ++fileCount;
						files[i].status = 0;//标记为未开始上传
						uploadManager.filteredFiles.push(files[i]);
						var l = uploadManager.filteredFiles.length;
						uploadManager._renderFile(uploadManager.filteredFiles[l-1]);
					}
				},
				//删除文件
				_deleteFile : function(file){
					for (var i = 0,len=uploadManager.filteredFiles.length; i<len; i++) {
						var f = uploadManager.filteredFiles[i];
						if (f.index == file.index) {
							uploadManager.filteredFiles.splice(i,1);
							_this.find('#fileupload_'+instanceNumber+'_'+file.index).fadeOut(function(){
								if(option.isSingle) {
									_this.find('.uploadify-button').show();
								}
								$(this).remove();
							});
							option.onCancel && option.onCancel(file);
							break;
						}
					}
				},
				//校正上传完成后的进度条误差
				_regulateView : function(file){
					var thisfile = _this.find('#fileupload_'+instanceNumber+'_'+file.index);
					thisfile.find('.uploadify-progress-bar').css('width','100%');
					option.showUploadedSize && thisfile.find('.uploadedsize').text(thisfile.find('.totalsize').text());
					option.showUploadedPercent && thisfile.find('.up_percent').text('100%');
				},
				onProgress : function(file, loaded, total) {
					var eleProgress = _this.find('#fileupload_'+instanceNumber+'_'+file.index+' .uploadify-progress');
					var percent = (loaded / total * 100).toFixed(2) +'%';
					if(option.showUploadedSize){
						eleProgress.nextAll('.progressnum .uploadedsize').text(F.formatFileSize(loaded));
						eleProgress.nextAll('.progressnum .totalsize').text(F.formatFileSize(total));
					}
					if(option.showUploadedPercent){
						eleProgress.nextAll('.up_percent').text(percent);
					}
					eleProgress.children('.uploadify-progress-bar').css('width',percent);
				},
				_allFilesUploaded : function(){
					var queueData = {
						uploadsSuccessful : 0,
						uploadsErrored : 0
					};
					for(var i=0,len=uploadManager.filteredFiles.length; i<len; i++){
						var s = uploadManager.filteredFiles[i].status;
						if(s===0 || s===1){
							queueData = false;
							break;
						}
						else if(s===2){
							queueData.uploadsSuccessful++;
						}
						else if(s===3){
							queueData.uploadsErrored++;
						}
					}
					return queueData;
				},
				//上传文件
				_uploadFile : function(file){
					var xhr = null;
					try{
						xhr=new XMLHttpRequest();
					}catch(e){
						xhr=ActiveXobject("Msxml12.XMLHTTP");
					}
					if(xhr.upload){
						// 上传中
						xhr.upload.onprogress = function(e) {
							uploadManager.onProgress(file, e.loaded, e.total);
						};

						xhr.onreadystatechange = function(e) {
							if(xhr.readyState == 4){
								if(xhr.status == 200){
									uploadManager._regulateView(file);
									file.status = 2;//标记为上传成功
									option.onUploadSuccess && option.onUploadSuccess(file, xhr.responseText);
									//在指定的间隔时间后删掉进度条
									_this.find('#fileupload_'+instanceNumber+'_'+file.index).find('.uploadify-progress').fadeOut(option.removeTimeout,function(){
										$(this).remove();
										//console.log(file);
									});

									// 上传成功后，把上传结果图片显示在区域内
									_this.find('#fileupload_'+instanceNumber+'_'+file.index).removeClass('uploading').addClass('uploaded');
									if(option.showPreview > 1) {
										var data = JSON.parse(xhr.responseText); // 解析为json，注意responseText是文本
										if(data.url != undefined) {
											_this.find('#fileupload_'+instanceNumber+'_'+file.index).css({'background-image' : 'url(' + data.url + ')'});
										}
									}
								}
								else {
									file.status = 3;//标记为上传失败
									option.onUploadError && option.onUploadError(file, xhr.responseText);
								}
								option.onUploadComplete && option.onUploadComplete(file,xhr.responseText);

								//检测队列中的文件是否全部上传完成，执行onQueueComplete
								if(option.onQueueComplete){
									var queueData = uploadManager._allFilesUploaded();
									queueData && option.onQueueComplete(queueData);
								}

								//清除文件选择框中的已有值
								uploadManager._getInputBtn().val('');
							}
						};

						if(file.status===0){
							file.status = 1;//标记为正在上传
							option.onUploadStart && option.onUploadStart(file);
							// 开始上传
							xhr.open(option.method, option.uploader, true);
							xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
							var fd = new FormData();
							fd.append(option.fileObjName,file);
							if(option.formData){
								for(key in option.formData){
									fd.append(key,option.formData[key]);
								}
							}
							xhr.send(fd);
						}

					}
				}
			};

			uploadManager.init();
		});

		return returnObj;
	}
});