// models/Query.js
const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  queryText: {
    type: String,
    required: true
  },
  resolved: {
    type: Boolean,
    default: false // Default is not resolved
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Query = mongoose.model("Query", querySchema);

module.exports = Query;
