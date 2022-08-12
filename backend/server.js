const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/', routes);

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
});

//connect to mongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('connected to DB');
});