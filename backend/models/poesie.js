const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: String,
    datum: Date,
    kategorie: String,
    bild: String,
    text: String,
});

module.exports = mongoose.model('Poesie', schema);