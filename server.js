const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // ✅ Path module for serving static files
const helmet = require('helmet'); // ✅ Security middleware
const cors = require('cors'); // ✅ Fix CORS issues
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Security Headers
app.use(helmet());
app.disable('x-powered-by'); // Remove Express default header

// ✅ Enable CORS
app.use(cors());

// ✅ Serve Static Files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
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
