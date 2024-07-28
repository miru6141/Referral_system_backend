import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import referral from './referralroutes.js'
const app = express();
const DB_URL=process.env.DB_URL || 'mongodb://127.0.0.1:27017/referral'
mongoose.connect(DB_URL);


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// POST /referral - Create a new referral
app.use('/api',referral);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
