<?php
header("Content-type: text/html; charset=utf-8");
/*
 * 检测文件编码
 * @param string $file 文件路径
 * @return string|null 返回 编码名 或 null
 */
function detect_encoding($file) {
	$list = array('GBK', 'UTF-8', 'UTF-16LE', 'UTF-16BE', 'ISO-8859-1');
 	$str = file_get_contents($file);
 	foreach ($list as $item) {
    	$tmp = mb_convert_encoding($str, $item, $item);
     	if (md5($tmp) == md5($str)) {
        	return $item;
     	}
	}
	return null;
}

/*
 * 自动解析编码读入文件
 * @param string $file 文件路径
 * @param string $charset 读取编码
 * @return string 返回读取内容
 */
function auto_read($file, $charset='UTF-8') {
    $list = array('GBK', 'UTF-8', 'UTF-16LE', 'UTF-16BE', 'ISO-8859-1');
    $str = file_get_contents($file);
    foreach ($list as $item) {
        $tmp = mb_convert_encoding($str, $item, $item);
        if (md5($tmp) == md5($str)) {
            return mb_convert_encoding($str, $charset, $item);
        }
    }
    return "";
}
?>