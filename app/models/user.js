// app/models/po.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsersSchema   = new Schema({
    name: String,
    status: String,
    email: String
});

module.exports = mongoose.model('Po', UsersSchema);
