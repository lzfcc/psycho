var express = require('express');
var User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Wu\'s Psychology Test',
    projectName: '心理学实验',
    index_active: "class=active"
  });
});

module.exports = router;