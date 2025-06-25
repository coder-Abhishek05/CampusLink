const express = require("express") ;
const Router = express.Router() ;
const {handleLogin , handleSignup} = require("../controllers/user") ;
// const {checkVerification} = require("../middlewares/verify_mail");

Router.post("/signup" , handleSignup) ;

Router.post("/login", handleLogin) ;

Router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect("/");
});

// Middleware to check if user is logged in (optional)



module.exports = Router ;