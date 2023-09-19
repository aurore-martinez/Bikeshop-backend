var express = require('express');
var router = express.Router();
var fetch  = require('node-fetch')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/articles', function(req, res, next) {
 
  fetch('https://bikeshop-articles.vercel.app/articles')
  .then(response=> response.json())
  .then(data => {
    res.json({articles : data.articles})
  } )
});



module.exports = router;
