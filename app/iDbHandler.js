const dbName                = 'push-notifications';
const dbVersion             = 1;
const notificationStore     = 'notifications';


function getAllNotifications () {
    var engine = indexedDB.open(dbName, dbVersion);

    engine.onsuccess = function (event) {
        var db = event.target.result;

        var transaction     = db.transaction([notificationStore]);
        var store           = transaction.objectStore(notificationStore);

        store.getAll().onsuccess = function (notifications) {
            showNotifications(notifications.target.result);
        };
    };

    engine.onerror = function (error) {
        error('[IndexedDB] An error occured ', error);
    };
};