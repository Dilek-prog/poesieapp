const express = require('express');
const router = express.Router();
const Post = require('./models/posts');

// GET all posts
router.get('/posts', async(req, res) => {
    const allPosts = await Post.find();
    console.log(allPosts);
    res.send(allPosts);
});

// POST one post
router.post('/posts', async(req, res) => {
    const newPost = new Post({
        title: req.body.title,
        location: req.body.location,
        image_id: req.body.image_id,
        text: req.body.text
    })
    await newPost.save();
    res.send(newPost);
});

module.exports = router;