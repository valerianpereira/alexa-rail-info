<?php
header('Content-Type: application/json;charset=utf-8');

if (in_array($_GET['action'], ['cancel', 'reschedule', 'pnrinfo'] )) {
    
    $apiKey = 'dxnm3ed1iz'; //'atemilchrt';
    
    if ($_GET['action'] === 'cancel') {
        echo fnCurl('https://api.railwayapi.com/v2/cancelled/date/'.date('d-m-Y').'/apikey/'.$apiKey.'/', '', 'GET');
    } else if ($_GET['action'] === 'reschedule') {
        echo fnCurl('https://api.railwayapi.com/v2/rescheduled/date/'.date('d-m-Y').'/apikey/'.$apiKey.'/', '', 'GET');
    } else if ($_GET['action'] === 'pnrinfo') {
        echo fnCurl('https://api.railwayapi.com/v2/pnr-status/pnr/'.$_GET['pnrno'].'/apikey/'.$apiKey.'/', '', 'GET');
    }
    
} else {
    echo '{"error": "Not authorised"}';
}

function fnCurl($url, $params, $method = "POST", $optionalParams = array()) {

      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_HEADER, false);

      if(!empty($optionalParams['authorization'])) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("authorization:". $optionalParams['authorization']));
      }

      if(!empty($optionalParams['userPwd'])) {
        curl_setopt($ch, CURLOPT_USERPWD, $optionalParams['userPwd']);
      }

      if(!empty($optionalParams['Content-Type'])) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type:". $optionalParams['Content-Type']));
      }

      if(strtoupper($method) == "GET") {
          curl_setopt($ch, CURLOPT_HTTPGET, 1);

      }

      elseif(strtoupper($method) == "POST") {
          curl_setopt($ch, CURLOPT_POST, 1);
          curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
      }

      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

      $result = curl_exec($ch);

      curl_close($ch);

      if($result) {
          return $result;
      }
      else {
          return "";
      }
    }