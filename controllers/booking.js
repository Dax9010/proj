// const { MongoClient, ServerApiVersion } = require("mongodb");
// const { mongo } = require('mongoose');
// const client = new MongoClient(process.env.URI)

// exports.retrival = async (req,res) => {
//     console.log(req.body)

//     const {FromAirport , ToAirport , Date , Adult } = req.body;

//     const mydb = client.db('flight-booking').collection('Flightdetails')

//     const results = await mydb.find({fromAirport: FromAirport , toAirport: ToAirport , date: Date}).toArray();



//     if(results.length > 0){
//         return res.render('flightdetails' , {flights: results , count: Adult})
//     }

//     return res.end('No flights found')
// }

// exports.bookFlight = async (req,res) => {    
//     const id = req.params.id;
//     const mydb = client.db('flight-booking').collection('Flightdetails')
//     const results = await mydb.findOne({_id: new mongo.ObjectId(id)})    
//     return res.render('passengeradd' , {details: results})
// }