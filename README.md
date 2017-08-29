# HHuploadify

HHuploadify is a plugin to help developer to build a image uploader quickly.
It's on the shoulder of Huploadify which is based on uploadify.
But it's different from the other two:

* most useful features for pictures, remove no use features
* without jquery
* auto upload
* preview before/during upload
* easy to extend

![screenshot](https://github.com/tangshuang/HHuploadify/blob/master/screenshot.png?raw=true)

Browsers <=IE8 are not supported. IE9 is partly supported, may have some bugs.

## Install


```
<link rel="stylesheet" href="dist/HHuploadify.css">
<script src="dist/HHuploadify.js"></script>
```

or with es6 module & webpack:

```
import './src/HHuploadify.css'
import HHuploadify from './src/HHuploadify'
```

using npm:

```
npm install --save hhuploadify
```

```
import HHuploadify from 'HHuploadify' // es6
```


then:

```
let uploader = new HHuploadify({
  container: '#upload',
  url: 'http://localhost/uploadImage',
})
```

Files in dist dir is only used for browser `window` global, those in src is only used for es6 module.

## Usage

```
let uploader = new HHuploadify(options)
uploader.reset([ ..files.. ])
```

## Options

defaults:

```
{
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
  showPreview: 1, // whether preview file before/during upload, 0: close; 1: only preview local origin file; 2: preview file on server by result 'url' fields after upload complated
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
```

## Demo on your local machine

NodeJS and NPM should be installed on your system, then:

```
git clone https://github.com/tangshuang/HHuploadify.git
cd HHuploadify

npm install
npm start
```

Browser will be open and you can try it.
You'd better to change network throttling by using browser developer tool.

We use babel & webpack to build the component, if you want to develop on it, please send a pull request.

## Dragable

Through you can implement this feature by yourself, I have write one in the library, you can use it directly.

```
<link rel="stylesheet" href="../dist/HHuploadify.css">
<script src="../vendors/jquery-2.2.0.min.js"></script>
<script src="../vendors/jquery.dragsort-0.5.2.min.js"></script>
<script src="../dist/HHuploadify.dragable.js"></script>
```

You should import `jquery` and `jquery.dragsort` first.
It is the same usage with previous.
You can try in demo too.

## Help

**Q: How could I submit my picture to the database? After I upload the pictures, how can I record the picture to the article or other usage?**

A: it is project level question. If you want to know the record id of your uploaded file, you should return its id in your server side response json, like:

```
[
  {
    id: "xxx",
    url: "xxx"
  }
]
```

After upload done, `onUploadSuccess` will be invoked. So you can do like this:

```
new HHuploadify({
  ...
  onUploadSuccess(file, res) {
    let data = JSON.parse(res)
    let id = data.id

    $(file.element).append('<input name="fileIdOnServer" value="' + id + '"')
  }
})
```

Look, a new `input` is in your HTML DOM, you can put HHuploadify instance in a `form` and then submit this form to your server.

**Q: If I want to show default images when I open a page, how could I implement?**

A: There is a method called `reset` which will reset the items in your list. But it's recommended to use it when there is no item in your list. And a more direct way is to use option.files:

```
let files = [
  {
    path: '...'
  },
  {
    path: '..'
  }
]
new HHuploadify({
  ...
  files,
})
```

Then when the instance created, there will be two default pictures in your list.
You can look up this in demo.

**Q: what should I return from server side?**

A: because IE9 do not support `FromData`, I use iframe instead, which is not support json directly, so you should use `Content-Type: text/plain` in your response header.

Data structure is json(text):

```
{
  url: "xxx"
}
```

You can use your own fields, it is based on yourself.

More questions, submit an issue.
