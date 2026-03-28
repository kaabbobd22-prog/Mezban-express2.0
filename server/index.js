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

// --- CORS CONFIGURATION (FIXED) ---
const allowedOrigins = [
  "https://mezban-express2-0.vercel.app", // Apnar Vercel URL
  "http://localhost:5173",                // Local development er jonno
  "http://localhost:5174"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
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
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching foods" });
  }
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
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #800000;">Hello ${req.body.customerName},</h2>
          <p>Your order for <b>${req.body.foodName}</b> has been received.</p>
          <p><b>Total Price:</b> ${req.body.totalPrice} tk</p>
          <p><b>Quantity:</b> ${req.body.quantity}</p>
          <p>We will call you at <b>${req.body.customerPhone}</b> soon for delivery!</p>
          <hr />
          <p style="font-size: 12px; color: #777;">Thank you for choosing Mezban Express.</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions);
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
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