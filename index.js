//Import libraries below
const express = require('express');
const mongoose = require('mongoose');  // use for database 
const helmet = require('helmet');       // use to secure headers in http request
const morgan = require('morgan');       // use to log information
const dotenv = require('dotenv');


//Importing Routes below
const userRoutes = require('./routes/users')

//creating express application with name 'app'
const app = express();

//use dotenv
dotenv.config();

//connect to database
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("database connected ")
});


//Middlewares below
app.use(express.json()); //this is a body parsor which parse data to json
app.use(helmet());
app.use(morgan("common"))

app.use('/api/users',userRoutes) //whenever /api/users will be called then userROutes will be called

app.listen(8800,()=>{
    console.log("Backend Server is running!")
})