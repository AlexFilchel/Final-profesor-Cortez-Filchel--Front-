import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Info } from 'lucide-react';
import { getProductById, searchProducts, ProductFilter } from '../components/api';
import type { Product } from '../components/types';
import { Footer } from './Footer';
import { toast } from 'sonner';

interface ProductDetailProps {
  addToCart: (product: Product) => void;
}

export function ProductDetail({ addToCart }: ProductDetailProps) {
  const { id_key } = useParams<{ id_key: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id_key) {
      fetchData(id_key);
    }
  }, [id_key]);

  const fetchData = async (productId: string) => {
    setLoading(true);
    try {
      const fetchedProduct = await getProductById(Number(productId));
      setProduct(fetchedProduct);
      if (fetchedProduct) {
        loadProductRecommendations(fetchedProduct);
      }
    } catch (error) {
      console.error("Failed to fetch product data:", error);
      toast.error('Error al cargar el producto.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadProductRecommendations = async (currentProduct: Product) => {
    if (!currentProduct.category_id) {
      setRecommendations([]);
      return;
    }

    try {
      const filter: ProductFilter = {
        category_id: currentProduct.category_id,
      };
      const products = await searchProducts(filter);
      const recommended = products
        .filter(p => p.id_key !== currentProduct.id_key)
        .slice(0, 4);
      setRecommendations(recommended);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="page page--center">
        <div className="loading-state">Cargando...</div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="page page--center">
        <p className="empty-state__title">Producto no encontrado</p>
        <button onClick={() => navigate('/products')} className="btn btn--primary">
          Volver a productos
        </button>
      </div>
    );
  }
  
  return (
    <div className="page">
      <div className="container product-detail">
        <button onClick={() => navigate(-1)} className="text-link">
          <ArrowLeft size={18} />
          Volver
        </button>

        <div className="product-detail__grid">
          <div className="product-detail__image">
            <img src={product.image_url} alt={product.name} />
          </div>

          <div className="product-detail__info">
            <h1>{product.name}</h1>
            <p className="product-detail__description">{product.description}</p>
            <div className="product-detail__price">${product.price.toFixed(2)}</div>
            <p className={`product-detail__stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn btn--primary"
            >
              <ShoppingCart size={18} />
              {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
            </button>
          </div>
        </div>

        <div className="recommendations">
          <h2>También te podría interesar</h2>
          {recommendations.length > 0 ? (
            <div className="recommendations__grid">
              {recommendations.map(recProduct => (
                <article key={recProduct.id_key} className="recommendations__card">
                  <img src={recProduct.image_url} alt={recProduct.name} />
                  <h3>{recProduct.name}</h3>
                  <span>${recProduct.price.toFixed(2)}</span>
                  <Link to={`/product/${recProduct.id_key}`} className="btn btn--ghost">
                    <Info size={16} />
                    Ver detalles
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-state">No existen recomendaciones disponibles ahora mismo.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
