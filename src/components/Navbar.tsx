import { Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-primary p-2.5 rounded-xl hover:bg-primary-dark transition-colors"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* <Link to="/" className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-[#82b440] p-1">
              <img 
                src="https://fuxonjkxshicmufzbeof.supabase.co/storage/v1/object/public/logos/Logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </Link> */}

          <Link to="/cart" className="relative">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-primary-light/30 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            {cartCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 bg-[#ff3b30] text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300 font-mono">
                {cartCount}
              </div>
            )}
          </Link>
        </div>

        {isMenuOpen && (
          <div className="mt-4 pb-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 font-medium text-[14px] md:text-base hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 font-medium text-[14px] md:text-base hover:text-primary transition-colors"
              >
                Products
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 font-medium text-[14px] md:text-base hover:text-primary transition-colors"
              >
                Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
