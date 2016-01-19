function initHHuploadify(selector,uploader,field,isSingle,title) {
    isSingle = typeof isSingle == 'boolean' ? isSingle : false;
    $(selector).HHuploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.gif',
        multi: true,
        buttonText: title == undefined ? '选择图片' : '选择' + title,
        itemTitle: title == undefined ? false : title,
        fileSizeLimit: 99999999,
        uploader: uploader,
        isSingle: isSingle,
        onSelect : function() {
            var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1;
            var $instance = $('#file_upload_' + instanceNumber + '-queue');
            $instance.dragsort("destroy");
        },
        onUploadSuccess:function(file,result){
            var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1;
            result = JSON.parse(result);
            if(result.status == 0) {
                alert(file.name + '没有上传成功。' + result.info);
            }
            else {
                var file_index = file.index,
                    image_id = result.id;
                var $fileInstance = $('#fileupload_' + instanceNumber +  '_' + file_index);
                $fileInstance.append('<input type="hidden" name="' + field + (!isSingle ? '[]' : '') + '" value="' + image_id + '">');
            }
        },
        onQueueComplete:function(){
            if(isSingle)
                return false;

            var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1;
            var $instance = $('#file_upload_' + instanceNumber + '-queue');
            $instance.dragsort({
                dragSelector: "div.uploadify-queue-item",
                dragBetween: true,
                dragEnd: function () {
                    $instance.find('.uploadify-queue-item').removeClass('drag');
                },
                placeHolderTemplate: '<div class="uploadify-queue-item drag"></div>'
            });
        }
    });
}

function initHHuploadifyOne(selector,uploader,field,title) {
    initHHuploadify(selector,uploader,field,true,title);
}

function initHHuploadifyCount(selector,uploader,fields,titles) {
    var html,num,id,field,title;
    for(i = 0;i < fields.length;i ++) {
        num = i + 1;
        id = decodeURIComponent(selector.replace('#','').replace('.','').replace(' ','-')) + num;
        html = '<div id="' + id + '" class="uploadify-container"></div>';
        field = fields[i];
        title = titles[i];
        $(selector).append(html);
        initHHuploadifyOne('#' + id,uploader,field,title);
    }
}

function resetHHuploadify(selector,images,field,title) {
    var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1,
        $instance = $('#file_upload_' + instanceNumber + '-queue');
    var html = '';

    for(i = 0;i < images.length;i ++) {
        var image = images[i];
        html += '<div class="uploadify-queue-item uploaded" style="background-image: url(' + image.url + ')">';
        if(title != undefined)
            html += '<span class="itemtitle">' + title + '</span>';
        html += '<input type="hidden" name="' + field + '[]" value="' + image.id + '">';
        html += '<a href="javascript:void(0);" class="delfilebtn">&times;</a>';
        html += '</div>';
    }

    $instance.append(html);

    if(images.length > 1) {
        $instance.dragsort({
            dragSelector: "div.uploadify-queue-item",
            dragBetween: true,
            dragEnd: function () {
                $instance.find('.uploadify-queue-item').removeClass('drag');
            },
            placeHolderTemplate: '<div class="uploadify-queue-item drag"></div>'
        });
    }
}

function resetHHuploadifyOne(selector,image,field,title) {
    var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1,
        $instance = $('#file_upload_' + instanceNumber + '-queue');
    var html = '';

    html += '<div class="uploadify-queue-item uploaded" style="background-image: url(' + image.url + ')">';
    if(title != undefined)
        html += '<span class="itemtitle">' + title + '</span>';
    html += '<input type="hidden" name="' + field + '" value="' + image.id + '">';
    html += '<a href="javascript:void(0);" class="delfilebtn">&times;</a>';
    html += '</div>';

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

// 点击删除按钮时，要移除整个区块
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
