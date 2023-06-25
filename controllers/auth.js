const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { mongo, ObjectId, default: mongoose } = require('mongoose');
const { MongoClient, ServerApiVersion } = require("mongodb");
const Handlebars = require('hbs')
const razorpay = require('razorpay')

const instance = new razorpay({
    key_id: process.env.RAZOR_PAY_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET
})

const uri = process.env.URI;

const client = new MongoClient(uri);

var session;



exports.register = async (req, res) => {
    console.log(req.body);
    const { name, email, password, rpassword } = req.body;
    const mydb = client.db("flight-booking").collection("Users");

    const emailResult = await mydb.countDocuments({ email: email })
    const nameResult = await mydb.countDocuments({ username: name })

    if (emailResult > 0 || nameResult > 0) {
        return res.end('Duplicate Email or Username')
    }

    if (password != rpassword) {
        return res.end('Passwords dont match')
    }

    var lowerCaseLetters = /[a-z]/g;
    if (!password.match(lowerCaseLetters)) {
        return res.end("Password should contain LowerCase Characters")
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (!password.match(upperCaseLetters)) {
        return res.end("Password should contains UpperCase Characters")
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if (!password.match(numbers)) {
        return res.end("Password should contain Numbers")
    }

    // Validate length
    if (!password.length >= 8) {
        return res.end("Password length should be greater than 8 characters")
    }

    const numSaltRounds = 8
    const hashedPassword = await bcrypt.hash(password, numSaltRounds);

    const doc = { username: name, password: hashedPassword, email: email };

    const result = await mydb.insertOne(doc);

    return res.end("Registeration Successfull")
};



exports.login = async (req, res) => {
    console.log(req.body)
    const { email, pwd } = req.body;
    const mydb = client.db("flight-booking").collection("Users");

    const result = await mydb.findOne({ email: email });

    if (!result) {
        return res.end('No such user')
    }

    if (bcrypt.compare(pwd, result.password)) {
        session = req.session;
        session.userID = result._id;
        console.log(session.userID);
        return res.render('userpanel')
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    session = req.session;
    res.render('index')
}

exports.adminlogin = async (req, res) => {

    console.log(req.body);
    const { uid, pwd } = req.body;
    const mydb = client.db("flight-booking").collection("Admin");
    const result = await mydb.findOne({ username: uid });
    if (result.password == pwd) {
        session = req.session;
        session.id = uid;
        console.log(session.id)
        return res.render('adminpanel')
    } else {
        return res.end('Incorrect Password')
    }
}

exports.adminlogout = (req, res) => {
    req.session.destroy();
    session = req.session;
    res.render('index')
}

exports.addFlights = async (req, res) => {
    console.log(typeof session)
    if (typeof session == 'undefined') {
        return res.end("Login First");
    }
    return res.render('addflights')
}

exports.addflightsAdd = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login First");
    }
    const { flightno, from, to, flightName, date, time, dist } = req.body;

    const mydb = client.db("flight-booking").collection("Flightdetails");

    var url = ""

    if (flightName == "Qatar Airlines") {
        url = "../images/Qatar-Airways-Logo.png"
    } else if (flightName == "Indigo") {
        url = "../images/IndiGo-Logo.png"
    } else if (flightName == "Air India") {
        url = "../images/Air-India-logo.png";
    } else if (flightName == "Air France") {
        url = "../images/Air-France-Logo.png";
    }

    const doc = { flightNumber: flightno, fromAirport: from, toAirport: to, flightName: flightName, date: date, time: time, dist: dist, avail: 60, url: url }

    const result = mydb.insertOne(doc);

    return res.end("Flight Details Added!");

}

exports.userpanel = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login First");
    }
    return res.render('userpanel')
}

exports.adminbookings = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login First");
    }
    const mydb = client.db('flight-booking').collection('Bookings')
    const result = await mydb.find({}).toArray()
    console.log(result)
    return res.render('adminallbook', { bookings: result })
}

exports.adminFlightDetails = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login First");
    }
    var flight_id = req.params.id;
    const mydb = client.db('flight-booking').collection('Flightdetails')
    const result = await mydb.findOne({ _id: new mongo.ObjectId(flight_id) })
    console.log(result)
    return res.render('adminallbookingsFlight', { flight: result })
}

exports.retrival = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login First");
    }
    console.log(req.body)

    const { FromAirport, ToAirport, Date, Adult } = req.body;

    const mydb = client.db('flight-booking').collection('Flightdetails')

    const results = await mydb.find({ fromAirport: FromAirport, toAirport: ToAirport, date: Date }).toArray();

    session.count = Adult;

    var disp_count = 0

    for (let i = 0; i < results.length; i++) {
        if (results[i].avail >= session.count) {
            disp_count++;
        }
    }

    if (disp_count == 0) {
        return res.end('No flights found')
    }

    Handlebars.registerHelper("each_cond", function (context, options) {
        var ret = "";

        for (var i = 0, j = context.length; i < j; i++) {
            if (context[i].avail >= session.count) {
                ret = ret + options.fn(context[i]);
            }
        }

        return ret;
    });

    if (results.length > 0) {
        return res.render('flightdetails', { flights: results, count: Adult })
    }

    return res.end('No flights found')
}

exports.adminpanel = async (req, res) => {
    console.log(session.userID + " panel")
    if (typeof session == 'undefined') {
        return res.end("Login First");
    }
    res.render('adminpanel');
}

exports.viewflights = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login First");
    }
    console.log(session);
    if (typeof session === 'undefined') {
        return res.end("Login First")
    }

    const mydb = client.db("flight-booking").collection("Flightdetails")

    const results = await mydb.find({}).toArray()

    console.log(results)

    if (results.length > 0) {
        return res.render('viewflights', { flights: results })
    }

    return res.end('No Flights Found')
}

exports.deleteflight = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login First");
    }
    const mydb = client.db("flight-booking").collection("Flightdetails")

    var delete_id = req.params.id;

    const Del = await mydb.findOneAndDelete({ _id: new mongo.ObjectId(delete_id) })

    console.log(Del)

    const results = await mydb.find({}).toArray();

    if (results.length > 0) {
        return res.render('viewflights', { flights: results })
    }

    return res.end('No flights found')
}

// exports.bookFlight = async (req,res) => {    
//     // if(typeof session == 'undefined'){
//     //     return res.end("Login First");
//     // }    
//     var book_id = req.params.id
//     console.log("book")
//     console.log(book_id)    
//     console.log(req.params)
//     const mydb = client.db('flight-booking').collection('Flightdetails')
//     const result = await mydb.findOne({_id: new mongo.ObjectId(book_id)})    
//     console.log("result " ,result)                 
//     return res.redirect(`${book_id}/passengeradd`)
// }

exports.booking = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login first!")
    }
    return res.render('flightsbooking')
}

exports.passengeradd = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end('Login first!')
    }
    var count = session.count
    var book_id = req.params.id
    session.flightID = book_id
    const mydb = client.db('flight-booking').collection('Flightdetails')
    const result = await mydb.findOne({ _id: new mongo.ObjectId(book_id) })
    console.log(result)
    var cost = 12.25 * result.dist * count
    return res.render('passengeradd', { flights: result, persons: count, money: cost })
}

exports.finalbook = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login first")
    }
    const { Name, mobile, email, addressl1, city, state, country } = req.body
    var flight_id = req.params.id
    var mydb = client.db('flight-booking').collection('Flightdetails')
    var flight = await mydb.findOne({ _id: new mongo.ObjectId(flight_id) })
    const remaining = flight.avail - session.count
    result = await mydb.findOneAndUpdate({ _id: new mongo.ObjectId(flight_id) }, { $set: { "avail": remaining } })
    mydb = client.db('flight-booking').collection('Bookings')
    const doc = { Flight: new mongo.ObjectId(flight_id), User: session.userID, Name: Name, Mobile: mobile, Email: email, flyingFrom: flight.fromAirport, flyingto: flight.toAirport, flightName: flight.flightName, date: flight.date, time: flight.time, seats: session.count }
    result = await mydb.insertOne(doc)

    return res.end(session.count + ' seats  booked in ' + flight.flightName)
}

exports.renderProduct = async (req, res) => {
    try {
        res.render('product')
    } catch (error) {
        console.log(error.message)
    }
}

exports.payment = async (req, res) => {
    var amount = 50000
    console.log(instance)
    var options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function(err, order) {
        console.log(order)
        res.send({orderID: order.id})
    })
}

exports.verifyPayment = async(req,res) => {
    let body = req.body.response.razorpay_order_id+"|"+req.body.response.razorpay_payment_id

    var crypto = require('crypto')
    var expectedSignature = crypto.createHmac('sha256' , 'Wok5mJv2F0pa5HKLeXZfUr9r').update(body.toString())
                                    .digest('hex');
    console.log('sig received ' , req.body.response.razorpay_signature)
    console.log('sig generated' , expectedSignature)
    var response = {"signatureIsValid" : "false"}
    if(expectedSignature == req.body.response.razorpay_signature){
        response = {"signatureIsValid" : "true"}
        res.send(response)
    }
}

exports.viewbookings = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login first")
    }
    var user_id = session.userID
    console.log(user_id);
    var mydb = client.db('flight-booking').collection('Bookings')
    var result = await mydb.find({ User: user_id }).toArray()
    if (result.length < 1) {
        return res.end("No Flights Booked")
    }
    return res.render('viewbookings', { bookings: result })
}

exports.deletePassenger = async (req, res) => {
    if (typeof session == 'undefined') {
        return res.end("Login first")
    }
    var mydb = client.db('flight-booking').collection('Bookings')
    var result = await mydb.findOne({ _id: new mongo.ObjectId(req.params.id) })
    var seats = result.seats
    var flight_id = result.Flight
    result = await mydb.findOneAndDelete({ _id: new mongo.ObjectId(req.params.id) })
    mydb = client.db('flight-booking').collection('Flightdetails')
    result = await mydb.findOne({ _id: new mongo.ObjectId(flight_id) })
    var updSeats = parseInt(result.avail) + parseInt(seats)
    result = await mydb.findOneAndUpdate({ _id: new mongo.ObjectId(flight_id) }, { $set: { "avail": updSeats } })
    console.log(result)
    return res.redirect('/auth/viewbookings')
}