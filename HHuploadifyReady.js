/**
 * HHuploadify ready functions and actions, you may not need this if you can write your own script to operate the uploadify area
 * written on omd 1.1 https://github.com/tangshuang/omd
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
    }
}(['jquery','dragsort'],function(){
    function initHHuploadify(selector,uploader,field,title,isSingle) {
        isSingle = typeof isSingle == 'boolean' ? isSingle : false;
        $(selector).HHuploadify({
            auto: true,
            fileTypeExts: '*.jpg;*.png;*.jpeg;*.gif;*.JPG;*.PNG;*.GIF;*.JPEG',
            multi: true,
            buttonText: title ? '选择' + title : '选择图片',
            itemTitle: title || false,
            fileSizeLimit: 99999999,
            uploader: uploader,
            single: isSingle,
            showPreview: 2,
            onSelect : function() {
                var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1;
                var $instance = $('#file_upload_' + instanceNumber + '-queue');
                $instance.dragsort("destroy");
            },
            onUploadSuccess:function(file,result){
                var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1;
                if(result != '') {
                    result = JSON.parse(result);
                    if(result.status == 0) {
                        alert(file.name + '上传失败。' + result.info);
                    }
                    else {
                        var file_index = file.index,
                            image_id = result.id;
                        var $fileInstance = $('#fileupload_' + instanceNumber +  '_' + file_index);
                        $fileInstance.append('<input type="hidden" name="' + field + (!isSingle ? '[]' : '') + '" value="' + image_id + '">');
                    }
                }
                else {
                    $('#fileupload_'+instanceNumber+'_'+file.index).css('background','#0099FF');
                    alert(file.name + '上传失败。网络错误。');
                }
            },
            onQueueComplete:function(){
                if(isSingle)
                    return false;

                var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1;
                var $instance = $('#file_upload_' + instanceNumber + '-queue');
                $instance.dragsort({
                    dragSelector: "span.uploadify-queue-item",
                    dragBetween: true,
                    dragEnd: function () {
                        $instance.find('.uploadify-queue-item').removeClass('drag');
                    },
                    placeHolderTemplate: '<span class="uploadify-queue-item drag"></span>'
                });
            }
        });
    }

    function initHHuploadifyOne(selector,uploader,field,title) {
        initHHuploadify(selector,uploader,field,title,true);
    }

    function initHHuploadifyCount(selector,uploader,fields,titles) {
        var html,num,id,field,title;
        for(i = 0;i < fields.length;i ++) {
            num = i + 1;
            id = decodeURIComponent(selector.replace('#','').replace('.','').replace(' ','-')) + num;
            html = '<span id="' + id + '" class="uploadify-container"></span>';
            field = fields[i];
            title = titles[i];
            $(selector).append(html);
            initHHuploadifyOne('#' + id,uploader,field,title);
        }
    }

    function resetHHuploadify(selector,images,field,title) {
        if(images.length <= 0)
            return;

        var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1,
            $instance = $('#file_upload_' + instanceNumber + '-queue');
        var html = '';

        for(i = 0;i < images.length;i ++) {
            var image = images[i];
            html += '<span class="uploadify-queue-item uploaded" style="background-image: url(' + image.url + ')">';
            if(title)
                html += '<span class="itemtitle">' + title + '</span>';
            html += '<input type="hidden" name="' + field + '[]" value="' + image.id + '">';
            html += '<a href="javascript:void(0);" class="delfilebtn">&times;</a>';
            html += '</span>';
        }

        $instance.append(html);

        if(images.length > 1) {
            $instance.dragsort({
                dragSelector: "span.uploadify-queue-item",
                dragBetween: true,
                dragEnd: function () {
                    $instance.find('.uploadify-queue-item').removeClass('drag');
                },
                placeHolderTemplate: '<span class="uploadify-queue-item drag"></span>'
            });
        }
    }

    function resetHHuploadifyOne(selector,image,field,title) {
        if(!image || image.id == undefined || !image.id || image.id == '' || image.id == '0')
            return;

        var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1,
            $instance = $('#file_upload_' + instanceNumber + '-queue');
        var html = '';

        html += '<span class="uploadify-queue-item uploaded" style="background-image: url(' + image.url + ')">';
        if(title)
            html += '<span class="itemtitle">' + title + '</span>';
        html += '<input type="hidden" name="' + field + '" value="' + image.id + '">';
        html += '<a href="javascript:void(0);" class="delfilebtn">&times;</a>';
        html += '</span>';

        $instance.append(html);

        $(selector).find('.uploadify-button').hide();
    }

    function resetHHuploadifyCount(selector,images,fields,titles) {
        $(selector).find('.uploadify-container').each(function(i){
            var $this = $(this);
            var image = images[i];
            var field = fields[i];
            var title = titles[i];
            resetHHuploadifyOne('#' + $this.attr('id'),image,field,title);
        });
    }

    $.extend({
        HHuploadify : {
            init : initHHuploadify,
            initOne : initHHuploadifyOne,
            initCount : initHHuploadifyCount,
            reset : resetHHuploadify,
            resetOne : resetHHuploadifyOne,
            resetCount : resetHHuploadifyCount
        }
    });

    // delete reset item
    $(document).on('click','.uploadify-queue-item .delfilebtn',function(e){
        e.preventDefault();
        var $this = $(this),
            $box = $this.parent();
        $box.fadeOut(function(){
            if($box.parent().find('.uploadify-queue-item').length <= 1)
                $box.parent().parent().find('.uploadify-button').show();
            $box.remove();
        });
    });
});