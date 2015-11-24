/**
 * Created by Administrator on 2015/11/23.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('instruction', {
        title: 'Wu\'s Psychology Test',
        projectName: '心理学实验'
    });
});

module.exports = router;