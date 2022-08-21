const express = require('express');
const cors = require('cors');
const postsRoutes = require('./routes/posts.routes');
const uploadRoutes = require('./routes/upload.routes');
const downloadRoute = require('./routes/download.routes');
const deleteRoute = require('./routes/delete.routes');
const subscriptionRoute = require('./routes/subscription.routes');

const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use('/posts', postsRoutes);
app.use('/image', uploadRoutes);
app.use('/download', downloadRoute);
app.use('/delete', deleteRoute);
app.use('/subscription', subscriptionRoute);



app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
})

//connect to mongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
.then(
    () => console.log('connected to DB')
).catch(
    err => console.error(err, 'conncetion error')
)

const db = mongoose.connection;