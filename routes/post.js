const router = require('express').Router();
const Post = require('../models/Post');

// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    console.log("inside it")
    try {
        const savedPost = await newPost.save();
        console.log("inside it 2")
        res.status(200).json(savedPost)
    } catch (err) {
        res.status(500).json(err)
    }
})

// update a post 
router.put("/:id", async(req, res) => {
    try {
        const post = Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({$set:req.body});
            res.status(200).json("the post has been updated")
        } else {
            res.status(403).json("you can update only your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
// like a post
// get a post
// get timeline photos

module.exports = router