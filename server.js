const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Security Fixes
app.use(helmet());
app.disable('x-powered-by'); 
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://rishabhchoukikar2006:dVzUeOUZp3FylV9r@cluster0.mongodb.net/PhiloConsult?retryWrites=true&w=majority")
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Schema & Model
const querySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    query: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Query = mongoose.model('Query', querySchema);

// ✅ Serve HTML Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Handle Form Submission
app.post('/submit-query', async (req, res) => {
    const { name, email, query } = req.body;

    try {
        const newQuery = new Query({ name, email, query });
        await newQuery.save();
        res.send(`<h1>Thank you, ${name}!</h1><p>Your query has been saved successfully.</p>`);
    } catch (err) {
        console.error('❌ Error:', err);
        res.status(500).send('An error occurred while processing your query.');
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
