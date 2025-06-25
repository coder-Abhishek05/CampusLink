const nodemailer = require('nodemailer');
// Function to send verification email
async function sendVerificationEmail(user) {
    // Configure your email transporter (example using Gmail)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.OWNER_EMAIL, // Your email
            pass: process.env.PASSWORD  // Your email password
        }
    });

    // Create the verification link
    const verificationLink = `${req.protocol}://${req.get("host")}/verify-email/${user._id}`;

    // Email options
    const mailOptions = {
        from: process.env.OWNER_EMAIL,
        to: user.email,
        subject: 'Please verify your email address',
        text: `Hello ${user.fullname},\n\nPlease verify your account by clicking the following link: ${verificationLink}`,
        html: `<p>Hello ${user.fullname},</p><p>Please verify your account by clicking the following link:</p><a href="${verificationLink}">Verify Email</a>`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to', user.email);
}

module.exports = {sendVerificationEmail};