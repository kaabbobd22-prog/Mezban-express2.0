import React from 'react';

const FoodCard = ({ title, originalPrice, offerPrice, image }) => {
  
  const handleCardClick = () => {
    const element = document.getElementById('order-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-3xl p-5 shadow-2xl flex flex-col items-center w-56 relative mt-16 transition-all hover:-translate-y-2 group cursor-pointer"
    >
      {/* Floating Image */}
      <div className="absolute -top-14 w-32 h-32 rounded-full border-8 border-white overflow-hidden bg-mezban-cream shadow-xl z-10 transition-transform group-hover:rotate-6">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
      </div>

      <div className="mt-16 text-center w-full">
        <h3 className="text-mezban-maroon font-black text-lg italic leading-tight h-12 flex items-center justify-center">
          {title}
        </h3>
        
        <div className="mt-4 bg-orange-50/50 p-3 rounded-2xl border border-dashed border-mezban-gold/30">
          <p className="text-gray-400 text-xs line-through mb-1">{originalPrice}tk</p>
          <div className="flex flex-col">
             <span className="text-mezban-maroon text-[10px] font-bold uppercase tracking-widest">Only At</span>
             <span className="text-2xl font-black text-mezban-maroon leading-none">
               {offerPrice}<span className="text-sm ml-0.5">tk</span>
             </span>
          </div>
        </div>

        {/* Hover Hint */}
        <p className="mt-4 text-mezban-gold text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
          Click to Order Now ➔
        </p>
      </div>
    </div>
  );
};

export default FoodCard;