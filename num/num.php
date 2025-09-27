<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$valid_keys = ['saiyanekam', 'businesskey', 'testkey', 'vipclient'];

$key = $_GET['key'] ?? '';
$number = $_GET['number'] ?? '';

// Check key
if (!in_array($key, $valid_keys)) {
    echo json_encode(['error' => 'Invalid API key. Use: saiyanekam']);
    exit;
}

// Check number
if (empty($number)) {
    echo json_encode(['error' => 'Add &number=9914348638']);
    exit;
}

// Fetch from original API
$url = "https://osintx.info/API/krobetahack.php?key=P6NW6D1&type=mobile&term=$number";
$response = file_get_contents($url);

if ($response === FALSE) {
    echo json_encode(['error' => 'Failed to fetch data']);
    exit;
}

$data = json_decode($response, true);

// Add custom field
if (isset($data['data'][0])) {
    $data['data'][0]['owner'] = "@Ek4mpreetSingh ⚡";
}

echo json_encode($data);
?>
