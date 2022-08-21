const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BIHPm_b7Qmw9VDjMGRuVW_x7NsjTqHc-opM8MgOtW8EVTY0YseYPoc8BMzm6i1JsbtVXz65fmwgdB6a4ZOxqUKs';
const privateVapidKey = 'VzwW_3sD29mlbTG6bKMcJeEPCKj0v9Ge1l48ZrDw7c0';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:DilekOgur2253@gmail.com', publicVapidKey, privateVapidKey);
});

module.exports = router;