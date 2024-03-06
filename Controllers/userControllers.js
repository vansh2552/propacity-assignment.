const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require("../database")
const insertUserQuery = require("../queries/insertUser")
const userExists = require("../queries/userExists")
const secret_key = process.env.SECRET_KEY

async function registerUser(req,res){
    const {email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        const result = await database.query(insertUserQuery, [email, hashedPassword]);
        res.json(result.rows[0]);

    }
    catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

async function loginUser(req,res){
    const {email, password } = req.body;
    try {
        const result = await database.query(userExists, [email]);
    
        if (result.rows.length === 0) {
          res.status(401).json({ success: false, message: 'User not found.' });
          return;
        }
    
        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
        const IDMatch = email === result.rows[0].email;
        
        const token = jwt.sign({ email: result.rows[0].email,password:password }, secret_key);
        
    
        if (passwordMatch && IDMatch) {
          res.json({ success: true, message: 'Authentication successful' ,token: token });
        } else {
          res.status(401).json({ success: false, message: ' Incorrect Email ID or password' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
      }
}

module.exports = {registerUser,loginUser} 