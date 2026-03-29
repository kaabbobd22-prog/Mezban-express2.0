import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Hero = () => {
  const [count, setCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(299);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', number: '', address: '' });
  const API_URL = import.meta.env.VITE_API_URL || "https://mezban-express2-0.onrender.com";

  // Price Logic with Triple Correction
  useEffect(() => {
    let price;
    if (count === 3) {
      price = 799; // Triple 799tk (Fixed)
    } else if (count === 5) {
      price = 1399; // Family 1399tk
    } else {
      price = count * 299; // Single 299tk
    }
    setTotalPrice(price);
  }, [count]);

  const handleFinalOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Sending your order...');
    
    try {
      const orderData = {
        foodName: count === 3 ? "Triple Mezban Pack" : count === 5 ? "Family Mezban Pack" : `Mezban Pack (${count} Person)`,
        quantity: count,
        totalPrice: totalPrice,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.number,
        customerAddress: formData.address
      };

      // Backend API Call (Emails are sent from backend /api/orders)
      await axios.post(`${API_URL}/api/orders`, orderData);
      
      toast.success("Order Placed! Check your Email.", { id: toastId });
      setShowModal(false);
      setCount(1);
      setFormData({ name: '', email: '', number: '', address: '' });
    } catch (error) {
      console.error(error);
      toast.error("Order failed. Try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order-section" className="bg-mezban-cream w-full p-8 md:p-16 flex flex-col justify-center min-h-screen scroll-mt-10 relative overflow-hidden">
      
      {/* Branding Logo */}
      <div className="mb-8 animate-bounce">
         <div className="w-20 h-20 bg-mezban-maroon rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold border-2 border-mezban-gold shadow-lg">
            <span className="text-xl">🏍️</span>
            <span>MEZBAN</span>
            <span>EXPRESS</span>
         </div>
      </div>

      {/* Main Heading & Subline */}
      <h1 className="text-5xl md:text-7xl font-serif font-black text-mezban-maroon mb-2 leading-tight">
        Order <span className="text-mezban-gold">Chittagong</span> <br />
        Original Mezban.
      </h1>
      <p className="text-mezban-maroon/60 font-medium tracking-[0.2em] uppercase text-sm mb-8">
        Authentic Taste Delivered to your Doorstep
      </p>

      {/* Special Offer Badge */}
      {(count === 3 || count === 5) && (
        <div className="bg-mezban-gold text-mezban-maroon font-black px-4 py-1 rounded-full text-xs w-fit mb-4 animate-pulse">
          🔥 SPECIAL OFFER ACTIVATED
        </div>
      )}

      {/* Order Controls */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center border-2 border-mezban-gold/20 rounded-full bg-white px-4 py-2 shadow-sm">
          <button onClick={() => setCount(Math.max(1, count - 1))} className="text-gray-400 hover:text-mezban-maroon text-2xl px-2 font-bold">-</button>
          <span className="mx-6 font-black text-2xl w-10 text-center text-mezban-maroon">{count}</span>
          <button onClick={() => setCount(count + 1)} className="text-mezban-maroon text-2xl px-2 font-bold">+</button>
        </div>

        <button onClick={() => setShowModal(true)} className="bg-mezban-maroon text-white pl-2 pr-10 py-4 rounded-full flex items-center gap-4 shadow-2xl hover:bg-black transition-all active:scale-95 group">
          <div className="bg-mezban-gold p-3 rounded-full text-white group-hover:rotate-12 transition-transform">🛒</div>
          <span className="font-bold text-xl tracking-tight">Buy Now ({totalPrice}tk)</span>
        </button>
      </div>

      {/* Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full relative shadow-2xl border-4 border-mezban-gold/10">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-2xl font-bold text-gray-300 hover:text-red-500 transition-colors">✕</button>
            
            <h2 className="text-3xl font-black text-mezban-maroon mb-2">Confirm Order</h2>
            <p className="text-gray-500 text-sm mb-6">Enter details to receive confirmation email.</p>

            <form onSubmit={handleFinalOrder} className="space-y-4">
              <input type="text" placeholder="Full Name" required className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-mezban-gold transition-colors" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email Address" required className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-mezban-gold transition-colors" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="text" placeholder="Phone Number" required className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-mezban-gold transition-colors" onChange={(e) => setFormData({...formData, number: e.target.value})} />
              <textarea placeholder="Delivery Address" required className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-mezban-gold h-24 resize-none" onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
              
              <button type="submit" disabled={loading} className="w-full bg-mezban-maroon text-white py-4 rounded-2xl font-black text-lg hover:bg-black shadow-lg transition-all disabled:bg-gray-400">
                {loading ? "Processing..." : `Confirm - ${totalPrice}tk`}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;