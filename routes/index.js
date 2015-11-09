var express = require('express');
var User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Wu\'s Psychology Test',
    projectName: '心理学实验'
  });
});

router.post('/newuser', function(req, res, next) {
  var user = new User({
    name: req.body.name,
    score: Number(req.body.score),
    date: req.body.date
  });
  console.log(JSON.stringify(req.body));
  user.save(function (err, user) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
