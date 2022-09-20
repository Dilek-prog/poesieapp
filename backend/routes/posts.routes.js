const webpush = require('web-push');

const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const Subscription = require('../models/subscriptions');
const upload = require('../middleware/upload');
require('dotenv').config()
const mongoose = require('mongoose');

const connect = mongoose.createConnection(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const collectionFiles = connect.collection('posts.files');
const collectionChunks = connect.collection('posts.chunks');

const publicVapidKey = 'BJSKcy_aKU3MwaTgiDwWMawhcudji4-1ei8ujE9o_x29VgB3z6GWjEUh2J6dG6rZ5pegAn1huu1ijyfotOp5o34';
const privateVapidKey = 'jbJQGSqE91Zyw6yj39_7C-ky5-GP5M2ikSjWfFBi12A';
// const pushSubscription ={
//     endpoint: 'https://fcm.googleapis.com/fcm/send/eeCwVo1K8EA:APA91bFvibdFBK6X_ctPkaPzoAc9CzBmJPLQes2Pf80GG1SjcrKAUTMwHoRHS7f_cl_mC5zwKA-skv9NzB16Cqlmxc0jz9OWRtyZW3m3ZBEkqYSyU8-LA6PGRedeuUAJ4wa7lMjLYLWd',
//     expirationTime: null,
//     keys: { 
//       p256dh: 'BHjo1XhvIMzZAQihuQXeg3zmWui-WEUcINrU67bvduqOKwiDmFnSYgBJ2pxY46FIfEyXgHaxJ6vDYiPi7mb4VjI',
//       auth: 'xy1vo68cBeEVkOFZJjfO7w'
//     }
//  }
  
  
  
    

  
  function sendNotification() {
    webpush.setVapidDetails('mailto:DilekOgur2253@gmail.com', publicVapidKey, privateVapidKey);
    const payload = JSON.stringify({
        title: 'Neue Poesie',
        content: 'Auf progressive poesie wurde ein neues Gedicht veröffentlicht.',
        openUrl: '/'
    });

    // alle subscriptions aus der mongodb holen
    Subscription.find().exec().then(allSubscriptions => {
        console.log('allsubscriptions', allSubscriptions);
        // alle subscriptions durchgehen
        for(const subscription of allSubscriptions) {
            
            // pushSubscription mit den Werten aus der MongoDB füllen
            pushSubscription = {
                endpoint : subscription.endpoint,
                expirationTime : null,
                keys : {
                    p256dh: subscription.p256dh,
                    auth: subscription.auth
                }
            }
    
            // notification absenden
            webpush.sendNotification(pushSubscription,payload)
            .catch(err => console.error(err));
            console.log('push notification sent');
        }
    })
    

   // res.status(201).json({ message: 'push notification sent'});
}


function getOnePost(id) {
    return new Promise( async(resolve, reject) => {
        try {
            const post = await Post.findOne({ _id: id });
            console.log('post.image_id', post.image_id);
            let fileName = post.image_id;

            collectionFiles.find({filename: fileName}).toArray( async(err, docs) => {
                console.log('docs', docs)

                collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray( (err, chunks) => {


                    const fileData = [];
                    for(let chunk of chunks)
                    {
                        // console.log('chunk._id', chunk._id)
                        fileData.push(chunk.data.toString('base64'));
                    }

                    let base64file = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                    let getPost = new Post({
                        "title": post.title,
                        "location": post.location, 
                        "image_id": base64file,
                        "text": post.text,
                        "_id": post._id
                    });
                    //console.log('getPost', getPost)
                    resolve(getPost)
                })

            }) // toArray find filename

        } catch {
            reject(new Error("Post does not exist!"));
        }
    })
}

function getAllPosts() {
    return new Promise( async(resolve, reject) => {
        const sendAllPosts = [];
        const allPosts = await Post.find();
        try {
            for(const post of allPosts) {
                // console.log('post', post)
                const onePost = await getOnePost(post._id);
                sendAllPosts.push(onePost);
            }
            console.log('sendAllPosts', sendAllPosts)
            resolve(sendAllPosts)
        } catch {
                reject(new Error("Posts do not exist!"));
    }
    });
}

// GET all posts
router.get('/', async(req, res) => {

    getAllPosts()
    .then( (posts) => {
        res.send(posts);
    })
    .catch( () => {
        res.status(404);
        res.send({
            error: "Post do not exist!"
        });
    })
});

// POST one post
router.post('/', upload.single('file'), async(req, res) => {
    // req.file is the `file` file
    if (req.file === undefined) {
        return res.send({
            "message": "no file selected"
        });
    } else {
        console.log('req.body', req.body);
        const newPost = new Post({
            title: req.body.title,
            location: req.body.location,
            image_id: req.file.filename,
            text: req.body.text
        })
        await newPost.save();
        sendNotification();
        // console.log("Returning new post:", newPost);
        return res.send(newPost);
    }
})

// GET one post via id
router.get('/:id', async(req, res) => {
    console.log("Trying to get post: ", req.params.id);
    getOnePost(req.params.id)
    .then( (post) => {
        // console.log('post', post);
        res.send(post);
    })
    .catch( () => {
        res.status(404);
        res.send({
            error: "Post does not exist!"
        });
    })
});

// PATCH (update) one post
router.patch('/:id', async(req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })

        if (req.body.title) {
            post.title = req.body.title
        }

        if (req.body.location) {
            post.location = req.body.location
        }

        if (req.body.image_id) {
            post.image_id = req.body.image_id
        }
        if (req.body.text) {
            post.text = req.body.text
        }

        await Post.updateOne({ _id: req.params.id }, post);
        res.send(post)
    } catch {
        res.status(404)
        res.send({ error: "Post does not exist!" })
    }
});

// DELETE one post via id
router.delete('/:id', async(req, res) => {
    try {
        console.log("Deleting Post with id: ", req.params.id)
        const post = await Post.findOne({ _id: req.params.id })
        console.log("Found post: ", post);
        let fileName = post.image_id;
        await Post.deleteOne({ _id: req.params.id });
        await collectionFiles.find({filename: fileName}).toArray( async(err, docs) => {
            if(docs[0]) { //  Nur Löschen, wenn das Dokument noch exsistiert 
                await collectionChunks.deleteMany({files_id : docs[0]._id});
            }
        })
        await collectionFiles.deleteOne({filename: fileName});
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Post does not exist!" })
    }
});

module.exports = router;