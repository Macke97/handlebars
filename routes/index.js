var express = require('express');
var router = express.Router();

//Models
const Product = require('../models/Product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WAZUUPP', anArray: ['hej', 'hallå', 'zup?'], condition: true, active: {home: true} });
});

router.get('/products', (req, res, next) => {
  Product.find((err, products) => {
    if(err) {
      return next(err);
    }
    res.render('products', {products, active: {products: true}});
  });
});

router.get('/search', (req, res, next) => {
  const regex = new RegExp(`${req.query.q}`, 'i');
  let query = {
    $or: [{title: regex}, {description: regex}]
  };
  
  Product.find(query, (err, products) => {
    console.log(products);
    
    const noProducts = products.length < 1 ? true : false;

    res.render('search_result', {products, noProducts})
  });
});

module.exports = router;
