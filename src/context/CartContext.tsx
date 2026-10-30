import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PriceTier } from '../pages/products/types';
import { getTierState } from '../utils/pricing';

export interface CartItem {
  id: string;
  inventoryId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  prices: PriceTier[];
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: { id: string; inventoryId: string; name: string; price: number; unit: string; prices: PriceTier[] }, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Unit အလိုက် လက်ကားစျေး tier တွက်ချက်မှု အသစ်အတွက် storage key ကို v3 သို့ တိုးမြှင့်သည်
const CART_STORAGE_KEY = 'cart_items_v3';
const LEGACY_CART_STORAGE_KEYS = ['cart_items', 'cart_items_v2'];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      LEGACY_CART_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Unit နှင့် quantity အလိုက် သက်ရောက်မည့် ဈေးနှုန်းကို ပြန်လည်တွက်ချက်သည်
  const recalcPrice = (prices: PriceTier[], unit: string, qty: number, fallbackPrice: number): number => {
    if (!prices || prices.length === 0) return fallbackPrice;
    const tier = prices.find((p) => p.unit === unit);
    if (!tier) return fallbackPrice;
    return getTierState(tier, qty).price;
  };

  // Cart ထဲသို့ ပစ္စည်းထည့်သွင်းခြင်း (ရှိပြီးသား item တွင် ပေါင်းထည့်လျှင်လည်း ဈေးနှုန်းပြန်တွက်သည်)
  const addToCart = (product: { id: string; inventoryId: string; name: string; price: number; unit: string; prices: PriceTier[] }, quantity: number) => {
    if (quantity <= 0) return;
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => {
          if (item.id === product.id) {
            const newQty = item.quantity + quantity;
            const newPrice = recalcPrice(item.prices, item.unit, newQty, item.price);
            return { ...item, quantity: newQty, price: newPrice };
          }
          return item;
        });
      }
      const initialPrice = recalcPrice(product.prices, product.unit, quantity, product.price);
      return [...prev, { ...product, price: initialPrice, quantity, unit: product.unit, prices: product.prices }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = Math.max(1, item.quantity + delta);
      return { ...item, quantity: newQty, price: recalcPrice(item.prices, item.unit, newQty, item.price) };
    }));
  };

  const setQuantity = (id: string, quantity: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = Math.max(1, quantity);
      return { ...item, quantity: newQty, price: recalcPrice(item.prices, item.unit, newQty, item.price) };
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      setQuantity,
      clearCart, 
      totalItems, 
      totalPrice,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
