<?php
$client_id = "5e440211b7f85";
$client_secret = "b6098fc5756b33fbbcaf1b0b";
$redirect_uri = "https://my.eko.team/oauth2/callback.php";
$refresh_token = "dafbc4ace34dc719e9f435d08d5b34e91dd192f5";
$keyyo_token_endpoint = "https://api.keyyo.com/oauth2/token.php";

// Send a cURL request using request"s authorization code
$curl = curl_init($keyyo_token_endpoint);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, array(
    "client_id"     => $client_id,
    "client_secret" => $client_secret,
    "grant_type"    => "refresh_token", 
    "refresh_token" => $refresh_token,
    "redirect_uri"  => $redirect_uri
));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

$auth_data = curl_exec($curl);

// Retrieve the access token
if ($auth_data === false)
    die("cURL request failed");

$response = json_decode($auth_data);
if (is_null($response))
    die("Could not parse cURL response body.");

if (isset($response->error))
    die(isset($response->error_description) ? $response->error_description : $response->error);
header("Content-Type: application/json");
die(json_encode(['token'=>$response->access_token]));