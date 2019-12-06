const express = require('express');
const session = require('express-session');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv/config');
const schema = require('./models/User');
const validate = require("./functions/validation");
const crypto = require('crypto');
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

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
app.get('/home',(req,res) => {
    res.render('home')
});

//Get all Users
app.get('/register',(req,res) => {
    schema.user.find({},function(err, data){
        if(err) throw err;
    });
    res.render('register');
});

//Get specific user
app.get('/register/:username', (req, res) => {
    schema.user.findOne({username: req.params.username},function(err, data){
        if(err) throw err;
        console.log(data);
    });
    res.render('register');
});

//Adding User to DB!
app.post('/register', urlencodedParser, function(req,res) {
    sess = req.session;
    console.log(req.body);

    //validate password
    if (validate.checkPassword(req.body.password))
    {
        var password = req.body.password;
        const hash= crypto.createHash("sha256");
        hash.update(password);
       //checks if user exists and insert user data into db
       schema.user.findOne({username: req.body.username}, function(err, data){
        if (err) throw err;
        if (data == null){
        var details = schema.user({
            name:  req.body.name,
            surname: req.body.surname,        
            username: req.body.username,
            password: hash.digest("hex"),
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
        }
        else {
            console.log("User Exists!");
        }
       })}
    else
    {
        console.log("Password invalid!");
        res.redirect('/register');
    }
});

//login
app.post('/',urlencodedParser,(req,res) => {
    const hash= crypto.createHash("sha256");
        hash.update(req.body.enter_password);
    schema.user.findOne({username: req.body.enter_username}, function(err, data){
        if (err) throw err;
    
        if (data != null){
            schema.user.findOne({password: hash.digest("hex")}, function(err, data){
                if (err) throw err;
                
                if (data != null){
                    console.log("Logged in");
                    res.redirect('home');
                }
                else{
                    console.log("Password incorrect");
                     res.redirect('/');
                }
        })}
        else{
            console.log("Username incorrect");
             res.redirect('/');
        }
        req.session.user = req.body.enter_username; 
    });
})

app.get('/profile',(req,res) => {
    schema.user.findOne({username: req.session.user}, function(err, data){
        if (err) throw err;
        res.render('profile', {name: data.name, surname: data.surname, username: data.username, password: "******", email: data.email, age: data.age, gender: data.gender, sp: data.sp, bio: data.bio});
    });
   
    
});
//Update profile

//Connect to DB
mongoose.connect(
   process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => console.log('connected to DB!', '\nServer is up and running!')
);
//How to start listening to the server
app.listen(8009);
