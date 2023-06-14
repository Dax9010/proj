const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.register = (req,res) => {
    console.log(req.body);    
    const {name , email , password , rpassword } = req.body;
    db.query('SELECT email FROM users WHERE email = ?' , [email] , async (error , results) => {
        if(error){
            console.log(error)
        }        
                
        if(results.length > 0){
            return res.end('Account with this Email ID already exists')
        }

        if(password != rpassword){
            res.end('Passwords dont match')
        }        

        console.log(results)
        const numSaltRounds = 8
        const hashedPassword = await bcrypt.hash(password , numSaltRounds);

        db.query("Insert into users (name , email , password) values (?,?,?)" , [name , email , hashedPassword] , (err , results) => {
            if(err){
                console.log(err)
            } else {
                res.end("Account Created")
            }
        })
    });
};

exports.login = (req,res) => {
    console.log(req.body)
    const {email , pwd} = req.body;
    db.query('Select * from users where email = ?' , [email] , async (err ,results) => {
        if(err){
            console.log(err)
        } else {
            if(results.length > 0 && bcrypt.compare(pwd,results[0].password)){
                req.session.loggedin = true;
                req.session.username = email;
                return res.render('userpanel')
            } else {
                return res.end('No such user');
            }
        }
    })
};

exports.logout = (req,res) => {
    if(req.session.username){
        delete req.session.username
        res.render('index')
    } else {
        res.render('index')
    }
}

exports.adminlogin = (req,res) => {
    console.log(req.body);
    const {uid , pwd} = req.body;
    db.query('Select * from admin where username = ?' , [uid] , async(error , results) => {
        console.log(results)
        if(results.length == 1){
            if(results[0].password == pwd){
                console.log("Login")
                req.session.loggedin = true
                req.session.username = uid
                return res.render('adminpanel');
            } else {
                res.end('Incorrect Password')
            }
        } else {
            res.end('No such user')
        }
    })
}

exports.adminlogout = (req,res) => {
    if(req.session.username){
        delete req.session.username
        res.render('index');
    } else {
        res.render('index')
    }
}

exports.addflights = (req,res) => {
    const {from , to , flightName , date , time , dist } = req.body;    

    db.query("Insert into flightdetails (FromAirport , ToAirport , FlightName , Date , Time , Distance) values (?,?,?,?,?,?)" , [from , to , flightName , date , time , dist] , (err , results) => {
        if(err){
            console.log(err)
        }
        res.end("Flight Added");
    })
}