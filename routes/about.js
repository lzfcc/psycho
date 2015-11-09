/**
 * Created by Administrator on 2015/11/9.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var fortunes = ["Conquer your fears or they will conquer you.", "Rivers need springs", "Do not fear what you don't know.", "You will have a pleasant surprise.", "Whenever possible, keep it simple."];
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {
        projectName: "心理学实验",
        fortune: randomFortune
    });
});

module.exports = router;
