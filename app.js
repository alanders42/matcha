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
const hobbiesSchema = require('./models/hobbies');
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

app.get('/filter',(req,res) => {
    res.render('filter')
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
        app.locals.username = req.params.username;
        console.log(data);
    });
    if (app.locals.erreg == undefined)
        app.locals.erreg =  'Please fill in the form to register!';
    res.render('register', {erreg: app.locals.err});
});
//Get all users for matching

app.get('/home',(req,res) => {
    schema.user.findOne({username: req.session.user}, function(err, data){
        if(data){
            app.locals.data = data;
                if(app.locals.data.sp== "heterosexual"){
                    if(app.locals.data.gender == "Male"){
                          app.locals.gender = "Female"
                    }
                    else
                    app.locals.gender = "Male"
                }
                if(app.locals.data.sp== "homosexual"){
                    if(app.locals.data.gender == "Male"){
                        app.locals.gender = "Male"
                    }
                    else
                        app.locals.gender = "Female"
                }
                if(app.locals.data.sp != "bisexual"){
                    function splitStr(str){
                    var string = str.split(" ")
                    }
                    var str = user.username
                    app.locals.arrayLength = app.locals.data.blocked.length;
                    app.locals.userLength = app.locals.data.username.length;
                    var str=[]
                        schema.user.find({
                        sp:app.locals.data.sp,
                        
                        //gender:app.locals.gender,
                        sport:app.locals.data.sport,
                        fitness:app.locals.data.fitness,
                        tecnology:app.locals.data.tecnology,
                        music:app.locals.data.music,
                        gaming:app.locals.data.gaming,
                        
                            
                        username:{$ne: req.session.user}},function(err,data){
                            
                            console.log(str)
                            res.render('home',{user:data, name:req.session.user,blocked:app.locals.data.blocked,length:app.locals.arrayLength,userLength:app.locals.userLength});
                        })
                            
                       
                        
                      
                    
            }
                else {
                    // if(app.locals.data.dislike == "off"){
                        schema.user.find({
                        sp:app.locals.data.sp,
                        sport:app.locals.data.sport,
                        fitness:app.locals.data.fitness,
                        tecnology:app.locals.data.tecnology,
                        music:app.locals.data.music,
                        gaming:app.locals.data.gaming,
                        username:{$ne: req.session.user}},  function(err, data){
                            if(data){
                    
                                res.render('home',{user:app.locals.try, name:req.session.user});
                            }
                        })
                    // }
                }
        }
    }) 
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
                    sport: req.body.sport,
                    fitness: req.body.fitness,
                    tecnology: req.body.tecnology,
                    music: req.body.music,
                    gaming: req.body.gaming,
                    ageBetween: req.body.ageBetween,
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


//Filter search
app.post('/filter',urlencodedParser,(req,res) => {
    schema.user.findOne({username: req.session.user}, async function(err, data){
        if (err) throw err;
        if (req.body.ageBetween){
            ageBetween = req.body.ageBetween;
        }
        else {
            ageBetween= data.ageBetween;
        }
        if (req.body.sp){
            sp = req.body.sp;
        }
        else {
            sp = data.sp;
        }
        if (req.body.sport){
            sport = req.body.sport;
        }
        else {
            sport= "off";
        }
        if (req.body.fitness){
            fitness= req.body.fitness;
        }
        else {
            fitness = "off";
        }
        if (req.body.tecnology){
            tecnology = req.body.tecnology;
        }
        else {
            tecnology = "off";
        }
        if (req.body.music){
            music = req.body.music;
        }
        else {
            music = "off";
        }
        if (req.body.gaming){
            gaming = req.body.gaming;
        }
        else{
            gaming = "off";
        }
        schema.user.findOneAndUpdate({username: req.session.user},
            {$set:{
                ageBetween: ageBetween,
                sp: sp,
                sport: sport,
                fitness: fitness,        
                tecnology: tecnology,
                music: music,
                gaming: gaming

            }}, async function(err, data){
                if(err) throw err;
                res.redirect('/home');
        })
    })
})
//Update Profile
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
//like a profile

app.post('/like',urlencodedParser,(req,res) => {
    schema.user.findOne({username: req.session.user}, async function(err, data){
        if (err) throw err;
        
        function findIndex(str) { 
            var index = str.indexOf(app.locals.visiting);
            console.log(index);
            return index
        } 
        app.locals.liked = data.like;
        var str = app.locals.liked

        var count =findIndex(app.locals.liked);
        if (count == '-1'){
            str.push(app.locals.visiting);
            console.log('User Profile liked')
        }
        else {
            const index = app.locals.liked.indexOf(count);
            
                app.locals.liked.splice(index, 1);
                console.log(app.locals.liked)
            console.log('User Profile is unliked')
        }
        schema.user.findOneAndUpdate({username: req.session.user},
            {$set:{
            like:str}}, async function(err, data){
                if(err) throw err;
                
                res.redirect('home');
        })
    })
})

//block a profile
app.post('/dislike',urlencodedParser,(req,res) => {
    schema.user.findOne({username: req.session.user}, async function(err, data){
        if (err) throw err;
        
        function findIndex(str) { 
            var index = str.indexOf(app.locals.visiting);
            return index
        } 
        app.locals.blocked = data.blocked;
        var str = app.locals.blocked

        var count =findIndex(app.locals.blocked);
        if (count == '-1'){
            str.push(app.locals.visiting);
            console.log('User Profile blocked')
        }
        else {
            const index = app.locals.blocked.indexOf(count);
            app.locals.blocked.splice(index, 1);
            console.log('User Profile is unblocked')
        }
        schema.user.findOneAndUpdate({username: req.session.user},
            {$set:{
            blocked:str}}, async function(err, data){
                if(err) throw err;
                
                res.redirect('home');
        })
    })
})
    //View another persons Page
    app.get('/visitProfile',(req,res) => {
        var user = req.query.user.toString();
        schema.user.findOne({username: user}, function(err, data){
            app.locals.visiting = data.username;
            if (err) throw err;
            schema.user.findOne({username: req.session.user}, async function(err, data){
                if (err) throw err;
                
                function findIndex(str) { 
                    var index = str.indexOf(app.locals.visiting);
                    console.log(index);
                    return index
                } 
                app.locals.liked = data.like;
        
                app.locals.count =findIndex(app.locals.liked);
            })
            res.render('visitProfile', {name: data.name, surname: data.surname, username: data.username, age: data.age, gender: data.gender, sp: data.sp, bio: data.bio, like: app.locals.count, dislike: data.dislike});

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
const port = 8013;
app.listen(port,() => console.log('Server started on port',port));
