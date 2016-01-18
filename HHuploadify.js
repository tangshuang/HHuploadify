function initHHuploadify(selector,uploader,field,isSingle) {
    var instanceNumber = $(selector).find('.uploadify').index('.uploadify') + 1;
    $(selector).HHuploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.gif',
        multi: true,
        fileSizeLimit: 99999999,
        uploader: uploader,
        isSingle: typeof isSingle == 'boolean' ? isSingle : false,
        onUploadSuccess:function(file,result){
            result = JSON.parse(result);
            if(result.status == 0) {
                alert(file.name + '没有上传成功。' + result.info);
            }
            else {
                var file_index = file.index,
                    image_id = result.id;
                var $fileInstance = $('#fileupload_' + instanceNumber +  '_' + file_index);
                $fileInstance.append('<input type="hidden" name="' + field + '[]" value="' + image_id + '">');
            }
        },
        onQueueComplete:function(){
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

// 点击删除按钮时，要移除整个区块
$(document).on('click','.uploadify-queue-item .delfilebtn',function(e){
    e.preventDefault();
    var $this = $(this),
        $box = $this.parent();
    $box.fadeOut(function(){
        $box.remove();
    });
});
