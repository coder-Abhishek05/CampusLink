

const User = require("../models/user");

async function verifyEmail(req, res) {
    const userId = req.params.id;

    try {
        // Find the user by their ID and update the isVerified field to true
        const user = await User.findOneAndUpdate(
            { _id: userId, isVerified: false },  // Find the user with matching ID and isVerified set to false
            { $set: { isVerified: true } },  // Update isVerified to true
            { new: true }  // Return the updated document
        );

        if (!user) {
            return res.status(400).send("Invalid verification link or user already verified.");
        }

        // Redirect to the success page
        res.redirect("/verified-success");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error verifying email. Please try again.");
    }
}

module.exports = { verifyEmail };

