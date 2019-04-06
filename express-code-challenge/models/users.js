const db = require('../database');

class Users {

  static insertUser (name, email, role, password, id, callback) {
    db.query('INSERT INTO users (name, email, role, password, inst_id) VALUES ($1, $2, $3, $4, $5)', [name, email,role, password, id], function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    })
  }

  static getUserByEmail (email, callback) {
    db.query('SELECT * FROM users WHERE email=$1', [email], function (err,res) {
      if(err.error)
        return callback(err);
      return callback(res);
    })
  }

  static getUserById (id, callback) {
    db.query('SELECT * FROM users WHERE id=$1', [id], function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    })
  }
}

module.exports = Users;
