const jwt = require("jsonwebtoken");


function authenticateToken(req, res, next) {
     
    const authHeader = req.headers.authorization;

     if (!authHeader) {
     return res.status(401).json({
         message: "Access denied. No token provided"
     });
   }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        message: "Invalid token format"
    });
}

const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      
       if(err) {
         return res.status(401).json({
             message: "Invalid or expired token."
         });
       }

       req.user = decoded;
       next();
   })
}

module.exports = authenticateToken;