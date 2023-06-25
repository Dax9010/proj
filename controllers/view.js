const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient, ServerApiVersion } = require("mongodb");
const { mongo } = require('mongoose');
const client = new MongoClient(process.env.URI);

// exports.viewflights = async (req, res) => {

//     const mydb = client.db("flight-booking").collection("Flightdetails")
    
//     const results = await mydb.find({}).toArray()

//     console.log(results)

//     if(results.length > 0){
//         return res.render('viewflights' , {flights: results})
//     }

//     return res.end('No Flights Found')
// }

// exports.deleteflight = async (req,res) => {

//     const mydb = client.db("flight-booking").collection("Flightdetails")

//     var delete_id = req.params.id;

//     const Del = await mydb.findOneAndDelete({_id: new mongo.ObjectId(delete_id)})

//     console.log(Del)

//     const results = await mydb.find({}).toArray();

//     if(results.length > 0){
//         return res.render('viewflights' , {flights: results})
//     }

//     return res.end('No flights found')
// }