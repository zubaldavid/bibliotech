var express = require('express');
var router = express.Router();
var Institutions = require('../models/institutions');

router.post('/create', function(req,res) {
  const name = req.body.name;
  const url = req.body.url;
  const objDomain = req.body.domain;

  Institutions.insertInstitution(name, url, objDomain, function(err, result) {
    if(err)
      return res.json(err);
    return res.json(result);
  })
})

router.get('/getOneInstitution', function(req, res) {
  const domain  = req.query.domain

  Institutions.getInstitutionID(domain, function(err,result) {
    if(err)
      return res.json(err);
    return res.json(result);
  })
})

module.exports = router;
