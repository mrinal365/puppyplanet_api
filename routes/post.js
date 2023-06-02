const router = require('express').Router();
const { restart } = require('nodemon');
const Post = require('../models/Post');
const User = require('../models/User');

// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    // console.log("inside it")
    try {
        const savedPost = await newPost.save();
        // console.log("inside it 2")
        res.status(200).json(savedPost)
    } catch (err) {
        // console.log("error",err)
        res.status(500).json(err)
    }
})

// update a post 
router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log("post id is: ",req.params.id)
        console.log("user id: ",req.body.userId)
        console.log("post User Id: ",post.userId)
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

// Delete a post 
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log("post id is: ",req.params.id)
        console.log("user id: ",req.body.userId)
        console.log("post User Id: ",post.userId)
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("the post has been Deleted")
        } else {
            res.status(403).json("you can Delete only your post")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// like a post/Dislike
router.put('/:id/like',async (req,res)=>{
    try{
        //Fetch the post
        const post = await Post.findById(req.params.id);
        console.log("post",post)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes: req.body.userId}});
            res.status(200).json("The Post Has been liked");
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("The post has been disliked");
        }
    }
    catch(err){
        res.status(500).json(err);
    }
});


// get a post
router.get("/:id",async (req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json(err)
    }
})

// get timeline photos
router.get('/timeline',async(req,res)=>{
    const postArray = [];
    try{
        
        const currentUser= await User.findById(req.body.userid);
        const userPosts= await Post.find({userid: currentUser._id});
        const friendsPosts= await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({
                    userId: friendId
                })
            })
        );
        res.join(userPosts.concat(...friendsPosts));
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router