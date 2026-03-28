import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Hero = () => {
  const [count, setCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(299);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', number: '', address: '' });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    let price = (count === 3) ? 799 : (count === 5) ? 1399 : count * 299;
    setTotalPrice(price);
  }, [count]);

  const handleFinalOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Sending your order...');
    try {
      const orderData = {
        foodName: `Mejban Pack (${count} Person)`,
        quantity: count,
        totalPrice: totalPrice,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.number,
        customerAddress: formData.address
      };
      await axios.post(`${API_URL}/api/orders`, orderData);
      toast.success("Order Placed Successfully!", { id: toastId });
      setShowModal(false);
      setCount(1);
      setFormData({ name: '', email: '', number: '', address: '' });
    } catch (error) {
      toast.error("Order failed. Try again.", { id: toastId });
    } finally { setLoading(false); }
  };

  return (
    <section id="order-section" className="bg-mezban-cream w-full p-8 md:p-16 flex flex-col justify-center min-h-screen scroll-mt-10">
      <div className="mb-8">
         <div className="w-20 h-20 bg-mezban-maroon rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold border-2 border-mezban-gold shadow-md">
            <span className="text-xl">🏍️</span>
            <span>MEZBAN</span>
            <span>EXPRESS</span>
         </div>
      </div>

      <h1 className="text-5xl md:text-7xl font-serif font-black text-mezban-maroon mb-6 leading-tight">
        Order <span className="text-mezban-gold">Chittagong</span> Original Mejban.
      </h1>

      <div className="flex flex-wrap items-center gap-6 mt-4">
        <div className="flex items-center border-2 border-mezban-gold/20 rounded-full bg-white px-4 py-2 shadow-sm">
          <button onClick={() => setCount(Math.max(1, count - 1))} className="text-gray-400 hover:text-mezban-maroon text-2xl px-2 font-bold">-</button>
          <span className="mx-6 font-black text-2xl w-8 text-center text-mezban-maroon">{count}</span>
          <button onClick={() => setCount(count + 1)} className="text-mezban-maroon text-2xl px-2 font-bold">+</button>
        </div>

        <button onClick={() => setShowModal(true)} className="bg-mezban-maroon text-white pl-2 pr-10 py-3 rounded-full flex items-center gap-4 shadow-xl hover:bg-black transition-all active:scale-95">
          <div className="bg-mezban-gold p-3 rounded-full text-white">🛒</div>
          <span className="font-bold text-xl tracking-tight">Buy Now ({totalPrice}tk)</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-6 text-2xl font-bold text-gray-400 hover:text-red-500">✕</button>
            <h2 className="text-2xl font-black text-mezban-maroon mb-6">Confirm Order</h2>
            <form onSubmit={handleFinalOrder} className="space-y-4">
              <input type="text" placeholder="Your Name" required className="w-full border-2 p-4 rounded-2xl outline-none focus:border-mezban-gold" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Your Email" required className="w-full border-2 p-4 rounded-2xl outline-none focus:border-mezban-gold" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="text" placeholder="Phone Number" required className="w-full border-2 p-4 rounded-2xl outline-none focus:border-mezban-gold" onChange={(e) => setFormData({...formData, number: e.target.value})} />
              <textarea placeholder="Delivery Address" required className="w-full border-2 p-4 rounded-2xl outline-none focus:border-mezban-gold h-24" onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
              <button type="submit" disabled={loading} className="w-full bg-mezban-maroon text-white py-4 rounded-2xl font-bold hover:bg-black transition-all">
                {loading ? "Processing..." : `Confirm Order - ${totalPrice}tk`}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;