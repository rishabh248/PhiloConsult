const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 50000, // Avoid timeout issues
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Schema & Model
const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  query: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Query = mongoose.model("Query", querySchema);

// ✅ Outlook SMTP Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Prevents certificate issues
  },
});

// ✅ Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit-query", async (req, res) => {
  const { name, email, query } = req.body;

  try {
    const newQuery = new Query({ name, email, query });
    await newQuery.save();

    // ✅ Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for your query, ${name}!`,
      text: `Hello ${name},\n\nWe received your query:\n"${query}"\n\nYou will get a reply on your email soon.\n\nBest Regards,\nPhiloConsult Team`,
    };

    await transporter.sendMail(mailOptions);

    res.send(
      `<h1>Thank you, ${name}!</h1><p>Your query has been saved, and an email has been sent to you. You will get a reply on your email soon.</p>`
    );
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("An error occurred while processing your query.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
