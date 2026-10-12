/**
 * pages/WishlistPage.jsx
 */
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useWishlistStore } from '../store/wishlistStore';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  return (
    <div className="container py-8">
      <h1 className="section-title mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8">{items.length} saved items</p>
      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
