const express = require("express") ;
const Router = express.Router() ;

const jwt = require('jsonwebtoken'); // Assuming JWT is used for cookie authentication
const User = require('../models/user'); // Adjust the path based on your structure

// Middleware to check authentication and role
const checkAdminAccess = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Replace 'token' with the name of your cookie

    // Check if the token is present
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided. Please log in.");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret

    // Find the user in the database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send("Unauthorized: Invalid token. User not found.");
    }

    // Check if the user's role is 'ADMIN'
    if (user.role !== 'ADMIN') {
      return res.status(403).send("Forbidden: You do not have access to this page.");
    }

    // Pass the user to the next middleware/route
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in admin access middleware:", error);
    res.status(401).send("Unauthorized: Invalid or expired token.");
  }
};

// Admin route
Router.get("/admin", checkAdminAccess, (req, res) => {
  res.render('admin', { user: req.user }); // Pass user data to the view if needed
});

Router.get("/" ,async (req, res)=>{
    // console.log(req.user);
    res.render("home", {
        user: req.user , // Pass the user object or null if not available
        userID: req.user ? req.user.id : null // Check if req.user is defined
    });
});

Router.get("/signup",(req,res)=>{
    res.render('signup',{error:undefined}) ;
});
Router.get("/alumini",(req,res)=>{
    res.render('alumini',{error:undefined}) ;
});

Router.get("/login",(req,res)=>{
    res.render('login',{error:undefined}) ;
});

Router.get("/check-email", (req,res)=>{
    res.render('check-email');
});

Router.get("/verified-success", (req,res)=>{
    res.render('verified-success');
});
// Router.get("/admin", (req,res)=>{
//     res.render('admin');
// });

Router.get("/college-info", (req,res)=>{
    res.render("college-info",{
        userID: req.user ? req.user.id : null
    });
});

Router.get("/contactUs", (req,res)=>{
    res.render("contactUs");
});

Router.get("/connect-seniors", (req,res)=>{
    res.render("connect-seniors",{
        userID: req.user ? req.user.id : null
    });
});
Router.get("/college-details", (req,res)=>{
    res.render("college-details",{
        userID: req.user ? req.user.id : null
    });
});
Router.get("/IT", (req,res)=>{
    res.render("IT",{
        userID: req.user ? req.user.id : null
    });
});
  
Router.get("/IT-BI", (req,res)=>{
    res.render("IT-BI",{
        userID: req.user ? req.user.id : null
    });
});
Router.get("/ECE", (req,res)=>{
    res.render("ECE",{
        userID: req.user ? req.user.id : null
    });
});

Router.get("/verified-success",(req,res)=>{
    res.render("verified-success");
})


module.exports = Router ;
