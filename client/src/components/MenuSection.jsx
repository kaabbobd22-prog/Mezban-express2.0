import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FoodCard from './FoodCard';

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/foods`);
        // Force same image for all
        const updatedData = data.map(item => ({ ...item, image: "/banner.png" }));
        setMenuItems(updatedData);
      } catch (error) { console.error("Error:", error); }
      finally { setLoading(false); }
    };
    fetchFoods();
  }, [API_URL]);

  return (
    <section className="bg-mezban-maroon w-full p-8 md:p-12 flex flex-col items-center min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-mezban-gold text-sm uppercase tracking-widest font-bold">Speciality</h2>
        <h1 className="text-white text-4xl md:text-5xl font-serif font-black italic">Traditional Menu</h1>
        <div className="w-24 h-1 bg-mezban-gold mx-auto mt-4 rounded-full"></div>
      </div>

      {loading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-mezban-gold py-20"></div>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 z-10 mt-10 max-w-7xl mx-auto pb-20">
          {menuItems.map((item) => (
            <FoodCard key={item._id} {...item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MenuSection;