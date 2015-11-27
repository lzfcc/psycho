/**
 * Created by Administrator on 2015/11/10.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('contact', {
        projectName: "心理学实验",
        contact_active: "class=active"
    });
});

module.exports = router;