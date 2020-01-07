const mongoose = require('mongoose');

 const hobbiesSchema = mongoose.Schema({
    sport:{
        type: Boolean,
        default: 0,
        require: false
    },
    fitness: {
        type: Boolean,
        default: 0,
        require: false
    },
    tecnology: {
        type: Boolean,
        default: 0,
        require: false
    },
    music: {
        type: Boolean,
        default: 0,
        require: false
    },
    gaming: {
        type:String,
        require:true
    }
});
hobbies = mongoose.model('hobbies',hobbiesSchema);
module.exports.hobbies = hobbies;