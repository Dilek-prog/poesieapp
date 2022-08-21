let enableNotificationsButtons = document.querySelectorAll('.enable-notifications'); //Variable, die auf ein Array aller Button mit der CSS klasse .. zeigt

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('service worker registriert')
        })
        .catch(
            err => { console.log(err); }
        );
}

function askForNotificationPermission() { //Klickereignis, wenn der Browser die API unterstützt, wird sie verwendet 
    Notification.requestPermission( result => {
        console.log('User choice', result);
        if(result !== 'granted') {
            console.log('No notification permission granted');
        } else {
            // displayConfirmNotification();
            configurePushSubscription();
        }
    });
}

if('Notification' in window && 'serviceWorker' in navigator) { //prüft, ob der Browser Notification API unterstützt
    for(let button of enableNotificationsButtons) {
        button.style.display = 'inline-block';
        button.addEventListener('click', askForNotificationPermission);
    }
}