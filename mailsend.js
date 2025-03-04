require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
// const path = require('path');

const cors = require('cors')

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// // Serve static files (CSS, images, JS)
// app.use(express.static(path.join(__dirname, 'public')));

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public/portfolio.html"));
// });

app.get('/',(req,res) => {
    return res.send("hello")
})

// Configure nodemailer transporter with SMTP settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Using direct SMTP
    port: 465,               // Secure SMTP port
    secure: true,            // Use SSL
    pool: true,              // Enable connection pooling for faster delivery
    auth: {
        user:  process.env.EMAIL_USER,  
        pass:  process.env.EMAIL_PASSWORD, // Use an app password for security
    }
});

// Email handler
app.post('/sendmail', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }

    const mailOptions = {
        from: email,
        to: 'veerubiradar124@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send email (No await to prevent request delay)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`[ERROR - ${new Date().toISOString()}] Email failed:`, error);
            return res.status(500).send('Error sending email');
        }
        console.log(`[SUCCESS - ${new Date().toISOString()}] Email sent: ${info.response}`);
        res.status(200).send('Email sent successfully');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});

