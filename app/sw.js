/*
*  Push Notifications
*/

self.addEventListener('push', function(event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        console.log('[Service Worker] Error: No permission');
        return;
    }

    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    var bodyTxt = 'Hello!';
    if (event.data.text()){
        bodyTxt = event.data.text();
    }

    const title = 'Push Notification Demo';
    const options = {
        body: `${bodyTxt}`
    };

    event.waitUntil(self.registration.showNotification(title, options));
});