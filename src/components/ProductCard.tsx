import { ShoppingCart, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../components/types';

interface ProductCardProps {
  product: Product;
  categoryName: string;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, categoryName, onAddToCart }: ProductCardProps) {
  return (
    <article className="product-list-card">
      <div className="product-list-card__media">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="product-list-card__placeholder">{product.name}</div>
        )}
      </div>

      <div className="product-list-card__content">
        <div className="product-list-card__meta">{categoryName}</div>
        <h3 className="product-list-card__title">{product.name}</h3>
        <p className="product-list-card__description">{product.description}</p>
        <div className="product-list-card__brand">Marca: {product.brand}</div>

        <div className="product-list-card__footer">
          <div className="product-list-card__price">${product.price.toFixed(2)}</div>
          <div className="product-list-card__actions">
            <Link to={`/product/${product.id_key}`} className="btn btn--ghost">
              <Info size={18} />
              Ver detalles
            </Link>
            <button onClick={() => onAddToCart(product)} className="btn btn--primary">
              <ShoppingCart size={18} />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}