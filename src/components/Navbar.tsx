import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-600">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="pb-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </a>
              <a href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
                Products
              </a>
              <a href="/cart" className="text-gray-700 hover:text-blue-600 transition-colors">
                Cart
              </a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
