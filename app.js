const express = require('express');
const session = require('express-session');
const mailer = require('express-mailer');
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
mailer.extend(app, {
    from: 'matchaprojectsup@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
      user: 'matchaprojectsup@gmail.com',
      pass: 'Matcha123'
    }
  })
//Import Routes
app.set('view engine', 'ejs');

 app.use('/layout', express.static('layout'));
 app.use('/images', express.static('images'));

//ROUTES
app.get('/',(req,res) => {
    if (app.locals.errlog == undefined)
        app.locals.errlog =  'Please fill in the form to login!';
    res.render('login', {err: app.locals.errlog});
});
//render home page
app.get('/home',(req,res) => {
    res.render('home')
});

app.get('/verify', (req, res) => {
    res.render('verify');
});

//verify user account
app.get('/verify/:vkey', (req, res) => {
    schema.user.findOne({vkey: req.params.vkey},function(err, data){
        if(err) throw err;
        console.log(data);
        res.render('verify');
    });
});

//Get all Users
app.get('/register',(req,res) => {
    schema.user.find({},function(err, data){
        if(err) throw err;
    });
    if (app.locals.erreg == undefined)
        app.locals.erreg =  'Please fill in the form to register!';
    res.render('register', {erreg: app.locals.erreg});
});

//Get specific user
app.get('/register/:username', (req, res) => {
    schema.user.findOne({username: req.params.username},function(err, data){
        if(err) throw err;
        console.log(data);
    });
    if (app.locals.erreg == undefined)
        app.locals.erreg =  'Please fill in the form to register!';
    res.render('register', {erreg: app.locals.err});
});

//Adding User to DB!
app.post('/register', urlencodedParser,async  function(req,res) {
    //validate password
    if (validate.checkPassword(req.body.password))
    {
        //hash password and vkey
        var password = req.body.password;
        var key = req.body.username + Date.now();
        const hashpw = crypto.createHash("sha256");
        const hashkey = crypto.createHash("sha256");
        hashpw.update(password);
        hashkey.update(key);
        vkey = hashkey.digest("hex");
       //checks if user exists and insert user data into db
       schema.user.findOne({username: req.body.username}, function(err, data){
           if(req.body.age >= 18)
           {
                if (err) throw err;
                if (data == null){
                //add new user to db
                    var details = schema.user({
                    name:  req.body.name,
                    surname: req.body.surname,        
                    username: req.body.username,
                    password: hashpw.digest("hex"),
                    email: req.body.email,
                    age: req.body.age,
                    gender: req.body.gender,
                    sp: req.body.sp,
                    bio: req.body.bio,
                    vkey: vkey}).save(function(err){
                        if(err) throw err;
                        else{
                        //send verification email to user
                        app.mailer.send('email', {
                            to: req.body.email,
                            subject: 'Matcha Registration',
                            vkey: vkey
                        }, function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            console.log('Registration email sent to ' + req.body.username);
                        })}
                        console.log("Added user to DB!")
                    })
                    //set session variable and unset local error variable
                    req.session.user = req.body.username;
                    app.locals.erreg = undefined;
                res.redirect('/');
                }
                else {
                    console.log("User Exists!");
                    app.locals.erreg =  'User Exists!';
                    res.redirect('/register');
                }
            }
        else{
            console.log('User needs to be 18 or older');
            app.locals.erreg =  'User must be 18 or older to register!';
            res.redirect('/register');
        }})
    }
    else
    {
        console.log("Password invalid!");
        app.locals.erreg = 'Password must be 6-20 characters with 1 capital and 1 number';
        res.redirect('/register');
    }
});

//Get login form data and check if user exists
app.post('/',urlencodedParser,(req,res) => {
    const hash= crypto.createHash("sha256");
        hash.update(req.body.enter_password);
    schema.user.findOne({username: req.body.enter_username}, async function(err, data){
        if (err) throw err;

        if (data){
            if (data.username == req.body.enter_username) {
                pass = hash.digest("hex");
                console.log(pass);
                if (data.password == pass){
                    console.log("Logged in");
                    req.session.user = req.body.enter_username;
                    app.locals.errlog = undefined;
                    res.redirect('home');
                }
                else{
                    app.locals.errlog = 'Password incorrect';
                    res.redirect('/');
                }
            }
        }
        else{
            app.locals.errlog = 'Username does not exist';
            res.redirect('/');
        }
    });
})

//render profile page
app.get('/profile',(req,res) => {
    schema.user.findOne({username: req.session.user}, async function(err, data){
        if (err) throw err;
        res.render('profile', {name: data.name, surname: data.surname, username: data.username, password: "******", email: data.email, age: data.age, gender: data.gender, sp: data.sp, bio: data.bio});
    });
});

app.post('/profile',urlencodedParser,(req,res) => {
    schema.user.findOne({username: req.session.user}, async function(err, data){
        if (err) throw err;

        if (req.body.name){
            name = req.body.name;
        }
        else {
            name = data.name;
        }
        if (req.body.surname){
            surname = req.body.surname;
        }
        else {
            surname = data.surname;
        }
        if (req.body.username){
            username = req.body.username;
        }
        else {
            username = data.username;
        }
        if (req.body.password){
            var password = req.body.password;
            const hash = crypto.createHash("sha256");
            hash.update(password);
            pass = hash.digest("hex");
        }
        else {
            pass = data.password;
        }
        if (req.body.email){
            email = req.body.email;
        }
        else {
            email = data.email;
        }
        if (req.body.age){
            age = req.body.age;
        }
        else{
            age = data.age;
        }
        if (req.body.gender){
            gender = req.body.gender;
        }
        else {
            gender = data.gender;
        }
        if (req.body.sp){
            sp = req.body.sp;
        }
        else {
            sp = data.sp;
        }
        if (req.body.bio) {
            bio = req.body.bio;
        }
        else{
            bio = data.bio;
        }
        schema.user.update({
            name: name,
            surname: surname,        
            username: username,
            password: pass,
            email: email,
            age: age,
            gender: gender,
            sp: sp,
            bio: bio}, async function(err, data){
             if(err) throw err;
                req.session.user = username;
                res.redirect('/profile');
        })
    })
})
//Connect to DB
mongoose.connect(
   process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => console.log('connected to DB!', '\nServer is up and running!')
);
//How to start listening to the server
app.listen(8009);
