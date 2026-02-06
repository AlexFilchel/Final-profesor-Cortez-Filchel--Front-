import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Zap, TrendingUp, Award } from 'lucide-react';
import { Footer } from './Footer';
import { searchProducts } from './api';
import type { Product } from './types';
import { ProductCard } from './ProductCard';

interface HomePageProps {
    searchQuery: string;
}

export function HomePage({ searchQuery }: HomePageProps) {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            if (searchQuery.trim() === '') {
                setSearchResults([]);
                return;
            }
            setLoading(true);
            try {
                const products = await searchProducts({ search: searchQuery });
                setSearchResults(products);
            } catch (error) {
                console.error("Failed to search products:", error);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [searchQuery]);

    const addToCart = (product: Product) => {
    // Dummy function for passing to ProductCard,
    // real implementation is in App.tsx
    console.log(`Added ${product.name} to cart`);
    };

    if (searchQuery.trim() !== '') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-4xl font-bold">
                    Resultados de la Búsqueda
                </h2>
                {loading ? (
                    <p className="text-center text-white">Buscando...</p>
                ) : (
                    <div className="space-y-6">
                        {searchResults.length > 0 ? (
                            searchResults.map(product => (
                                <ProductCard
                                    key={product.id_key}
                                    product={product}
                                    categoryName={' '}
                                    onAddToCart={addToCart}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-400">No se encontraron productos para "{searchQuery}"</p>
                        )}
                    </div>
                )}
            </div>
        );
    }

  const categories = [
    {
      title: 'Placas de video',
      description: 'GPU potentes para jugar, editar y trabajar sin límites.',
      image:
        'https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Memorias RAM',
      description: 'Módulos de alta velocidad para maximizar el rendimiento de tu PC.',
      image:
        'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Periféricos',
      description: 'Teclados, mouse y accesorios diseñados para precisión y confort.',
      image:
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const featured = [
    {
      title: 'NVIDIA GeForce RTX 4070',
      price: '$699.99',
      image:
        'https://images.unsplash.com/photo-1629429407756-01cd3d7cfb38?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Kingston Fury 32GB DDR5',
      price: '$179.99',
      image:
        'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Mouse Logitech G Pro X',
      price: '$129.99',
      image:
        'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Teclado HyperX Alloy Origins',
      price: '$99.99',
      image:
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const benefits = [
    {
      title: '6 cuotas sin interés',
      description: 'En compras superiores a $30.000.',
      icon: <Zap size={28} />,
    },
    {
      title: 'Envíos a todo el país',
      description: 'Gratis en compras mayores a $50.000.',
      icon: <Award size={28} />,
    },
    {
      title: '100% originales',
      description: 'Garantía de autenticidad en cada producto.',
      icon: <Cpu size={28} />,
    },
    {
      title: 'Descuentos especiales',
      description: 'Hasta 20% pagando por transferencia.',
      icon: <TrendingUp size={28} />,
    },
  ];

  return (
    <div className="page">
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1600&q=80"
          alt="Setup de PC"
          className="hero__image"
        />
        <div className="hero__content">
          <h1>Experiencia garantizada</h1>
          <p>Disfrutá compras rápidas, seguras y sin complicaciones.</p>
          <Link to="/products" className="btn btn--primary">
            Ver productos
          </Link>
        </div>
      </section>

      <section className="benefits">
        <div className="container benefits__grid">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="benefit-card">
              <span className="benefit-card__icon">{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="categories section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Categorías principales</h2>
            <p className="section-subtitle">
              Elegí lo que necesitás para actualizar tu equipo con estilo y rendimiento.
            </p>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <article
                key={category.title}
                className="category-card"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div className="category-content">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-products section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Mas vendidos</h2>
            <p className="section-subtitle">
              Elegimos los lanzamientos más buscados para que disfrutes hasta 15% OFF pagando por transferencia.
            </p>
          </div>
          <div className="featured-grid">
            {featured.map((item) => (
              <div key={item.title} className="featured-card">
                <div className="featured-card__image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="featured-card__body">
                  <h3>{item.title}</h3>
                  <p className="featured-card__price">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="featured-actions">
            <Link to="/products" className="btn btn--outline">
              Explorar catálogo
            </Link>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}
