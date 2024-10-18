const validator = require("validator");
const bcrypt = require("bcrypt");



 const validateSignUpData = (req) => {
    const { firstName, lastName, password} =  req.body;

    
   if (!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
};

const validateEditProfileData = (req) =>{
    const ALLOWED_UPDATES = ["firstName","lastName","age", "gender", "photoUrl","about", "skills"];

    const isEditAllowed = Object.keys(req.body).every(field => ALLOWED_UPDATES.includes(field));

    return isEditAllowed;
};

const validateProfilePassword = async (req) => {

    const {currentPassword, password} = req.body;

    const loggedInUser = req.user;

    const iscurrentPasswordSame = await bcrypt.compare(currentPassword, loggedInUser.password);
    if(!iscurrentPasswordSame) {
        throw new Error("Current password does not match with our password in DB");
    }

    if(currentPassword === password) {
        throw new Error("Current password and New Password cannot be same");
    }

    return iscurrentPasswordSame;

}

module.exports = { validateSignUpData, validateEditProfileData, validateProfilePassword};


