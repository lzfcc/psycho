/**
 * Created by Administrator on 2015/11/7.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    name: String,
    score: Number,
    date: String,
});

userSchema.pre('save', function(next){
   if (this.isNew) {
       this.date = Date();
   }
    next();
});

userSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort('date').exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({_id: id}).exec(cb);
    }
}

module.exports = userSchema;