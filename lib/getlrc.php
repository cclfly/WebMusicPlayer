<?php
	header("Content-type: text/html; charset=utf-8");
	include_once('./func.php');
	
	if(!isset($_POST['name']))
	{
		echo json_encode(["flag"=>"false"]);
		exit();
	}
	$filename = iconv("utf-8", "gb18030", 
		isset($_POST['path'])?'../'.$_POST['path'].'/'.$_POST['name'].'.lrc':'../media'.'/'.$_POST['name'].'.lrc');
	$str = auto_read($filename);
	if(!$str)
	{
		echo json_encode(["flag"=>"false"]);
		exit();
	}
	
	preg_match_all('/\[([0-9:\.]*)\]\s*([\x{4e00}-\x{9fa5}A-Za-z0-9\&\|\\\!\+\-\*\.\~\~\`\·_\/\:\：\。\、\，\？\！\“\”\【\】\《\》\t \f]*)/iu', 
		$str, $res);
	
	$lrc = [];
	$lrcTime = [];
	foreach($res[1] as $key => $value)
	{
		$time = 0.0;
		$tmp = explode(':', $value);
		foreach($tmp as $k => $val)
		{
			$time += floatval($val)*pow(60,(count($tmp)-$k-1));
		}
		sprintf($time,"%.2f",$time);
		array_push($lrcTime,$time);
		array_push($lrc,$res[2][$key]);
	}
	
	echo json_encode(["flag"=>true,"time"=>$lrcTime,"lrc"=>$lrc,"count"=>count($lrcTime)]);
?>