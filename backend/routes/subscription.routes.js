const express = require('express');
const webpush = require('web-push');
const Subscription = require('../models/subscriptions');
const router = express.Router();

const publicVapidKey = 'BJSKcy_aKU3MwaTgiDwWMawhcudji4-1ei8ujE9o_x29VgB3z6GWjEUh2J6dG6rZ5pegAn1huu1ijyfotOp5o34';
const privateVapidKey = 'jbJQGSqE91Zyw6yj39_7C-ky5-GP5M2ikSjWfFBi12A';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('new subscription', subscription);

    if(subscription.endpoint && subscription.keys && subscription.keys.p256dh && subscription.keys.auth){
        res.status(201).json({ message: 'subscription received'});
        const newSubscription = new Subscription({
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth
        })

        await newSubscription.save();
        webpush.setVapidDetails('mailto:DilekOgur2253@gmail.com', publicVapidKey, privateVapidKey);
    }
});

module.exports = router;

// Endpunkt für Push Nachricht