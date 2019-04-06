const db = require('../database');

class Books {

  static getBooksById (id, callback) {
    db.query('SELECT * from books where inst_id=$1', [id], function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    })
  }

  static getAllBooks (callback) {
    db.query('SELECT * from books', function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    })
  }

}
module.exports = Books;
