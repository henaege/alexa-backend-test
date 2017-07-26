var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var config = require('../config/config')
var bcrypt = require('bcrypt-nodejs')
var randToken = require('rand-token')

var connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})

connection.connect()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res)=>{
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = bcrypt.hashSync(req.body.password)

  console.log(firstName)

  connection.query(`SELECT email FROM users`, (error, results)=>{
    console.log(results)
    if (error) throw error
    var emailsArray = []
    for (i = 0; i < results.length; i++){
      emailsArray.push(results[i].email)
    }
    if(emailsArray.includes(email)){
      res.json({msg: "userExists"})
    } else {
      // var insertIntoUsers = `INSERT INTO users (email, firstName, lastName, password) VALUES (?,?,?,?);`
      connection.query(`INSERT INTO users (email, firstName, lastName, password) VALUES (?,?,?,?);`, [email, firstName, lastName, password], (error2, results2)=>{
        console.log("user inserted")
        console.log(results2)
        if(error2){
          res.json({msg: error2})
        } else {
          res.json({
            msg: "userInserted",
            email: email,
            name: firstName
          })
        }
      })
    }
  })
})

router.get('/categorylist', (req, res)=>{
  var email = req.body.email

  var categoryQuery = `SELECT * FROM categories;`
  conection.query(categoryQuery, (error, results)=>{
    if (error) {
      res.json({
        msg: "error"
      })
    } else {
      res.json({
        categories: results
      })
    }
  })
})

router.get('/grouplist', (req, res)=> {
  var categoryName = req.body.categoryName

  var categoryIdQuery = `SELECT id FROM category WHERE categoryName = categoryName;`
  connection.query(categoryIdQuery, (error, results)=>{
    if (error) {
      throw error
    } else {
      var groupQuery = `SELECT habits FROM groups WHERE categoryID = ${results[0]};`
      connection.query(groupQuery, (error2, results2)=>{
        if (error){
          throw error
        } else {
          res.json({
            groupList: results2
          })
        }
      })
    }
  })
})

router.post('/test', (req, res)=>{
  var email = req.body.email
  insertQuery = `INSERT INTO users (email) VALUES (email);`
  connection.query(insertQuery, (error, results)=>{
    if (error) {
      throw error
    } else {
      res.json({
        msg: "email success"
      })
    }
  })
})

module.exports = router;
