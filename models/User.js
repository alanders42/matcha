const mongoose = require('mongoose');

 const UserSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    surname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type:String,
        require:true
    },
    age: {
        type: Number,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    sp: {
        type: String,
        require: true
    },
    bio: {
        type: String,
        require: false
    },
    verified: {
        type: Boolean,
        default: 0,
        require: false
    },
    status: {
        type: String,
        require: false
    },
    image:{
        type: String,
        require: true
    },
    vkey: {
        type: String,
        require: false
    },
    sport:{
        type:String,
        default: 'off'
      
        
    },
    fitness: {
        type:String,
        default: 'off'
       
       
    },
    technology: {
        type:String,
        default: 'off'
      
        
    },
    music: {
        type:String,
        default: 'off'
        
        
    },
    gaming: {
        type:String,
        default: 'off'
        
    },
    ageBetween: {
        type:String,
        require: true
    },
    like: [{
        type:String,
        default: null
    }],
    likedBy:[{
        type:String,
        default:null
    }],
    blocked: [{
        type:String,
        default: null
        
    }],
    city: {
        type:String,
        default:null
    },
    country: {
        type:String,
        default:null
    },
    postal:{
        type:String,
        default:null
    },
    gallery:[{
        type:String,
        default:null
    }]
});
user = mongoose.model('Insert',UserSchema);
module.exports.user = user;