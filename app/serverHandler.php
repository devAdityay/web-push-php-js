<?php
$subscription = json_decode(file_get_contents('php://input'), true);

require_once 'config.php';

if (!isset($subscription['endpoint'])) {
    echo 'Error: not a subscription';
    return;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $browserName        = 'test';
        $endPoint           = $subscription['endpoint'];
        $publicKey          = $subscription['publicKey'];
        $authToken          = $subscription['authToken'];
        $contentEncoding    = $subscription['contentEncoding'];

        $sql = "INSERT INTO subscriptions (browserName, endpoint, publicKey, authToken, contentEncoding) VALUES ('$browserName', '$endPoint', '$publicKey', '$authToken', '$contentEncoding');";

        break;
    case 'PUT':
        // update the key and token of subscription corresponding to the endpoint
        break;
    case 'DELETE':
        // delete the subscription corresponding to the endpoint
        $browserName        = 'test';
        $endPoint           = $subscription['endpoint'];

        $sql = "DELETE FROM subscriptions WHERE `endpoint` = '$endPoint';";

        break;
    default:
        echo "Error: method not handled";
        return;
}

if ($conn->query($sql) === TRUE) {
    echo "Operation Successful";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
