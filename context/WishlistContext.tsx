import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    // Load wishlist from storage on app start
    const loadWishlist = async () => {
      try {
        const wishlistJson = await AsyncStorage.getItem('wishlist');
        if (wishlistJson) {
          setItems(JSON.parse(wishlistJson));
        }
      } catch (error) {
        console.error('Failed to load wishlist from storage:', error);
      }
    };

    loadWishlist();
  }, []);

  // Save wishlist to storage whenever it changes
  useEffect(() => {
    const saveWishlist = async () => {
      try {
        await AsyncStorage.setItem('wishlist', JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save wishlist to storage:', error);
      }
    };

    saveWishlist();
  }, [items]);

  const addToWishlist = (product: any) => {
    if (!isInWishlist(product.id)) {
      setItems(prevItems => [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          discount: product.discount
        }
      ]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}