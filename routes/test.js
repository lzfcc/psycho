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
