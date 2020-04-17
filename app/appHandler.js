/*
*  Push Notifications Handler
*/

// PublicKey: VAPID
const applicationServerPublicKey = 'YOUR_PUBLIC_VAPID_KEY';

// Push enable/disable button
const pushButton            = document.querySelector('#push-subscription-btn');
const subscriptionDetails   = document.querySelector('.js-subscription-details');

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
        })
        .catch(function (error) {
            console.log('Error unsubscribing', error);
        })
        .then(function (subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }

            subscriptionDetails.classList.add('is-invisible');

            console.log('User is unsubscribed.');
            isSubscribed = false;

            updateBtn();
        });
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
