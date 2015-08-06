// app/models/po.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PoSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Po', PoSchema);