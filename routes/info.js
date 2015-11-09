var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('info', {
        title: 'subject\'s infomation',
        projectName: '心理学实验'
    });
});

router.post('/newinfo', function(req, res){
    console.log(JSON.stringify(req.body));
    res.redirect('/test');
});


module.exports = router;
