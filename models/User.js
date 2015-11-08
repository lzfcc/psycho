/**
 * Created by Administrator on 2015/11/7.
 */
var mongoose = require('mongoose');
var userSchema = require('../schemas/userSchema');
var User = mongoose.model('User', userSchema);
module.exports = User;