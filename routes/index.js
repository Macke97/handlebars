var express = require('express');
var router = express.Router();

const checkAuth = (req, res, next) => {
  if(!req.user) {
    return res.redirect('/login');
  }
  return next();
}

//Models
const Product = require('../models/Product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'WAZUUPP',
    anArray: ['hej', 
    'hallå', 'zup?'], 
    condition: true, 
    active: {home: true},
    cookieInfo: req.cookies.cookieInfo
   });
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

// GET login page
router.get('/login', (req, res) => {
  res.render('login', {active: {login: true}});
});

// GET profile page
router.get('/profile', checkAuth, (req, res) => {
  console.log(req.user)
  res.render('profile', {user: req.user});
});

module.exports = router;
