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

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function configurePushSubscription() {
    if(!('serviceWorker' in navigator)) {
        return
    }

    let swReg;
    navigator.serviceWorker.ready
        .then( sw => {
            swReg = sw;
            return sw.pushManager.getSubscription();
        })
        .then( sub => {
            if(sub === null) {
                let vapidPublicKey = 'BFB76R73jww6Z2GFL-eujsAFbTVRMW7ZN6WPMbTzl943qvIg_p0TdyAvJo9mh0CRmjJRMn3liIyC3kYZGqpXJR0';
                let convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
                return swReg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidPublicKey,
                });
            } else {
                // falls es exsistiert aber neu erstellt werden soll
                sub.unsubscribe()
                .then( () => {
                    console.log('unsubscribed()', sub)
                }) 
            }
        })
        .then( newSub => {
            return fetch('http://localhost:3000/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newSub)
            })
            .then( response => {
                console.log(response);
                if(response.ok) {
                    displayConfirmNotification();
                }
            })
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