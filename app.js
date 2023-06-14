const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require('path');
const exp = require("constants");
const session = require('express-session');

dotenv.config({path: './.env'});

const app = express();

const publicDirectory = path.join(__dirname , './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(
    session({
        name: 'Session_ID',
        secret: 'my_secret',
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000,
        }
    })
);

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

db.connect((err) =>{
    if(err){
        console.log(err)
    } else {
        console.log("My SQL connected")
    }
});

app.set('view engine' , 'hbs');

app.use('/' , require('./routes/pages'));

app.use('/auth' , require('./routes/auth'));

app.use('/booking' , require('./routes/booking'));

app.listen(8080 , () => {
    console.log("App started on port 8080")
});

module.exports = db;