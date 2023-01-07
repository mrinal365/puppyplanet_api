const express = require('express');

//creating express application with name 'app'
const app = express();

app.listen(8800,()=>{
    console.log("Backend Server is running!")
})