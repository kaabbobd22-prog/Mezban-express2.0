import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from './models/Food.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const foodData = [
  { 
    title: "Single Person", 
    originalPrice: 399, 
    offerPrice: 299, 
    image: "../client/public/banner.png" 
  },
  { 
    title: "Tripple Person", 
    originalPrice: 1197, 
    offerPrice: 799, 
    image: "../client/public/banner.png" 
  },
  { 
    title: "Family 5 Person", 
    originalPrice: 1995, 
    offerPrice: 1399, 
    image: "../client/public/banner.png" 
  }
];

const importData = async () => {
  try {
    await Food.deleteMany(); // Clear old data
    await Food.insertMany(foodData);
    console.log("Data Imported Successfully! ✅");
    process.exit();
  } catch (error) {
    console.error("Error with data import:", error);
    process.exit(1);
  }
};

importData();