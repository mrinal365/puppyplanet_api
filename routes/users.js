const router = require('express').Router();

router.get("/",(req,res)=>{
     res.send("Hello its users route")
})
module.exports = router;