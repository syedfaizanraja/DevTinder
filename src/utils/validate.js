const validator = require("validator");



 const validateSignUpData = (req) => {
    const { firstName, lastName, password} =  req.body;

    
   if (!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
};

module.exports = { validateSignUpData};


