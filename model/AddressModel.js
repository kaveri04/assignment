var mongoose = require('mongoose');
var AddressSchema = new mongoose.Schema({
    No: String,
    name: String,
    position: String,
    gender: String,
    contact: String,
});
module.exports = mongoose.model('category', AddressSchema);