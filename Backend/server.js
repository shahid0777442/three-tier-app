require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Model
const Entry = mongoose.model('Entry', new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  notes: { type: String, default: '' },
  done: { type: Boolean, default: false },
}, { timestamps: true }));

// Routes (CRUD)
app.get('/api/entries', async (req, res) => {
  res.json(await Entry.find().sort({ createdAt: -1 }));
});

app.post('/api/entries', async (req, res) => {
  try {
    res.status(201).json(await Entry.create(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/entries/:id', async (req, res) => {
  const updated = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

app.delete('/api/entries/:id', async (req, res) => {
  await Entry.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log('API on port ' + (process.env.PORT || 5000)));
  })
  .catch((err) => console.error('MongoDB connection failed:', err.message));
