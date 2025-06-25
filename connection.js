// const mongoose = require("mongoose") ;

// async function connectDBtoWeb(url) {
//     return mongoose.connect(process.env.MONGO_URL, {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//         }).then(() => {
//           console.log('MongoDB Connected');
//         }).catch((err) => {
//           console.error('MongoDB connection error:', err);
//         });
// }

// module.exports = {connectDBtoWeb} ;


const mongoose = require("mongoose");

async function connectDBtoWeb() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

module.exports = { connectDBtoWeb };