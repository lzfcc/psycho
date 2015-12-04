/**
 * Created by Administrator on 2015/12/4.
 */
var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('ending', {
        title: 'Wu\'s Psychology Test',
        projectName: '心理学实验'
    });
});

module.exports = router;