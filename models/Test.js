/**
 * Created by Administrator on 2015/12/8.
 */
var mongoose = require('mongoose');
var userSchema = require('../schemas/testSchema');
module.exports = mongoose.model('Test', userSchema);