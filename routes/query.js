// routes/contact.js
const express = require("express");
const router = express.Router();
const Query = require("../models/query");

// POST route to submit a query
router.post("/submit-query", async (req, res) => {
  const { userName, email, queryText } = req.body;

  try {
    const newQuery = new Query({ userName, email, queryText });
    await newQuery.save();
    res.redirect("/"); // Redirect to a thank you page after submission
  } catch (error) {
    console.error("Error saving query:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/queries", async (req, res) => {
  try {
    // Fetch only unresolved queries
    const queries = await Query.find({ resolved: false });
    res.render("adminquery", { queries });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).send("Server Error");
  }
});


const nodemailer = require("nodemailer");

router.post("/resolve-query/:id", async (req, res) => {
  try {
    // The ID of the query to be resolved
    const queryId = req.params.id;

    // Find the query details
    const query = await Query.findById(queryId);

    if (!query) {
      return res.status(404).send("Query not found");
    }

    // Use findByIdAndUpdate to mark the query as resolved
    await Query.findByIdAndUpdate(queryId, { resolved: true });

    // Send an email to the user
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email provider
      auth: {
        user: process.env.OWNER_EMAIL , // Replace with your email
        pass: process.env.PASSWORD, // Replace with your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.OWNER_EMAIL, // Replace with your email
      to: query.email, // Email of the user who submitted the query
      subject: "Your Query Has Been Resolved",
      text: `Hello ${query.userName},\n\nYour query has been resolved.\n\nQuery: ${query.queryText}\n\nThank you for reaching out to us!\n\nBest regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");

    // Redirect to the queries page after resolving the query
    res.redirect("/query/queries");
  } catch (error) {
    console.error("Error resolving query:", error);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
