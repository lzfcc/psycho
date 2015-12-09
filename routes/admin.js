/**
 * Created by Administrator on 2015/11/11.
 */
var express = require('express');
var User = require('../models/User');
var Test = require('../models/Test');
var moment = require('moment');
var nodeExcel = require('excel-export');
var _ = require('underscore');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    var id = req.query.user;
    console.log('req.query = ' + JSON.stringify(req.query));

    if (id){
        User.findById(id, function(err, user){
            //这里有问题，如果意外访问了一个已被删除的id，将会导致服务器宕机。如果find失败如何处理？
            if(err || user == undefined){
                res.render('404', {});
            }
            //console.log("user: " + JSON.stringify(user));
            else{
                res.render('detail',{
                    projectName: '心理学实验',
                    layout: 'admin_layout',
                    info: user.info,
                    moodTest: user.mood_test,
                    resiliencyTest: user.resiliency_test,
                    musicMood: user.music,
                    IQReaction: user.iq_reaction,
                    helpers:{
                        'counter':  function (index){  //http://stackoverflow.com/questions/15148528/counter-for-handlebars-each
                            return index + 1;
                        },
                        'musicAttribute': function(music) {
                            if(music > 0)
                                return '积极音乐';
                            else if(music < 0)
                                return '消极音乐';
                            else
                                return '无音乐';
                        }
                    }
                });
            }

        });
    }
    else{
        User.fetch(function(err, users) {
            if (err) {
                console.log(err);
            }
            res.render('admin', {
                layout: 'admin_layout',
                title: '管理页',
                projectName: '心理学实验',
                users: users,
                helpers: {
                    'formatDate': function(date){
                        return moment(date).format('YY/MM/DD HH:mm:ss');
                    },
                    'each_po': function(list, options) {
                        var ret = "";
                        for(var i in list) {
                            if (list[i].music > 0) {
                                ret += options.fn(list[i]);
                            }
                        }
                        return ret;
                    },
                    'each_ne': function(list, options) {
                        var ret = "";
                        for(var i in list) {
                            if (list[i].music < 0) {
                                ret += options.fn(list[i]);
                            }
                        }
                        return ret;
                    },
                    'each_0': function(list, options) {
                        var ret = "";
                        for(var i in list) {
                            if (list[i].music == 0) {
                                ret += options.fn(list[i]);
                            }
                        }
                        return ret;
                    }
                }
                //这里注意：helper在服务器解析了，而不是在js里写Handlebars.registerHelper
            });
        });
    }

});

router.delete('/', function (req, res) {
    //console.log(JSON.stringify(req.query));
    var id = req.query.id;
    console.log('DELETE请求！删除ID=' + id);
    if (id) {
        User.remove({_id: id}, function(err, user) {
            if (err) {
                console.log(err);
            }
            else {
                res.json({delete_success: 1});
            }
        });
    }
});


router.get('/content', function (req, res) {
    Test.find1stDoc(function(err, currentSetting){
        var checked;
        if(currentSetting == undefined){ //一般情况也进不到这里了
            var test = new Test({
                music_on: true,
                iq_picture_order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            });

            test.save(function (err, setting) {
                if (err) {
                    console.log(err);
                }
                else{
                    res.json({create_success: 1});
                }
            });
            checked = 'checked';
        }
        else{
            checked = currentSetting.music_on ? 'checked': '';
        }
        res.render('content', {
            layout: 'admin_layout',
            projectName: '心理学实验',
            musicOn: checked,
        });
    });

});

router.post('/update', function(req, res) {
    console.log(req.body);
    var obj = {'music_on': req.body.music_on};
    var _test;
    Test.count(function (err, cnt) {
        //console.log("test setting count: " + cnt);
        if (cnt) {
            Test.find1stDoc(function (err, defaultSetting) {
                defaultSetting.music_on = req.body.music_on;
                _test = _.extend(defaultSetting, obj);
                _test.save(function (err, setting) {
                    if (err) {
                        console.log(err);
                    }
                    else{
                        res.json({update_success: 1, on: setting.music_on});
                    }
                });
            });
        }
        else {  //正常情况下是不会进到这里来了。
            var test = new Test({
                music_on: req.body.music_on,
                iq_picture_order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            });

            test.save(function (err, setting) {
                if (err) {
                    console.log(err);
                }
                else{
                    res.json({create_success: 1});
                }
            });
        }
    });
});


router.get('/excel', function(req, res){
    User.fetch(function(err, users) {
        var conf ={};
        conf.stylesXmlFile = "styles.xml";
        conf.cols = [{
            caption:'日期',
            type:'date',
        },{
            caption:'复原力',
            type:'number',
        },{
            caption:'用户信息',
            type:'string'
        },{
            caption:'音乐属性',
            type:'bool'
        },{
            caption:'测试',
            type:'string'
        }];
        var rows = [];
        for(var u in users) {
            rows.push([users[u].date, users[u].res_sum, JSON.stringify(users[u].info), users[u].music_mood, JSON.stringify(users[u].mood_test)]);
        }
        conf.rows = rows;
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        res.end(result, 'binary');
    });

});

module.exports = router;