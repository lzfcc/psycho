/**
 * Created by Administrator on 2015/12/8.
 */
var mongoose = require('mongoose');
var testSchema = mongoose.Schema({
    music_on: Boolean,
    iq_picture_order: [String],
});

testSchema.pre('save', function(next){
    next();
});

testSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort({}).exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({_id: id}).exec(cb);
    },
    find1stDoc: function(cb) {
        return this.findOne().exec(cb);  //只返回最顶上一条
        //return this.find({}).sort({...}).limit(1);  //拍好序的最顶上一条
    }
}

module.exports = testSchema;