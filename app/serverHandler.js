const sendPushBtn       = document.querySelector('#sendPushBtn');
const requiredContainer = document.querySelector('#requiredMsg')

sendPushBtn.addEventListener('click', function () {
    var susbcribers = [];

    let susbcribersSelectBox    = document.getElementById("susbcribers"),
        msgBody                 = document.getElementById('msgTxt').value;

    for (var i = 0; i < susbcribersSelectBox.length; i++) {
        if (susbcribersSelectBox.options[i].selected) susbcribers.push(susbcribersSelectBox.options[i].value);
    }

    if(susbcribers.length == 0 || msgBody == '' || msgBody == undefined){
        requiredContainer.innerText = 'All fields are mandatory';
        return false;
    } else {
        requiredContainer.innerText = '';
    }

    return fetch('send.php', {
        method: "POST",
        body: JSON.stringify({
            susbcribers: susbcribers,
            msgBody: msgBody
        }),
    }).then(() => sendPushBtn.disabled = false);
});