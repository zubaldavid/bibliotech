const express = require('express');
const dotenv = require('dotenv').config();
const fetch = require('isomorphic-fetch');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const passport  = require('passport');
const LocalStrategy = require('passport-local');

var db = require('./database');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
// Routes
app.use('/routes/books', require('./routes/books'));
app.use('/routes/institutions', require('./routes/institutions'));
app.use('/routes/users', require('./routes/users'));


// Express will listen to the port and handle the request
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

// Confirms that database is connectd
db.query('SELECT NOW()', (err, res) => {
  if(err.error)
    return console.log(err.error);
  console.log(`PostgreSQL connected: ${res[0].now}`); // Timestamp when connected
});

module.exports = app;
