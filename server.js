const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
const Mailgen = require('mailgen');

const app = express();
const prisma = new PrismaClient();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// POST /referral - Create a new referral
app.post('/referral', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Validate request data
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    try {
        // Create new referral
        const newReferral = await prisma.referral.create({
            data: { name, email, phone, message },
        });

        // Send referral email
        await sendReferralEmail(newReferral, res);

        res.status(201).json(newReferral);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /referrals - Retrieve all referrals
app.get('/referrals', async (req, res) => {
    try {
        const referrals = await prisma.referral.findMany();
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to send referral email
async function sendReferralEmail(referral, res) {
    const { GMAIL_USER, GMAIL_PASS } = process.env;
    
    let config = {
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Referral",
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: `Hi ${referral.name}`,
            intro: `${referral.message}`,
            table: {
                data: [
                    {
                        item: "Javascript Book",
                        description: "A Book to help learn javascript programming",
                        price: " 40% off if you using this refral id",
                        Referral_id:`${referral.name}40`,
                      
                    }
                ]
            },
            outro: "Looking forward to do more business"
        }
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: GMAIL_USER,
        to: referral.email,
        subject: "Referral Course",
        html: mail
    };

    try {
        await transporter.sendMail(message);
        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
