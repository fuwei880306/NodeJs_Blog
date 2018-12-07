var mongoose = require('mongoose');
var usersSchema = require('../shcemas/users');

module.exports = mongoose.model('User',usersSchema);