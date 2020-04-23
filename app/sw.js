/*
*  Service Worker File
*/
const dbName                = 'push-notifications';
const dbVersion             = 1;
const notificationStore     = 'notifications';

self.addEventListener('push', function(event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        console.log('[Service Worker] Error: No permission');
        return;
    }

    let notificationData = {
        "msgTxt"    : `${event.data.text()}`,
        "datetime"  : getCurrentDateTime()
    };

    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${notificationData.msgTxt}"`);

    // Stores the push time and message in indexedDB
    initDbEngine();
    storePushInIndexedDB(notificationData);

    var bodyTxt = 'Hello!';
    if (notificationData.msgTxt){
        bodyTxt = notificationData.msgTxt;
    }

    const title = 'Push Notification Demo';
    const options = {
        body: `${bodyTxt}`
    };

    event.waitUntil(self.registration.showNotification(title, options));
});


/*
* @uses To store the push notification in indexedDB
*
* return String
* */

function initDbEngine() {
    var request               = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function(){
        return true;
    };

    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore(notificationStore, {keyPath: "id", autoIncrement: true});
    };
}

function storePushInIndexedDB(notificationData){
    var request               = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function (event) {
        var db = event.target.result;

        var transaction = db.transaction([notificationStore], "readwrite");
        var store = transaction.objectStore(notificationStore);
        var request = store.add(notificationData);
        request.onsuccess = function (e) {
            // console.log('Notification inserted: ', e.target.result);
        };
        request.error = function (e) {
            console.log('[IndexedDb] Error Occured');
        };
    };
    request.onerror = function (error) {
        console.log('[IndexedDb] Error ', error);
    };
}

/*
* @uses To get the current date and time
*
* return String
* */

function getCurrentDateTime() {
    let today = new Date();
    let dateTime = today.toLocaleDateString()+' '+today.toLocaleTimeString();

    return dateTime;
}