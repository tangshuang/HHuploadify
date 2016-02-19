# HHuploadify

HHuploadify is a plugin to help deverloper to build a image uploader quickly.
It's based on Huploadify which is based on uploadify.
But it's different from the other two :

* written on omd 1.1 https://github.com/tangshuang/omd
* most useful for pictures
* add single picture upload
* item title notice
* add preview
* ready helpers

## Install

Based on jquery, append the scripts to html <head>.

```
<link rel="stylesheet" href="HHuploadify.css">
<script src="jquery.min.js"></script>
<script src="HHuploadify.js"></script>
```

When you want to use ready helpers :

```
<script src="dragsort.min.js"></script>
<script src="HHuploadifyReady.js"></script>
```

`dragsort` is a jquery plugin which help you to drag and sort your pictures.

## Usage

screenshot

![screenshot](https://github.com/tangshuang/HHuploadify/blob/master/src/screenshot.png?raw=true)

1. setup

most simple like :

```
<div id="upload"></div>
<script>
$('#upload').HHuploadify({
    uploader:'upload.php'
});
</script>
```

uploader setting is needed!

2. single

print only one upload item, can only select one picture

```
<div id="upload"></div>
<script>
$('#upload').HHuploadify({
    uploader: 'upload.php',
    isSingle: true
});
</script>
```

upload button hidden when picture is selected

3. item title

show notice words on the side of every item, like the screenshot show

```
<div id="upload"></div>
<script>
$('#upload').HHuploadify({
    uploader: 'upload.php',
    isSingle: true,
    itemTitle: 'Thumbnail'
});
</script>
```

4. several

show several item, ervery item is a single uploader.

```
<div id="upload"></div>
<script>
var selector = '#upload',
    num,
    id
    itemTitles = ['Title1','Title2','Title3'];
for(i = 0;i < itemTitles.length;i ++) {
    num = i + 1;
    id = decodeURIComponent(selector.replace('#','').replace('.','').replace(' ','-')) + num;
    html = '<span id="' + id + '" class="uploadify-container"></span>';
    title = itemTitles[i];
    $(selector).append(html);

    $('#' + id).HHuploadify({
        uploader: 'upload.php',
        isSingle: true,
        itemTitle: title
    });
}
</script>
```

## Helpers

question: How could you submit your picture to the database?
through you have uploaded the pictures, how can you record the picture to the article or other usage?
just use `HHuploadifyReady.js`,

** Notice ** uploader should return json string like `{key:value}`, and should give `status, id, url` fields:

```
{
    status : 1,
    id : 5,
    url : '/uploads/test.jpg'
}
```

`status=1` means success, `status=0` means failed.
when status=1, the item area will append a `<input type="hidden">`, its value will use `id` field, if your `preview` option set to 2, `url` field will be used.

read demo/ready.html

## More

* http://www.tangshuang.net/2002.html
