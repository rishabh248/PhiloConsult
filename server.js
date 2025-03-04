const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000; // Render ke PORT ko use karo


// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ MongoDB Connection (Local)
mongoose.connect("mongodb://127.0.0.1:27017/philoConsult", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to Local MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));




// ✅ Define MongoDB S
