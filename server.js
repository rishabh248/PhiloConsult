require("dotenv").config();  // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
// Middleware
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

app.use(cors());  // Allows cross-origin requests (if needed)
app.use(express.json());  // Parses JSON requests
app.use(express.urlencoded({ extended: true }));  // Parses form data
app.use(express.static("public"));  // Serves static files (CSS, JS)

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
        pass: process.env.EMAIL_PASS,   // App password (not regular password)
    },
});

// ✅ Form Handling & Email Sending
app.post('/submit-query', async (req, res) => {
    const { name, email, query } = req.body;

    try {
        const newQuery = new Query({ name, email, query });
        await newQuery.save();

        // Send Email Confirmation
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Thank you for your query, ${name}!`,
            text: `Hello ${name},\n\nWe received your query:\n"${query}"\n\nWe'll get back to you soon.\n\nBest regards,\nPhiloConsult Team`,
        };

        await transporter.sendMail(mailOptions);
        res.send(`<h1>Thank you, ${name}!</h1><p>Your query has been saved, and an email has been sent to you.</p>`);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('An error occurred while processing your query.');
    }
});


// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
