const mongoose = require("mongoose") ;
const { createHmac , randomBytes} = require("crypto");
const {createTokenForUser} = require("../services/authentication")

const userSchema = mongoose.Schema({
    fullname: {
        required:true,
        type: String,
        unique: true
    },
    email:{
        required:true,
        type: String,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    salt: {
        type: String,
    },
    profileImageURL:{
        type: String,
        default: "/images/default.png",
    },
    role: {
        type : String,
        enum : ["USER", "IIITian","ADMIN"],
        default : "USER",
    },
    isVerified: {
        type: Boolean, 
        default: false 
    },
    isBlackListed: {
        type: Boolean, 
        default: false 
    },
    type: {
        type:String
    },
    // dp: {
    //     type:String
    // },
    bio:{
        type:String
    },
    weblink:{
        type:String
    },
    facebook: {
        type:String
    },
    whatsapp:{
        type:String
    },
    twitter: {
        type:String
    },
    instagram: {
        type:String
    },
    phoneno: { 
      type: String, 
      match: [/^\d{10}$/, 'Please enter a valid phone number'] 
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type:Date
    }
},{timestamps:true});

userSchema.pre('save', function (next) {
    const user = this;

    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;

    next();
});
//
userSchema.static("matchPasswordAndGenerateToken", async function (email, password){
    const user = await this.findOne({ email });
    // console.log(user)
    if (!user) throw new Error('User not found!');

    const salt = user.salt ;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");
    // console.log(userProvidedHash) ;
    if (hashedPassword !== userProvidedHash)
        throw new Error("Incorrect Password");

    const token = createTokenForUser(user);

    return token;
});

const USER = mongoose.model("users", userSchema) ;

module.exports = USER ;