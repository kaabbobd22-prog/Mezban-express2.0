import mongoose from 'mongoose';

const foodSchema = mongoose.Schema({
  title: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  image: { type: String, required: true }, // URL of the image
  category: { type: String, default: 'Mejban' }
}, {
  timestamps: true
});

const Food = mongoose.model('Food', foodSchema);
export default Food;