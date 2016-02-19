<?php

$filename = $_FILES['file']['name'];
$filetmp = $_FILES["file"]["tmp_name"];

if($filename) {
    $file = "../uploads/".md5_file_str($filetmp).substr(strrchr($filename,'.'),0);

    if(!file_exists($file)) {
        move_uploaded_file($filetmp,$file);
        chmod($file,0755); // 让图片可以访问
    }

    $php_self = $_SERVER['PHP_SELF'];
    $php_dir = dirname($php_self);
    $url = 'http://'.$_SERVER['HTTP_HOST'].$php_dir.'/'.$file;

    $arr = array(
        'id' => 5,
        'url' => $url
    );
    echo json_encode($arr);
}

function md5_file_str($file) {
    $str = md5_file($file);
    $str = substr($str,8,16);
    return $str;
}