const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var passport  = require('passport');
var LocalStrategy = require('passport-local');
var Users = require('../models/users');
var Institutions =  require('../models/institutions');


function fetchInstitution(domain) {
  // Fetch object from Hipo API
  const url = 'http://universities.hipolabs.com/search?domain=' + domain;
  return new Promise (resolve => {
    fetch(url)
      .then(function(response) {
      if(response.status >= 400) {
          throw new Error("Bad Response");
      }
      return response.json();
    })
    .then(function(university) {
      resolve(university);
    })
 })
}


function fetchInstitutionID(domain) {
  // Fetch Institutions id
  const route = 'http://localhost:5000/routes/institutions/getOneInstitution/?domain=' + domain;
  return new Promise (resolve => {
    fetch(route)
      .then(function(response) {
      if(response.status >= 400) {
        throw new Error("Bad Response: ",response.status);
      }
      return response.json();
    })
    .then(function(id) {
      resolve(id);
    })
  })
}

function postNewInstitution (name, url, domain) {
  const route = 'http://localhost:5000/routes/institutions/create';
  return new Promise (resolve => {
    fetch(route, {
      method:'post',
      headers: {'Content-Type': 'application/json'},
      body: { name: name, url: url, domain: domain}
    })
      .then(function(response) {
      if(response.status >= 400) {
        throw new Error("Bad Response");
      }
      return response.json();
    })
  })
}

function getUserByEmail(email) {
  // Fetch User Email
  const url = 'http://localhost:5000/routes/users/email/?email=' + email;
  return new Promise (resolve => {
    fetch(url)
      .then(function(response) {
      if(response.status >= 400) {
        throw new Error("Bad Response");
      }
      return response.json();
    })
    .then(function(user) {
      resolve(user);
    })
  })
}


async function createInstitution(domain) {
  // Fetch an institution
  const obj = await fetchInstitution(domain);
  console.log("Testing object: ", obj);

  // Check if user email domain is valid
  if (obj === undefined || obj.length == 0) {
    throw new Error("Your email is not valid. Please use a university email.")
  }

  var name = obj[0].name;
  const url = obj[0].web_pages[0];
  const objDomain = obj[0].domains[0];
  console.log("Variables initialzed");

  // Check if institution is in db
  const id = await fetchInstitutionID(objDomain);
  console.log('Check if institution is in db:', id);

  // Store one if not
  if(id === undefined || id.length == 0) {
    //postNewInstitution(name, url, domain);
    Institutions.insertInstitution(name, url, objDomain, function(err, result) {
       res.json(result);
    })
    id = await fetchInstitutionID(objDomain);
    console.log("Institution created and id: ", id);
  }
  //console("What is the id in createInst? ", id);
  return id;
}

async function getInstitutionID (domain) {
  const institutionID = await createInstitution(domain);
  const id = institutionID[0].id;
  console.log("New ID: ",id);
  return id;
}



router.get('/email', async function (req, res) {
  var email = req.query.email;
  Users.getUserByEmail(email, function(err, result) { // insert into datbase
    if(err)
      return res.json(err);
    return res.json(result);
  })
})


router.post('/create', async function (req, res, next) {
  var name  = req.body.name; // from client
  var email =  req.body.email;
  var role =  req.body.role;
  var password =  req.body.password;
  const saltRounds = 10;

  // Check if user exists
  const emailExists = await getUserByEmail(email);
  console.log("In create route:", emailExists);
  if(emailExists === undefined || emailExists.length == 0) {
      throw new Error("This email is in use. Please use university email");
  }

  // Split email for domain
  const domain = email.split('@')[1];
  console.log("Domain:",domain);

  // Fetch the institution id
  const institutionID = await getInstitutionID(domain);
  console.log("Now in route id: ", institutionID);

  // Hash the password and insert user into db
  bcrypt.hash(password, saltRounds, function(err, hash) {
    console.log("Approaching creation of user");
    Users.insertUser(name, email, role, hash, institutionID, function(err, result) { // insert into datbase
      if(err)
        return res.json(err);
      return res.json(result);
    })
  });
});

router.post('/login', async function(request, response) {
    const email = request.body.email;
    const password = request.body.password;

    const userObject = await getUserByEmail(email);
    const hash = userObject[0].password;

    bcrypt.compare(password, hash, function(err, res) {
        if (res == true) {
          console.log("You are now logged in!")
          response.redirect('/');
        }
        else {
          console.log("Incorrect username or password. Please try again!")
        }
    });
})

module.exports = router;
