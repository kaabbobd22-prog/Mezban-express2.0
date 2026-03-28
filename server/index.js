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

// Middleware - Live URL allow kora
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vercel URL pore eikhane boshabe
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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
  const foods = await Food.find({});
  res.json(foods);
});

// Create Order + Send Email
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    // Send Confirmation Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.customerEmail,
      subject: 'Order Confirmed - Mezban Express',
      html: `<h2>Hello ${req.body.customerName},</h2>
             <p>Your order for <b>${req.body.foodName}</b> has been received.</p>
             <p>Total: ${req.body.totalPrice}tk. We will call you at ${req.body.customerPhone} soon!</p>`
    };

    transporter.sendMail(mailOptions);
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Orders (Admin)
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));