const express = require("express") ;
const Router = express.Router() ;
const User = require("../models/user") ;
const Query = require("../models/query");

Router.get("/user", async(req, res)=>{
    const users = await User.find() ;
    res.render('power1',{
        users: users,
    });
});

// GET route for admin to view all unresolved queries
Router.get("/queries", async (req, res) => {
  try {
    // Fetch only unresolved queries
    const queries = await Query.find({ resolved: false });
    res.render("admin/queries", { queries });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).send("Server Error");
  }
});

// PUT route to resolve a query using findByIdAndUpdate
Router.post("/resolve-query/:id", async (req, res) => {
  try {
    // The ID of the query to be resolved
    const queryId = req.params.id;
    
    // Use findByIdAndUpdate to mark the query as resolved
    await Query.findByIdAndUpdate(queryId, { resolved: true });
    
    // Redirect to the queries page after resolving the query
    res.redirect("/admin/queries");
  } catch (error) {
    console.error("Error resolving query:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = Router ;