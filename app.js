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
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
var async = require('async');

 //mongo Uri
 const mongoURI = 'mongodb+srv://Matcha:Matcha123@wethinkcode-je391.mongodb.net/Matcha?retryWrites=true&w=majority';
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
  //Middleware
  app.use(methodOverride('_method'));
router.use(express.static(__dirname+"./public/"));


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
// app.get('/home',(req,res) => {
//     res.render('home')
// });
//render Profile upload page
app.get('/profilePic',(req,res) => {
    res.render('profilePic')
});


app.get('/forgotpass',(req,res) => {
    res.render('forgot-pass')
});
var Storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
});
var profileUpload = multer({
    storage:Storage
}).single('file');
router.post('/upload',profileUpload,function(req,res,next){

})
app.post('/forgotpass',(req,res) => {
    schema.user.findOne({email: req.body.enter_email}, function (err, data){
        req.session.user = data.username;
        //send verification email to user
        var key = data.username + Date.now();
        const hashkey = crypto.createHash("sha256");
        hashkey.update(key);
        app.mailer.send('forgotpass-email', {
            to: req.body.enter_email,
            subject: 'Matcha Change Password',
            vkey: hashkey.digest("hex")
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Email sent to change ' + data.username + '\'/s password' );
        })})
});

app.get('/changepass',(req,res) => {
    res.render('change-pass')
});

app.post('/changepass',(req,res) => {
    
});

//verify user account
app.get('/verify', (req, res) => {
    var key = req.query.vkey.toString();
    console.log(key);
    schema.user.findOneAndUpdate({vkey: key},
        {$set:{
        verified: true}}, function(err, data){
            if(err) throw err;
            console.log(data.username + " Has been verified!");
        })
        res.render('verify');
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
//Get all users for matching

app.get('/home',(req,res) => {
    schema.user.findOne({username: req.session.user},  function(err, data){
        if (data){
            mongoURI.Matcha.inserts.find({},{sp :data.sp}).limit(2);
       console.log(data);
            if(data)
            {

            
                if (app.locals.username == undefined){
                    app.locals.username = data.username;
                }

                res.render('home', {username: app.locals.username});
            }
            
            

        }
    });
   

    });
    app.post('/home', (req, res) => {
       
                res.redirect('home');
         
         
   
   

})

//Adding User to DB!
app.post('/register', profileUpload, urlencodedParser,async  function(req,res) {
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
                    image: req.body.file,
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
        if (data){
            if(data.verified == true){
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
                app.locals.errlog = 'Your Account has not been verified. Please Check your email!';
                res.redirect('/');
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
        schema.user.findOneAndUpdate({username: req.session.user},
            {$set:{
            name: name,
            surname: surname,        
            username: username,
            password: pass,
            email: email,
            age: age,
            gender: gender,
            sp: sp,
            bio: bio}}, async function(err, data){
             if(err) throw err;
                req.session.user = username;
                res.redirect('/profile');
        })
    })
})
//loads form
app.get('/image-upload',(req, res) =>{
    gfs.files.find().toArray((err, files)=>{
        //check if files
        if(!files || files.length == 0) {
            res.render('image-upload',{files:false});
        } else{
            files.map(files => {
                if(
                    files.contentType ==='image/jpeg' ||
                    files.contentType === 'image/png'
                ) {
                    files.isImage = true;
                } else{
                    files.isImage = false;
                }
            });
            
            if(files.Profile == 'Profile Picture'){
     
        app.locals.profilePicture = req.session.user;
    }
            if (app.locals.errlog == undefined)
                app.locals.errlog =  'Please fill in the form to login!';
            res.render('image-upload',{files:files});
        }
    }
)});
//display images
app.get('/image-upload',(req, res) =>{
    gfs.files.find().toArray((err, files)=>{
        //check if files
        if(!files || files.length == 0) {
            res.render('image-upload',{files:false});
        } else{
            files.map(files => {
                if(
                    files.contentType ==='image/jpeg' ||
                    files.contentType === 'image/png'
                ) {
                    files.isImage = true;
                } else{
                    files.isImage = false;
                }
            });
            if (app.locals.errlog == undefined)
                app.locals.errlog =  'Please fill in the form to login!';
            res.render('image-upload',{files:files, username:req.session.user});
        }
    }
)});
//load home-images
app.get('/profile-page',(req, res) =>{
    gfs.files.find().toArray((err, files)=>{
        //check if files
        if(!files || files.length == 0) {
            res.render('profile-page',{files:false});
        } else{
            files.map(files => {
                if(
                    files.contentType ==='image/jpeg' ||
                    files.contentType === 'image/png'
                ) {
                    files.isImage = true;
                } else{
                    files.isImage = false;
                }
            });
           
            res.render('profile-page',{files:files,username:req.session.user});
        }
    }
)});
//Display image
app.get('/image/:filename',(req, res) =>{
    gfs.files.findOne({filename:req.params.filename},(err, files)=>{
        //check if files
        if(!files || files.length == 0) {
            return res.status(404).json({
                err:'No file exist'
            });
        } 
           
        if(
            files.contentType ==='image/jpeg' ||
            files.contentType === 'image/png'
        ) {
            const readstream = gfs.createReadStream(files.filename);
            readstream.pipe(res);
        }else {
            res.status(404).json({
                err:'Not an image'
            });
        }
        
    })});
    //View another persons Page
    app.get('/visitProfile',(req,res) => {
        schema.user.findOne({username: app.locals.username}, async function(err, data){
            if (err) throw err;
            res.render('visitProfile', {name: data.name, surname: data.surname, username: data.username, age: data.age, gender: data.gender, sp: data.sp, bio: data.bio});
        });
    });
   
 

  //Create mongo connection
  const conn = mongoose.createConnection(mongoURI);
  app.locals.count = 1;
    //Create storage engine

    const storage = new GridFsStorage({
        url:mongoURI,
        file: (req, file) => {
          return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
              if (err) {
                return reject(err);
              }
              if(app.locals.profilePicture === undefined){
                var filename = req.session.user + app.locals.count++;
              }
              else{
                  var filename = app.locals.profilePicture;
              }
              console.log(app.locals.profilePicture);
              const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
              };
              resolve(fileInfo);
            });
          });
        }
      });
    
  const upload = multer({ storage });
    //Init gfs
    let gfs;
    conn.once('open',() =>{
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('uploads');
    })

//uploads file to db
app.post('/upload',upload.single('file'),(req,res)=>{
    console.log(req.body.imgtype);
    
     res.redirect('/profile-page');
})

//Connect to DB
mongoose.connect(
   process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => console.log('connected to DB!', '\nServer is up and running!')
);
//How to start listening to the server
const port = 8012;
app.listen(port,() => console.log('Server started on port',port));
