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
function displayConfirmNotification() { // Erlauben von Nachricht 
    if('serviceWorker' in navigator) {
        let options = {
            body: 'You successfully subscribed to our Notification service!',
            icon: '/src/images/icons/fiw96x96.png',
            image: '/src/images/htw-sm.jpg',
            lang: 'de-DE',
            vibrate: [100, 50, 200],
            badge: '/src/images/icons/fiw96x96.png',
            tag: 'confirm-notification',
            renotify: true,
            actions: [
                { action: 'confirm', title: 'Ok', icon: '/src/images/icons/fiw96x96.png' },
                { action: 'cancel', title: 'Cancel', icon: '/src/images/icons/fiw96x96.png' },
            ]
        };

        navigator.serviceWorker.ready
            .then( sw => {
                sw.showNotification('Successfully subscribed (from SW)!', options);
            });
    }
}

function configurePushSubscription() {
    if(!('serviceWorker' in navigator)) {
        return
    }

    navigator.serviceWorker.ready
        .then( sw => {
            return sw.pushManager.getSubscription();
        })
        .then( sub => {
            if(sub === null) {
                // create a new subscription
            } else {
                // already subscribed
            }
        });
}

function askForNotificationPermission() { //Klickereignis, wenn der Browser die API unterstützt, wird sie verwendet 
    Notification.requestPermission( result => {
        console.log('User choice', result);
        if(result !== 'granted') {
            console.log('No notification permission granted');
        } else {
           // displayConfirmNotification();
           configurePushSubscription(); // erlaubnis von Push nachrichten 
        }
    });
}

if('Notification' in window && 'serviceWorker' in navigator) { //prüft, ob der Browser Notification API unterstützt
    for(let button of enableNotificationsButtons) {
        button.style.display = 'inline-block';
        button.addEventListener('click', askForNotificationPermission);
    }
}