<?php

require_once 'config.php';

// To get all subscriptions
$sql            = "SELECT * FROM subscriptions LIMIT 500";
$query          = $conn->query($sql);

while ($row = $query->fetch_assoc()){
    $subscriptions[]  = $row;
}


?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manager | Push Notification</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="shortcut icon" type="image/png" href="../assets/favicon.png">

    <style>
        .is-invisible{
            display: none;
        }
    </style>
</head>

<body>

<div class="jumbotron bg-secondary text-light">
    <div class="container">
        <h1 class="display-4">Push Notification Manager</h1>
        <p>Welcome to the push manager, this place enables you to trigger notifications to your subscribed users.</p>
    </div>
</div>

<div class="container subscription-details js-subscription-details">
    <p class="text-danger" id="requiredMsg"></p>
    <div class="form-group">
        <label for="susbcriberName">Subscriber</label>
        <select multiple class="form-control" id="susbcribers">
            <?php foreach ($subscriptions as $subscription) { ?>
                <option value="<?=$subscription['id']?>"><?=$subscription['id'] . ' - ' .$subscription['endpoint']?></option>
            <?php } ?>
        </select>
    </div>
    <div class="form-group">
        <label for="msgTxt">Message</label>
        <textarea class="form-control" id="msgTxt" rows="3"></textarea>
    </div>
    <button type="button" class="btn btn-primary" id="sendPushBtn">Send</button>
</div>

<script src="serverHandler.js"></script>
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</body>
</html>