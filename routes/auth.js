const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register' , authController.register);

router.post('/login' , authController.login);

router.post('/adminlogin' , authController.adminlogin)

router.get('/userpanel' , authController.userpanel)

router.get('/adminlogout' , authController.adminlogout)

router.get('/logout' , authController.logout)

router.get("/adminpanel" , authController.adminpanel)

router.get("/addflights" , authController.addFlights)

router.post('/addflights/add' , authController.addflightsAdd)

router.post('/retrival' , authController.retrival)

router.get('/flightbooking' , authController.booking)

router.get('/deleteflight/:id' , authController.deleteflight)

router.get("/viewflights" , authController.viewflights)

router.get('/flightbook/:id/passengeradd' , authController.passengeradd)

router.post('/flightbook/:id/finalbook' , authController.finalbook)

router.get('/viewbookings' , authController.viewbookings)

router.get('/adminbookings' , authController.adminbookings)

router.post('/payment' , authController.payment)

router.post('/payment/verify' , authController.verifyPayment)

router.get('/adminbookings/flightdetails/:id' , authController.adminFlightDetails)

router.get('/deletepassenger/:id' , authController.deletePassenger)

module.exports = router;