const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    endpoint: String,
    p256dh: String,
    auth: String
    
});

module.exports = mongoose.model('Subscription', schema);