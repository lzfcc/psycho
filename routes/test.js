/**
 * Created by Administrator on 2015/11/8.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

function load_musics(callback) {
    fs.readdir(path.join(__dirname, '../public/mp3'), function(err, files){
        if (err) {
            callback(err);
            return;
        }
        callback(null, files);
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var moodList = ["感兴趣的", "心烦的",  "精神活力高的",  "心神不宁的",  "劲头足的",  "内疚的",  "恐惧的",  "敌意的",  "热情的", "自豪的", "易怒的", "警觉性高的", "害羞的", "备受鼓舞的", "紧张的", "意志坚定的", "注意力集中的", "坐立不安的", "有活力的", "害怕的" ];
    var resiliencyList = ["1.我很清楚自己未来的目标。", "2.即使事情看起来没有希望，我也不会放弃。", "3.面对失败我不会气馁。",
"4.我是一个非常幽默的人。", "5.我是周围人眼中的开心果。",  "6.我经常跟周围人开玩笑。", "7.我相信我能克服困难，解决难题。", "8.我严格遵照班规来管理班级。", "9.我会主动邀请家长来协助完成学生工作。", "10.我善于通过制定计划并严格实施来解决问题。"];
    /*var m1 = shuffle(moodList);
    console.log(m1);
    var m2 = shuffle(moodList);
    console.log(m2); //js数组都作为引用传参，此时m1也等于m2了
    */
    load_musics(function (err, musics){
        if (err) {
            music = 'http://7wy46p.com1.z0.glb.clouddn.com/Canon.mp3';
            //如果出现文件错误，则播放网络音乐
        }
        else {
            var music = '/mp3/' + musics[Math.floor(Math.random() * musics.length)];
        }
        console.log("本次播放：" + music);
        res.render('test', {
            title: 'test',
            projectName: '心理学实验',
            resiliency: resiliencyList,
            mood1: _.shuffle(moodList),
            mood2: _.shuffle(moodList),
            music: music,
            helpers: {  //为了表单过长，分成两列显示
                leftrow: function(list, options){
                    var ret = "";
                    for(var i = 0; i < list.length; i++) {
                        if ((i & 1) == 0) {
                            ret += options.fn(list[i]);
                        }
                    }
                    return ret;
                },
                rightrow: function(list, options){
                    var ret = "";
                    for(var i = 0; i < list.length; i++) {
                        if (i & 1) {
                            ret += options.fn(list[i]);
                        }
                    }
                    return ret;
                }
            }
        });
    });

});

router.post('/new', function(req, res) {
    console.log("post a new doc: ");
    console.log(req.body);
    var obj = JSON.parse(req.body.data);
    //var moodObj = obj.moodTest;
    //console.log("moodObj: " + JSON.stringify(moodObj));
    
    //console.log("Object.keys(moods) = " + Object.keys(moodObj)); //js原生方法
    //console.log("unserscore.keys(moods) = " + _.keys(moodObj)); //underscore方法

    /*for(var x in moods){ //错啦！js的奇怪语法，for..in语句对于数组来讲，仍然是下标
        firstRating.push(moodObj[x][0]);
        secondRating.push(moodObj[x][1]);
    }*/

    var user = new User({
        info: obj.info,
        mood_test: obj.moodTest,
        resiliency_test: obj.resiliencyTest,
        music_mood: obj.musicMood
    });

    user.save(function (err, user) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

function shuffle(array) {
//打乱输出：http://www.cnblogs.com/Wayou/p/fisher_yates_shuffle.html。这里直接调用underscore的方法了。
    return array.sort(function() {
        return Math.random() - 0.5
    });
}

module.exports = router;
