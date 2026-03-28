import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  foodName: { type: String, required: true }, 
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  // Notun Fields
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  status: { type: String, default: 'Pending' }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;