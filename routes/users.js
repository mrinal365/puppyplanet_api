const User = require('../models/User');
const bcrypt = require('bcrypt')

const router = require('express').Router();

router.get("/", (req, res) => {
    res.send("Hello its users route")
})

//update user
router.put("/:id", async(req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                console.log("try block entered")
                const salt = await bcrypt.genSalt(10);
                console.log("try block mid")
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err){
                return res.status(500).json(err)
            }
        }
        try{
            const user=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            });
            res.status(200).json("Account has been updated")

        }catch(err){
            return res.send(500).json(err)
        }
    } else {
        return res.status(401).json("You can update only your account")
    }
})



//delete user
router.delete("/:id", async(req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        try{
            const user=await User.deleteOne({_id:req.params.id});
            res.status(200).json("Account has been Deleted")

        }catch(err){
            return res.send(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})
//get a user
router.get("/:id",async(req,res)=>{
    console.log("entered router get one")
    try{
        const user= await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch(err){
        res.status(500).json(err)
    }
})

//follow a user
router.put("/:id/follow",async(req,res)=>{
    
    try{
        if(req.body.userId!==req.params.userId){
            try{
                const user= await User.findById(req.params.id)
                console.log("user",user);
                const currentUser = await User.findById(req.params.id)
                if(!user.followers.includes(req.body.userId)){
                    await user.updateOne({$push:{followers:req.body.userId}})
                    await currentUser.updateOne({$push:{followings: req.body.userId}})
                    res.status(200).json("User has been followed")
                }else{
                    res.status(403).json("You Already Follow this user")
                }

            }catch(err){
                console.log(err)
            }
        } else{
            res.send(403).json("You cannot follow yourself")
        }

    } catch{
        res.status(500).json(err)
    }
})

//unfollow a user
router.put("/:id/unfollow",async(req,res)=>{
    
    try{
        if(req.body.userId!==req.params.userId){
            try{
                const user= await User.findById(req.params.id)
                console.log("user",user);
                const currentUser = await User.findById(req.params.id)
                if(user.followers.includes(req.body.userId)){
                    await user.updateOne({$pull:{followers:req.body.userId}})
                    await currentUser.updateOne({$pull:{followings: req.body.userId}})
                    res.status(200).json("User has been unfollowed")
                }else{
                    res.status(403).json("You Dont Follow this user")
                }

            }catch(err){
                console.log(err)
            }
        } else{
            res.send(403).json("You cannot unfollow yourself")
        }

    } catch{
        res.status(500).json(err)
    }
})



module.exports = router;