/**
 * Created by Administrator on 2015/11/11.
 */
var express = require('express');
var User = require('../models/User');
var moment = require('moment');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
                formatDate: function(date){
                    return moment(date).format('YY/MM/DD HH:mm:ss');               }
            }
            //这里注意：helper在服务器解析了，而不是在js里写Handlebars.registerHelper
        });
    });
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

module.exports = router;