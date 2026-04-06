import { Menu, ShoppingCart, LogOut } from "lucide-react";


import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";


export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { cartCount } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user_phone");
    window.location.reload();
  };


  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
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

          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="relative group focus:outline-none"
              title="Logout"
            >

              <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:border-red-100 hover:bg-red-50 transition-all">
                <LogOut className="w-5 h-5 md:w-6 md:h-6 text-gray-500 group-hover:text-red-500 transition-colors" />
              </div>
            </button>


            <Link to="/cart" className="relative group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-primary-light/30 rounded-xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              {cartCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-[#ff3b30] text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300 font-mono text-center">
                  {cartCount}
                </div>
              )}
            </Link>
          </div>

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
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="text-red-600 font-medium text-[14px] md:text-base hover:bg-red-50 p-2 rounded-lg transition-all flex items-center w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout (ထွက်မယ်)
              </button>


            </div>
          </div>
        )}
      </div>
      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
}

