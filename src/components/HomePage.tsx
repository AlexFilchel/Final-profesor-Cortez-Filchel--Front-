import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, HardDrive, Monitor, Zap, TrendingUp, Award } from 'lucide-react';
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
      title: 'Procesadores',
      description: 'Intel y AMD de última generación para tu setup.',
      image:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Almacenamiento',
      description: 'SSD y HDD con alto rendimiento para tus proyectos.',
      image:
        'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Monitores',
      description: 'Pantallas ultra nítidas para gaming y trabajo.',
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const featured = [
    {
      title: 'Teclado Mecánico RGB',
      price: '$29.99',
      image:
        'https://images.unsplash.com/photo-1645802106095-765b7e86f5bb?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Mouse Gaming Pro',
      price: '$79.99',
      image:
        'https://images.unsplash.com/photo-1628832307345-7404b47f1751?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Audífonos Surround 7.1',
      price: '$49.99',
      image:
        'https://images.unsplash.com/photo-1677086813101-496781a0f327?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Silla Ergonómica Pro',
      price: '$299.99',
      image:
        'https://images.unsplash.com/photo-1636487658609-28282bb5a3a0?auto=format&fit=crop&w=1200&q=80',
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
          src="https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=1600&q=80"
          alt="Setup de PC"
          className="hero__image"
        />
        <div className="hero__content">
          <h1>Componentes de alta calidad</h1>
          <p>Construí la PC de tus sueños con marcas líderes y soporte experto.</p>
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
            <h2 className="section-title">Productos destacados</h2>
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

      <section className="callout">
        <div className="container callout__content">
          <div>
            <h2>Envíos gratis</h2>
            <p>En compras mayores a $50.000. Coordiná entregas rápidas en todo el país.</p>
          </div>
          <Link to="/products" className="btn btn--primary">
            Comprar ahora
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
