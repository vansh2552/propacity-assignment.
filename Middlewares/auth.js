const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  // Authentication logic
  const authHeader = req.headers['authorization'];
  
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Missing Authorization header' });
    }
  
    const token = authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, message: ' Missing token' });
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.error('JWT Verification Error:', err);
        return res.status(403).json({ success: false, message: 'Invalid token' });
      }
  
      req.user = user;
      next();
    });
}

module.exports = authenticateToken;