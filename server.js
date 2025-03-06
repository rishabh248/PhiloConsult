require("dotenv").config();  // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));  // Ensure CSS, JS, and images work properly

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Schema & Model
const QuerySchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
});
const Query = mongoose.model("Query", QuerySchema);

// ✅ Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: "Outlook",  // Use Outlook SMTP
    auth: {
        user: process.env.EMAIL_USER,       // Your Outlook email
        pass: process.env.EMAIL_PASSWORD,   // App password (not regular password)
    },
});

// ✅ Form Handling & Email Sending
app.post("/submit", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Save query in database
        const newQuery = new Query({ name, email, subject, message });
        await newQuery.save();

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // You will receive the queries here
            subject: `New Query from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);

        // Respond to user
        res.status(200).send("Query submitted successfully! You will get a reply on your email.");
    } catch (error) {
        console.error("❌ Error submitting query:", error);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
