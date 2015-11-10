/**
 * Created by Administrator on 2015/11/7.
 */
var mongoose = require('mongoose');
/*var userSchema = mongoose.Schema({
    info: {
        //name: String,
        contact: String,
        subject: String,
        grade: String,
        gender: String,
        age: String,
        teach_year: String,
        title: String,
        post: String,
        education: String,
        school_type: String,
        school_scal: String,
        classes_per_week: String,
    },
    date: String,
    mood_test: {
        moods: [String],
        first_rate: [String],
        second_rate: [String],
    }
});*/
var userSchema = mongoose.Schema({
    info:{
        contact: String,
        subject: String,
        grade: String,
        gender: String,
        age: String,
        teach_year: String,
        title: String,
        post: String,
        education: String,
        school_type: String,
        school_scal: String,
        classes_per_week: String,
    },
    date: String,
    mood_test: {
        moods: [String],
        first_rate: [String],
        second_rate: [String],
    }

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