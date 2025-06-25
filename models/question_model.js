const mongoose = require("mongoose") ;

const Question = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    question:{
        type:String,
        required: true ,
    },
    like:{
        type: Number,
        default: 0,
    },
    answered: {
        type: Boolean,
        default: false,
    },
    answerCount: {
        type: Number,
        default: 0,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: "users",
    },
},{timestamps: true});

const QUESTION = mongoose.model("Question" , Question) ;

module.exports = QUESTION ;