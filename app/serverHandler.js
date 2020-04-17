const sendPushBtn           = document.querySelector('#sendPushBtn');
const requiredContainer     = document.querySelector('#requiredMsg');
const processingAlert       = document.querySelector('#processingAlert');
const successAlert          = document.querySelector('#successAlert');

sendPushBtn.addEventListener('click', function () {
    var susbcribers = [];
    sendPushBtn.disabled    = true;
    processingAlert.classList.remove('is-invisible');

    let susbcribersSelectBox    = document.getElementById("susbcribers"),
        msgBody                 = document.getElementById('msgTxt').value;

    for (var i = 0; i < susbcribersSelectBox.length; i++) {
        if (susbcribersSelectBox.options[i].selected) susbcribers.push(susbcribersSelectBox.options[i].value);
    }

    if(susbcribers.length == 0 || msgBody == '' || msgBody == undefined){
        requiredContainer.innerText = 'All fields are mandatory';
        sendPushBtn.disabled    = false;
        processingAlert.classList.add('is-invisible');

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
    }).then(function(){
        processingAlert.classList.add('is-invisible');
        successAlert.classList.remove('is-invisible');

        setTimeout(function () {
            successAlert.classList.add('is-invisible');
        },3000)

        document.getElementById('msgTxt').value = '';
        sendPushBtn.disabled    = false;
    });

});