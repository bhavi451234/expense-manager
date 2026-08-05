const db = require("../db");

function findUserByEmail(email, callback) {
    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], callback) ;

}

function createUser(name, email, password, callback) {
    const query = 
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      db.query(query, [name, email, password] , callback);
    
}

module.exports = {
    findUserByEmail,
    createUser
};