const jwt = require("jsonwebtoken") ;
require('dotenv').config();

function createTokenForUser(user){

    const payload = {
        id : user._id ,
        fullname : user.fullname,
        email : user.email,
        profileImageURL: user.profileImageURL ,
        role: user.role 
    };
    // console.log(payload) ;
    const token = jwt.sign(payload , process.env.JWT_SECRET) ;
    // console.log(token) ;
    return token ;
}

function validateToken(token){
    // console.log(token)
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};