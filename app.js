var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const db = require('./config/db'); 
const dotenv=require('dotenv');

// Load Config File
dotenv.config({path:'./config/config.env'});


// Connect To Database
const dbConnection = db.connectToDatabase();

// Express App
var app = express();

// Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Load Routes
const productRouter=require('./routes/products');


// Use Routes
app.use('/products', productRouter);



// Error Handler
app.use(errorHandler);



module.exports = app;
