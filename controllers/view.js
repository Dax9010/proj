const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.viewflights = (req, res) => {
    db.query('Select * from flightdetails', (err, results) => {
        if (err) {
            console.log(err)
        }
        if (results.length > 0) {
            return res.render('viewflights', { results })
        }
    })
}

exports.editflights = (req, res) => {
    db.query('Select * from flightdetails WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.log(results)
            res.render('editflights', { results })
        }
    })
}

exports.updateflight = (req, res) => {
    const { from, to, flightName, date, time, dist } = req.body;
    console.log(req.body)
    db.query('UPDATE flightdetails SET FromAirport = ? , ToAirport = ? , FlightName = ? , Date = ? , Time = ? , Distance = ? WHERE id = ?'
        , [from, to, flightName, date, time, dist, req.params.id], (err, results) => {
            if (err) {
                console.log(err)
            } else {
                db.query('Select * from flightdetails', (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('viewflights', { results })
                    }
                })
            }
        })
}

exports.deleteflight = (req,res) => {
    db.query('DELETE FROM flightdetails WHERE id = ?' , [req.params.id] , (err , results) => {
        if(err){
            console.log(err)
        } else {
            db.query('Select * from flightdetails', (err ,results) => {
                if(err){
                    console.log(err)
                } else {
                    res.render('viewflights' , {results})
                }
            })
        }
    })
}