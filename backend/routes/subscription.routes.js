const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BFB76R73jww6Z2GFL-eujsAFbTVRMW7ZN6WPMbTzl943qvIg_p0TdyAvJo9mh0CRmjJRMn3liIyC3kYZGqpXJR0';
const privateVapidKey = 'm9GRo47n3HKKzgvZYpr_8TFkvCKC6P1Zg_CKyDe8sgU';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:DilekOgur2253@gmail.com', publicVapidKey, privateVapidKey);
});

module.exports = router;