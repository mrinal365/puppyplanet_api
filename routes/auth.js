const router = require('express').Router();
const User= require('../models/User');
const bcrypt = require('bcrypt');

router.get("/",async(req,res)=>{
    res.send("haha")
})
router.post("/register", async(req,res)=>{
    

    try{
        //encryting the password 'or' generating a new hased password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        //creating User 
        const user = await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        //saving user to database
        const newUser= await user.save();

        //Sending response back
        res.status(200).json(newUser)
        // res.send("ok")

    } catch(err){
        console.log("error in register api",err)
    }
    
     
})

router.post("/login",async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(404).json("Inccorect credentials")

        res.status(200).json(user)
    }catch (err){
        console.log(err)
    }
})

module.exports = router;