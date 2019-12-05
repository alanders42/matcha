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
    }
});
user = mongoose.model('Insert',UserSchema);
module.exports.user = user;