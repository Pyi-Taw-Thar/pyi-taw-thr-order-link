import { Menu, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <Link to="/" className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[#82b440] p-1">
              <img 
                src="https://fuxonjkxshicmufzbeof.supabase.co/storage/v1/object/public/logos/Logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </Link>

          <Link to="/cart" className="relative">
            <div className="w-12 h-12 bg-white border border-blue-200 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            {cartCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-[#ff3b30] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                {cartCount}
              </div>
            )}
          </Link>
        </div>

        {isMenuOpen && (
          <div className="mt-4 pb-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                Products
              </Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                Cart
              </Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
