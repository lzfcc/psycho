/**
 * Created by Administrator on 2015/11/8.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('test', {
        title: 'test',
        projectName: '心理学实验',
        mood: ["感兴趣的", "心烦的",  "精神活力高的",  "心神不宁的",  "劲头足的",  "内疚的",  "恐惧的",  "敌意的",  "热情的", "自豪的", "易怒的", "警觉性高的", "害羞的", "备受鼓舞的", "紧张的", "意志坚定的", "注意力集中的", "坐立不安的", "有活力的", "害怕的" ]
    });
});

module.exports = router;
