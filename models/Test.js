/**
 * Created by Administrator on 2015/12/8.
 */
var mongoose = require('mongoose');
var userSchema = require('../schemas/testSchema');
module.exports = mongoose.model('Test', userSchema); //MongoDB在创建collection时候会自动把模型名变复数，比如这里就变成tests