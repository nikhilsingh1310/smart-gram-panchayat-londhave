import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'Smart Gram Panchayat Londhave Portal API', version: '1.0.0', time: new Date() });
});

// API Routes
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Smart Gram Panchayat API Server running on http://localhost:${PORT}`);
});
