/**
 * Created by Administrator on 2015/11/11.
 */
var express = require('express');
var User = require('../models/User');
var moment = require('moment');
var _ = require('underscore');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    console.log('req.params = ' + JSON.stringify(req.params));
    
    User.findById(id, function(err, user){
        //���������⣬������������һ���ѱ�ɾ����id�����ᵼ�·�����崻������findʧ����δ���

        //console.log("user: " + JSON.stringify(user));
        res.render('detail',{
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

});

module.exports = router;