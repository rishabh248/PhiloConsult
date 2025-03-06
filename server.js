// ✅ Import Dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Initialize Express App
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files (CSS, JS)

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ MongoDB Schema & Model
const querySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  query: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Query = mongoose.model("Query", querySchema);

// ✅ Serve Homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ✅ Handle Form Submission
app.post("/submit-query", async (req, res) => {
  const { name, email, query } = req.body;

  try {
    // Save Query to Database
    const newQuery = new Query({ name, email, query });
    await newQuery.save();

    // ✅ Send Confirmation Email
    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for your query, ${name}!`,
      text: `Hello ${name},\n\nWe received your query:\n"${query}"\n\nWe'll get back to you soon.\n\nBest regards,\nRishabh & PhiloConsult Team`,
    };

    await transporter.sendMail(mailOptions);

    // ✅ Response After Submission
    res.send(`<h1>Thank you, ${name}!</h1><p>Your query has been saved, and an email has been sent to you.</p>`);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("An error occurred while processing your query.");
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
