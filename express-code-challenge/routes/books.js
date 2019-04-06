var express = require('express');
var Books = require('../models/books');
var router = express.Router();

router.get('/', function (req, res) {
    Books.getAllBooks(function(err, result) { // insert into datbase
    if(err)
      return res.json(err); // response to front end
    return res.json(result);
  })
});

router.get('/id', function (req, res) {
    const id = req.query.id
    Books.getBooksById(id,function(err, result) { // insert into datbase
    if(err)
      return res.json(err); // response to front end
    return res.json(result);
  })
});

module.exports = router;
