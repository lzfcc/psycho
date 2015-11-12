/**
 * Created by Administrator on 2015/11/8.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
    var moodList1 = ["感兴趣的", "心烦的",  "精神活力高的",  "心神不宁的",  "劲头足的",  "内疚的",  "恐惧的",  "敌意的",  "热情的", "自豪的", "易怒的", "警觉性高的", "害羞的", "备受鼓舞的", "紧张的", "意志坚定的", "注意力集中的", "坐立不安的", "有活力的", "害怕的" ];
    var moodList2 = ["感兴趣的", "心烦的",  "精神活力高的",  "心神不宁的",  "劲头足的",  "内疚的",  "恐惧的",  "敌意的",  "热情的", "自豪的", "易怒的", "警觉性高的", "害羞的", "备受鼓舞的", "紧张的", "意志坚定的", "注意力集中的", "坐立不安的", "有活力的", "害怕的" ];
    /*var m1 = shuffle(moodList);
    console.log(m1);
    var m2 = shuffle(moodList);
    console.log(m2); //js数组都作为引用传参，此时m1也等于m2了
    */
    res.render('test', {
        title: 'test',
        projectName: '心理学实验',
        mood1: shuffle(moodList1),
        mood2: shuffle(moodList2),
    });
});

router.post('/new', function(req, res) {
    console.log("post a new doc: ");
    console.log(req.body);
    var obj = JSON.parse(req.body.data);
    var moodObj = obj.mood_test;
    console.log("moodObj: " + JSON.stringify(moodObj));
    var moods = [], firstRating = [], secondRating = [];
    for(var x in moodObj){
        moods.push(x);
        firstRating.push(moodObj[x][0]);
        secondRating.push(moodObj[x][1]);
    }
    console.log("moodObj: " + JSON.stringify(moodObj));
    var user = new User({
        info: obj.info,
        mood_test: {moods: moods,
                    first_rate: firstRating,
                    second_rate: secondRating
        }
    });

    user.save(function (err, user) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

function shuffle(array) {//打乱输出：http://www.cnblogs.com/Wayou/p/fisher_yates_shuffle.html
    return array.sort(function() {
        return Math.random() - 0.5
    });
}

module.exports = router;
