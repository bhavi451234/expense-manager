const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {

    const {name, email, password} = req.body;

    userModel.findUserByEmail(email, (err, results) => {
           
      if(err) {
            console.error(err);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
        if(results.length > 0) {
            return res.status(400).json ({
                message: "Email already registered"
            });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {

            if(err) {
                 console.log(err);
                 return res.status(500).json({
                    message: "Internal server error"
                 })
            }

             userModel.createUser(name, email, hashedPassword, (err,result) => {
                 
                 if(err) {
                     console.error(err);
                     return res.status(500).json({
                        message: "Internal server error"
                     })
                 }

                
                     return res.status(201).json({
                        message: "User registered successfully"
                     })
                 
             })
        })

    });
     
};

exports.login = (req, res) => {

      const {email, password} = req.body;

      userModel.findUserByEmail(email, (err,results) => {
          
        if(err) {
             return res.status(500).json({
                 message: " Internal server error"
             });
        }
        

        if(results.length === 0) {
             return res.status(400).json({
                 message: "Invalid email or password"
             });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
             if (err) {
               console.error(err);

               return res.status(500).json({
             message: "Internal server error"
    });
}

             if(!isMatch) {
                 return res.status(400).json({
                     message: "Invalid email or password"
                 });
             }
             
             const token = jwt.sign(
                {
                     id: user.id,
                     email: user.email
               },
               process.env.JWT_SECRET,
              {
                expiresIn: "1d"
              }

             
            );
             return res.status(200).json({
                 message: "Login successful",
                 token 
             });
        })
           
    });
};



