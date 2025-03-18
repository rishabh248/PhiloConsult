const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors"); // ✅ Added for frontend access
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ✅ Submit Query
app.post("/submit-query", async (req, res) => {
  console.log("Received Query:", req.body); // ✅ Check request received
  const { name, email, query } = req.body;
  try {
      const newQuery = new Query({ name, email, query });
      await newQuery.save();

      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Thank you for your query, ${name}!`,
          text: `Hello ${name},\n\nWe received your query:\n"${query}"\n\nYou will get a reply soon.\n\nBest Regards,\nPhiloConsult Team`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Query submitted successfully!" });
  } catch (err) {
      console.error("❌ Error:", err);
      res.status(500).json({ message: "An error occurred." });
  }
});


// ✅ Get All Queries (Admin Panel)
app.get("/get-queries", async (req, res) => {
  try {
      const queries = await Query.find().sort({ date: -1 }); // ✅ Latest queries first
      res.json(queries);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching queries" });
  }
});


// ✅ Send Manual Email Reply (Admin)
app.post("/send-reply", async (req, res) => {
  try {
    const { email, query, reply } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Response to Your Query – PhiloConsult",
      text: `Hello,\n\nRegarding your query: "${query}",\n\nOur Response:\n${reply}\n\nBest Regards,\nPhiloConsult Team`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending reply" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
