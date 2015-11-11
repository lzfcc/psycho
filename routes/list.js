/**
 * Created by Administrator on 2015/11/11.
 */
var express = require('express');
var router = express.Router();



router.post('/new_info', function(req, res){
    console.log(JSON.stringify(req.body));
    res.redirect('/test');
});


module.exports = router;