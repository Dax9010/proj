const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register' , authController.register);

router.post('/login' , authController.login);

router.post('/adminlogin' , authController.adminlogin)

router.get('/adminlogout' , authController.adminlogout)

router.get('/logout' , authController.logout)

router.get("/adminpanel" , (req,res) => {
    res.render('adminpanel');
});

router.post('/addflights' , authController.addflights)

module.exports = router;