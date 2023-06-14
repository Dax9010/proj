const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.retrival = (req,res) => {
    console.log(req.body)

    const {FromAirport , ToAirport , Date , Adult , Child , classV } = req.body;

    db.query('Select * from flightdetails where FromAirport like ? and ToAirport like ? and Date = ?' , [FromAirport , ToAirport , Date] , async (err , results) => {
        if(err){
            console.log(err)
        }
        if(results.length > 0){
            res.render('flightdetails' , { results })
        } else {
            res.render('flightsbooking' , {
                message: 'No flights found'
            });
        }
    })
}