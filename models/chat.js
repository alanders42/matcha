const mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
	chatId:String,
	to: String,
	from: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

chat = mongoose.model('Message',chatSchema);
module.exports.chat = chat;