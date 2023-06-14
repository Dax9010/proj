const express = require('express');
const viewController = require('../controllers/view')
const router = express.Router();

router.get("/" , (req,res) => {
    res.render('index')
});

router.get("/adminlogin" , (req,res) => {
    res.render('adminlogin')
});

router.get("/login" , (req,res) => {
    res.render('login')
});

router.get("/register" , (req,res) => {
    res.render('register')
});

router.get("/booking"  ,(req , res) => {
    res.render('flightsbooking');
})

router.get("/addflights" , (req ,res) => {
    res.render('addflights')
})

router.get("/viewflights" , viewController.viewflights)

router.get('/editdetails/:id' , viewController.editflights)

router.post('/editdetails/:id' , viewController.updateflight)

router.get('/deleteflight/:id' , viewController.deleteflight)

router.get('/flightbooking' , (req,res) => {
    res.render('flightsbooking')
})

module.exports = router;