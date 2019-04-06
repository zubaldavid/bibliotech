const db = require('../database');

class Institutions {

  static insertInstitution (name, url, emailDomain, callback) {
    db.query('INSERT INTO institutions (institution, url, email_domain) VALUES ($1, $2, $3)', [name, url, emailDomain], function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    })
  }

  static getInstitutionID (emailDomain, callback) {
    db.query('SELECT ID FROM institutions WHERE email_domain=$1', [emailDomain], function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    })
  }

}
module.exports = Institutions;
