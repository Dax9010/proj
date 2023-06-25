const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require('path');
const exp = require("constants");
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");


dotenv.config({path: './.env'});

const app = express();

const publicDirectory = path.join(__dirname , './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: {secure: true},
    resave: false, 
    userID: undefined
}));

mongoose.connect('mongodb://localhost:27017/flight-booking').then(() => {
    console.log("Connected")
})

app.set('view engine' , 'hbs');

app.use('/' , require('./routes/pages'));

app.use('/auth' , require('./routes/auth'));

app.listen(8080 , () => {
    console.log("App started on port 8080")
});


