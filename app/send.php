<?php

require __DIR__ . '/../vendor/autoload.php';
require_once 'config.php';
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

$data               = json_decode(file_get_contents('php://input'), true);
$subscribersIds     = join(",",$data['susbcribers']);

$sql                = "SELECT * FROM subscriptions WHERE id IN ($subscribersIds)";
$query              = $conn->query($sql);

while ($row = $query->fetch_assoc()){
    $subscribers[]  = $row;
}

if(!$subscribers){
    return false;
}

foreach ($subscribers as $subscriber){
    // Notifications array
    $notifications[] = [
            'subscription'  => Subscription::create([
                'endpoint'  => $subscriber['endpoint'],
                'publicKey' => $subscriber['publicKey'],
                'authToken' => $subscriber['authToken'],
            ]),
             'payload' => $data['msgBody'],
        ];
}

$auth = array(
    'VAPID' => array(
        'subject'       => 'adiyayadavvv@gmail.com',
        'publicKey'     => file_get_contents(__DIR__ . '/../keys/public_key.txt'),
        'privateKey'    => file_get_contents(__DIR__ . '/../keys/private_key.txt'),
    ),
);

$webPush = new WebPush($auth);

// send multiple notifications with payload
foreach ($notifications as $notification) {
    $webPush->sendNotification(
        $notification['subscription'],
        $notification['payload'] // optional (defaults null)
    );
}

/**
 * Check sent results
 * @var MessageSentReport $report
 */
foreach ($webPush->flush() as $report) {
    $endpoint = $report->getRequest()->getUri()->__toString();

    if ($report->isSuccess()) {
        echo "[v] Message sent successfully for subscription {$endpoint}.";
    } else {
        echo "[x] Message failed to sent for subscription {$endpoint}: {$report->getReason()}";
    }
}

/**
 * send one notification and flush directly
 * @var \Generator<MessageSentReport> $sent
 */
$sent = $webPush->sendNotification(
    $notifications[0]['subscription'],
    $notifications[0]['payload'], // optional (defaults null)
    true // optional (defaults false)
);