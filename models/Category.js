var mongoose = require('mongoose');
var categorySchema = require('../shcemas/category');

module.exports = mongoose.model('Category',categorySchema);