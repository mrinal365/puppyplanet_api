//Import libraries below
const express = require('express');
const mongoose = require('mongoose');  // use for database 
const helmet = require('helmet');       // use to secure headers in http request
const morgan = require('morgan');       // use to log information
const dotenv = require('dotenv');


//Importing Routes below
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
//creating express application with name 'app'
const app = express();

//use dotenv
dotenv.config();

//connect to database
mongoose.connect(
    process.env.MONGO_URL,
    () => {
        console.log("database connected ")
    }
);


//Middlewares below
app.use(express.json()); //this is a body parsor which parse any request data to json
app.use(helmet());
app.use(morgan("common"))

app.use('/api/users', userRoute) //whenever /api/users will be called then userRo utes will be called
app.use('/api/auth', authRoute) //whenever /api/users will be called then userRoutes will be called
app.use('/api/posts', postRoute)
app.listen(8800, () => {
    console.log("Backend Server is running!")
})