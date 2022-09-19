let enableNotificationsButtons = document.querySelectorAll('.enable-notifications'); //Variable, die auf ein Array aller Button mit der CSS klasse enable-notifications zeigt

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

    if('serviceWorker' in navigator) { // Push-Nachrichten durch Service Worker 
        let options = {
            body: 'You successfully subscribed to our Notification service!', // Wie die Benachrichtigug aussieht und ihre Inhalte 
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
            .then( sw => { //SW heißt das die Nachricht vom Service Worker kommt
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

function configurePushSubscription() { // registrieren von Push-Nachrichten 
    if(!('serviceWorker' in navigator)) {
        return
    }

    let swReg; // Erzeugen einer Subscription 
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

function askForNotificationPermission() { //Klickereignis, wenn der Browser die API unterstützt, wird sie verwendet. 
    Notification.requestPermission( result => { // Mit requestPermission() wird die Nutzerin gefragt, ob sie die Nachrichten zulassen möchte. 
        console.log('User choice', result);
        if(result !== 'granted') { 
            console.log('No notification permission granted'); // Werden Benachrichtugung nicht erlaubt, können wir nichts weiter tun. Die Nutzerin wird dann auch nicht erneut gefragt
        } else {
           // displayConfirmNotification();
           configurePushSubscription(); // erlaubnis von Nutzerin für die  Pushnachrichten 
        }
    });
}

if('Notification' in window && 'serviceWorker' in navigator) { //prüft, ob der Browser Notification API unterstützt. Wenn ja, dann schalten wir alle Buttons aus dem enableNotificationsButtons-Array wieder auf sichtbar und melden diesen Button an ein Click Ereignis an.
    for(let button of enableNotificationsButtons) {
        button.style.display = 'inline-block';
        button.addEventListener('click', askForNotificationPermission);
    }
}