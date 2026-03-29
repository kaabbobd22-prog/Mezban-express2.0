import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import Food from './models/Food.js';
import Order from './models/Order.js';

dotenv.config();

const app = express();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  "https://mezban-express2-0.vercel.app", 
  "http://localhost:5173", 
  "http://localhost:5174"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy Error'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// --- EMAIL TRANSPORTER (Fixed for Production) ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Must be 16-digit App Password
  }
});

// Verify Mail Server Connection on Startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mail Server Error:", error);
  } else {
    console.log("✅ Mail Server is Ready");
  }
});

// --- ROUTES ---

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: "Invalid Credentials" });
});

// Get Menu
app.get('/api/foods', async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching foods" });
  }
});

// Create Order + Send Email (Async/Await handled)
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    // Prepare Email
    const mailOptions = {
      from: `"Mezban Express" <${process.env.EMAIL_USER}>`,
      to: req.body.customerEmail,
      subject: 'Order Confirmed - Mezban Express',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 15px; max-width: 500px; margin: auto;">
          <h2 style="color: #800000; text-align: center;">Order Confirmed! 🍖</h2>
          <p>Hello <b>${req.body.customerName}</b>,</p>
          <p>Thank you for choosing Mezban Express. We have received your order.</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 10px;">
            <p style="margin: 5px 0;"><b>Item:</b> ${req.body.foodName}</p>
            <p style="margin: 5px 0;"><b>Quantity:</b> ${req.body.quantity}</p>
            <p style="margin: 5px 0;"><b>Total Price:</b> ${req.body.totalPrice} tk</p>
          </div>
          <p>We will call you at <b>${req.body.customerPhone}</b> for delivery confirmation.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777; text-align: center;">Mezban Express - The Taste of Chittagong</p>
        </div>
      `
    };

    // Send Mail
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to:", req.body.customerEmail);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Order Error:", error);
    // Even if email fails, we send the order response but log the error
    res.status(201).json({ 
      message: "Order placed, but there was an issue sending the email.", 
      order: savedOrder 
    });
  }
});

// Get All Orders (Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));