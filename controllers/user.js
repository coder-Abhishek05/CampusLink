const User = require("../models/user") ;
const nodemailer = require("nodemailer");
const {sendVerificationEmail} = require("../services/verify_mail");


async function handleSignup(req, res) {
    const { fullname, email, password, role, adminKey } = req.body;

    try {
        // If the user selects "Admin", validate the adminKey
        if (role === 'ADMIN') {
            if (adminKey !== process.env.ADMIN_KEY) {
                return res.status(400).send("Invalid Admin Key.");
            }
        }

        // Create the user in the database with isVerified set to false
        const user = await User.create({
            fullname,
            email,
            password,
            role,  // Storing the role (User, IIITian, Admin)
            isVerified: false  // Set isVerified to false initially
        });

        //console.log(user);
        // Create a verification URL with the user's ID
        const verificationUrl = `${req.protocol}://${req.get("host")}/verify-email/${user._id}`;
        // console.log(verificationUrl);

        // Send the verification email
        const transporter = nodemailer.createTransport({
            service: "Gmail",  // You can use any other service like SendGrid, Mailgun, etc.
            auth: {
                user: process.env.OWNER_EMAIL, // Your email
                pass: process.env.PASSWORD  // Your email password
            }
        });
        // console.log(transporter);

        const mailOptions = {
            from: process.env.OWNER_EMAIL,
            to: user.email,
            subject: "Verify Your Email",
            text: `Please verify your email by clicking the link: ${verificationUrl}`,
            html: `<p>Thank you for registering! Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`
        };

        await transporter.sendMail(mailOptions);

        // Redirect or send a response after signup
        // console.log("new");
        res.redirect("/check-email");  // Redirect user to a page telling them to check their email
    } catch (error) {
        // console.error(err);
        // res.status(500).send("Error signing up. Please try again.");
        return res.render("signup", {
            error: "An error occurred during signup.",
        });
    }
}



async function handleLogin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", {
                error: "Incorrect Email or Password",
            });
        }

        if (user.isBlackListed){
            return res.render("login", {
                error: "The user is BlackListed.",
            });
        }

        if (!user.isVerified) {
            // await sendVerificationEmail(user); // Send the verification email
            // Create a verification URL with the user's ID
            const verificationUrl = `${req.protocol}://${req.get("host")}/verify-email/${user._id}`;

            // Send the verification email
            const transporter = nodemailer.createTransport({
                service: "Gmail",  // You can use any other service like SendGrid, Mailgun, etc.
                auth: {
                    user: process.env.OWNER_EMAIL, // Your email
                    pass: process.env.PASSWORD  // Your email password
                }
            });

            const mailOptions = {
                from: process.env.OWNER_EMAIL,
                to: user.email,
                subject: "Verify Your Email",
                text: `Please verify your email by clicking the link: ${verificationUrl}`,
                html: `<p>Thank you for registering! Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`
            };

            await transporter.sendMail(mailOptions);
                return res.render("login", {
                    error: "Your account is not verified. A verification email has been sent.",
                });
        }

        const token = await User.matchPasswordAndGenerateToken(email, password);
    
        if (user.role === "ADMIN") {
            return res.cookie("token", token).redirect("/admin");
        }
    
        return res.cookie("token", token).redirect("/");

    } catch (error) {
        //console.error(error);
        return res.render("login", {
            error: "An error occurred during login.",
        });
    }
}

module.exports = {handleLogin , handleSignup} ;