const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv/config');
const schema = require('./models/User');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
//app.use(bodyParser.json());

//Import Routes
app.set('view engine', 'ejs');

 app.use('/layout', express.static('layout'));
 app.use('/images', express.static('images'));
// app.use('/pages', express.static('pages'));

//ROUTES
app.get('/',(req,res) => {
    res.render('login')
});

app.get('/register',(req,res) => {
    res.render('register');
});

app.post('/register', urlencodedParser, function(req,res) {
    console.log(req.body);
    var details = schema.user({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender,
        sp: req.body.sp,
        bio: req.body.bio}).save(function(err){
            if(err) throw err;
            else
            console.log("Added user to DB!")
        })
  
     res.redirect('/');
});

//Connect to DB
mongoose.connect(
   process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => console.log('connect to DB!')
);
//How to start listening to the server
app.listen(1997);