/**
 * 本文件中提供了几个函数方法，仅在你需要的时候便捷使用，当然你也可以不用使用，自己加载插件来进行处理
 * 你也可以把本页里面的内容作为例子来研究，大概了解下一些特殊的用法
 */
 
function initHHuploadify(selector,uploader,field,isSingle) {
    var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1;
    isSingle = typeof isSingle == 'boolean' ? isSingle : false;
    $(selector).HHuploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.gif',
        multi: true,
        fileSizeLimit: 99999999,
        uploader: uploader,
        isSingle: isSingle,
        onUploadSuccess:function(file,result){
            result = JSON.parse(result);
            if(result.status == 0) {
                alert(file.name + '没有上传成功。' + result.info);
            }
            else {
                var file_index = file.index,
                    image_id = result.id;
                var $fileInstance = $('#fileupload_' + instanceNumber +  '_' + file_index);
                $fileInstance.append('<input type="hidden" name="' + field + (isSingle ? '[]' : '') + '" value="' + image_id + '">');
            }
        },
        onQueueComplete:function(){
            if(isSingle)
                return false;
            try {
                var $instance = $('#file_upload_' + instanceNumber + '-queue');
                $instance.dragsort("destroy");
                $instance.dragsort({
                    dragSelector: "div.uploadify-queue-item",
                    dragBetween: true,
                    dragEnd: function () {
                        $instance.find('.uploadify-queue-item').removeClass('drag');
                    },
                    placeHolderTemplate: '<div class="uploadify-queue-item drag"></div>'
                });
            }
            catch (Exception) {
                console.log(Exception);
            }
        }
    });
}

function initHHuploadifyOne(selector,uploader,field) {
    initHHuploadify(selector,uploader,field,true);
}

function resetHHuploadify(selector,images,field) {
    var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1,
        $instance = $('#file_upload_' + instanceNumber + '-queue');
    var html = '';

    for(i = 0;i < images.length;i ++) {
        var image = images[i];
        html += '<div class="uploadify-queue-item uploaded" style="background-image: url(' + image.url + ')">';
        html += '<input type="hidden" name="' + field + '[]" value="' + image.id + '">';
        html += '<a href="javascript:void(0);" class="delfilebtn">&times;</a>';
        html += '</div>';
    }

    $instance.append(html);

    // 测试是否存在dragsort，如果不存在，则抛出错误，如果存在，则执行，如果你安装了dragsort，建议将try去掉，直接使用内部的代码
    try {
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
    catch (Exception) {
        console.log(Exception);
    }
}

function resetHHuploadifyOne(selector,image,field) {
    var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1,
        $instance = $('#file_upload_' + instanceNumber + '-queue');
    var html = '';

    html += '<div class="uploadify-queue-item uploaded" style="background-image: url(' + image.url + ')">';
    html += '<input type="hidden" name="' + field + '" value="' + image.id + '">';
    html += '<a href="javascript:void(0);" class="delfilebtn">&times;</a>';
    html += '</div>';

    $instance.append(html);

    $(selector).find('.uploadify-button').hide();
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
