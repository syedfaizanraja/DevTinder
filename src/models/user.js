
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String
    },
    lastName : {
        type: String
    },
    emailId : {
        type: String,
        required : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email Id is not valid - " +value);
            }
        },
    },
    password : {
        type : String,
       
    },
    age : {
        type : Number,
        min: 18
    },
    gender : {
        type : String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    description :{
        type : String,
        default : "This is a Default value"
    },
    skills : {
        type : [String],
    }

}, {timestamps : true});

const User = mongoose.model("User", userSchema);

module.exports = User;