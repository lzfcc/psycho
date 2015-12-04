/**
 * Created by Administrator on 2015/11/8.
 */
var requestIp = require('request-ip');
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
    var resiliencyList = ["1.我很清楚自己未来的目标。", "2.即使事情看起来没有希望，我也不会放弃。", "3.面对失败我不会气馁。", "4.我是一个非常幽默的人。", "5.我是周围人眼中的开心果。", "6.我经常跟周围人开玩笑。", "7.我相信我能克服困难，解决难题。", "8.我严格遵照班规来管理班级。", "9.我会主动邀请家长来协助完成学生工作。", "10.我善于通过制定计划并严格实施来解决问题。", "11.我善于通过向他人请教来解决问题。", "12.当我困惑时，师傅总会给我非常有用的建议。", "13.工作遇到困难时，同事会帮我分析并给予建议。", "14.同事会耐心倾听我的抱怨并给予安慰。", "15.家人总会尊重我的决定。", "16.家人总能在我需要时，给予我精神鼓励。", "17.当我因工作无法兼顾家庭时，家人总是给予我理解。", "18.学生会经常做一些感激我的事情。", "19.我为自己是一名教师而感到自豪。", "20.我很满意我的工作可以施展我的才华。", "21.领导非常满意我的工作。", "22.我教授的学生成绩在学校名列前茅。", "23.我善于调节气氛。", "24.我能很清楚地表达自己的观点。", "25.我能根据语言、眼神或手势了解他人想要表达的内容。",  "26.我难以管教班级中有偏差的学生。	", "27.我难以处理家长的问题或冲突。", "28.我难以适应学校教育政策的变动。", "29.我觉得可以给自己充电的时间太少了。", "30.我觉得社会对教师的期望和要求太高。", "31.我觉得中学教师缺乏进修的机会。"];
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
        ip: requestIp.getClientIp(req),
        info: obj.info,
        mood_test: obj.moodTest,
        resiliency_test: obj.resiliencyTest,
        music_mood: obj.musicMood,
        res_sum: obj.resSum
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