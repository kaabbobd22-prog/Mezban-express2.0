import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // লাইভ সার্ভারের জন্য URL ডাইনামিক করা
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // টোকেন পাঠানো (নিরাপত্তার জন্য)
        const token = localStorage.getItem('adminToken');
        
        const { data } = await axios.get(`${API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-mezban-maroon font-serif">Mezban Admin Panel</h1>
          <div className="bg-white px-6 py-2 rounded-full shadow-sm font-bold text-mezban-maroon border border-mezban-gold">
            Total Orders: {orders.length}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mezban-maroon"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-mezban-maroon text-white">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-orange-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{order.customerName}</td>
                    <td className="p-4 text-sm">
                      <div className="font-semibold text-blue-600">{order.customerPhone}</div>
                      <div className="text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold uppercase">
                        {order.foodName}
                      </span>
                      <span className="ml-2 font-bold">x{order.quantity}</span>
                    </td>
                    <td className="p-4 font-extrabold text-green-700">{order.totalPrice}tk</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={order.customerAddress}>
                      {order.customerAddress}
                    </td>
                    <td className="p-4 text-xs text-gray-400 font-mono">
                      {new Date(order.createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">📦</p>
                <p>No orders found yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;