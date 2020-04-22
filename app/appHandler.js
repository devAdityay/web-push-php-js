/*
*  Push Notifications Handler
*/

// PublicKey: VAPID
const applicationServerPublicKey = serverPvtKey;

// Push enable/disable button
const pushButton                = document.querySelector('#push-subscription-btn');
const subscriptionDetails       = document.querySelector('.js-subscription-details');
const notificationContainer     = document.querySelector('#notificationsContainer');

let isSubscribed    = false;
let swRegistration  = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
    }

    if (isSubscribed) {
        pushButton.textContent = 'Disable Push Messaging';
    } else {
        pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
}

function updateSubscriptionOnServer(subscription,method) {
    if(!subscription) {
        return ;
    }
    const key                   = subscription.getKey('p256dh');
    const token                 = subscription.getKey('auth');
    const endpoint              = subscription.endpoint;
    const contentEncoding       = (PushManager.supportedContentEncodings || ['aesgcm'])[0];
    const subscriptionJson      = document.querySelector('.js-subscription-json');

    return fetch('serverHandler.php', {
        method: (method) ? method : "POST",
        body: JSON.stringify({
            endpoint: subscription.endpoint,
            publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
            authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
            contentEncoding,
        }),
    }).then(() => subscription);
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (subscription) {
            updateSubscriptionOnServer(subscription, 'POST');

            subscriptionDetails.classList.remove('is-invisible');
            console.log('User is subscribed');
            isSubscribed = true;

            updateBtn();
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            updateSubscriptionOnServer(subscription, 'DELETE');
            return subscription.unsubscribe();
        })
        .catch(function (error) {
            console.log('Error unsubscribing', error);
        })
        .then(function () {
            subscriptionDetails.classList.add('is-invisible');

            console.log('User is unsubscribed.');
            isSubscribed = false;

            updateBtn();
        });
}

function showNotifications(notifications) {

    if(notificationContainer.classList.contains('is-invisible')){
        var notificationBody = document.getElementById('notifications-body');
        notificationBody.innerHTML = '';

        notifications.reverse();

        notifications.forEach(function (notification) {
            var row = document.createElement('tr');
            var notificationCell = document.createElement("td");
            var msgText = document.createTextNode(notification.msgTxt);

            var dateTimeCell = document.createElement("td");
            var dateTime = document.createTextNode(notification.datetime);

            dateTimeCell.setAttribute('align', 'right');

            notificationCell.appendChild(msgText);
            dateTimeCell.appendChild(dateTime);

            row.appendChild(notificationCell);
            row.appendChild(dateTimeCell);

            notificationBody.appendChild(row);
        });

        notificationContainer.classList.remove('is-invisible');
    }else{
        notificationContainer.classList.add('is-invisible');
    }
}

function initializeUI() {
    pushButton.addEventListener('click', function () {
        pushButton.disabled = true;
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            updateSubscriptionOnServer(subscription);

            if (isSubscribed) {
                subscriptionDetails.classList.remove('is-invisible');
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            updateBtn();
        });

}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('sw.js')
        .then(function (swReg) {
            // For Debugging purpose
            // console.log('Service Worker is registered', swReg);

            swRegistration = swReg;
            initializeUI();
        })
        .catch(function (error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
    pushButton.disabled = true;
}
