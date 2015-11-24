/**
 * Created by Administrator on 2015/11/7.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    info:{
        nickname: String,
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
        school_scale: String,
        classes_per_week: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    music_mood: Boolean,
    resiliency_test: [{
        item: String,
        rating: Number,
    }],
    res_sum: Number,
    mood_test: [{
            mood: String,
            first_rating: Number,
            second_rating: Number
        }]
});

userSchema.pre('save', function(next){
   if (this.isNew) {
       this.date = Date();
   }
    next();
});

userSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort({"res_sum": -1}).exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({_id: id}).exec(cb);
    }
}

module.exports = userSchema;