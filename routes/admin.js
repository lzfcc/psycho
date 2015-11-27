/**
 * Created by Administrator on 2015/11/11.
 */
var express = require('express');
var User = require('../models/User');
var moment = require('moment');
var nodeExcel = require('excel-export');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var id = req.query.user;
    console.log('req.query = ' + JSON.stringify(req.query));

    if (id){
        User.findById(id, function(err, user){
            //这里有问题，如果意外访问了一个已被删除的id，将会导致服务器宕机。如果find失败如何处理？

            //console.log("user: " + JSON.stringify(user));
            res.render('detail',{
                projectName: '心理学实验',
                layout: 'admin_layout',
                info: user.info,
                moodTest: user.mood_test,
                resiliencyTest: user.resiliency_test,
                musicMood: user.music_mood,
                helpers:{
                    'counter':  function (index){  //http://stackoverflow.com/questions/15148528/counter-for-handlebars-each
                        return index + 1;
                    }
                }
            });

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
                            if (list[i].music_mood) {
                                ret += options.fn(list[i]);
                            }
                        }
                        return ret;
                    },
                    'each_ne': function(list, options) {
                        var ret = "";
                        for(var i in list) {
                            if (!list[i].music_mood) {
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
                res.json({success: 1});
            }
        });
    }
});


router.get('/content', function (req, res) {
    res.render('content', {
        layout: 'admin_layout',
        projectName: '心理学实验'
    });
});

router.get('/excel', function(req, res){
    User.fetch(function(err, users) {
        var conf ={};
        conf.stylesXmlFile = "styles.xml";
        conf.cols = [{
            caption:'日期',
            type:'string',
        },{
            caption:'用户信息',
            type:'date',
        },{
            caption:'测试',
            type:'string'
        }];
        var rows = [];
        for(var u in users) {
            rows.push([users[u].date, JSON.stringify(users[u].info), JSON.stringify(users[u].mood_test)]);
        }
        conf.rows = rows;
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        res.end(result, 'binary');
    });

});

module.exports = router;