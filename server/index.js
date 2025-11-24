const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow the frontend (Vite) to talk to backend
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Ensure this is in .env

if (!MONGO_URI) {
    console.error("❌ FATAL ERROR: MONGO_URI is missing in .env file");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Schema
const ReportSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userPhoto: String,
  type: String, 
  description: String,
  lat: Number,
  lng: Number,
  status: { type: String, default: 'Pending' }, 
  timestamp: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);

// Routes
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ timestamp: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));