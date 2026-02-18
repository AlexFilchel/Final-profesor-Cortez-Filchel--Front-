import { useState, useMemo, useEffect } from 'react';
import type { Product, Category } from '../components/types';
import { getProducts, getCategories, searchProducts, ProductFilter } from '../components/api';
import { ProductCard } from './ProductCard';
import { Footer } from './Footer';

interface ProductsPageProps {
  addToCart: (product: Product) => void;
  searchQuery: string;
}

export function ProductsPage({ addToCart, searchQuery }: ProductsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const filter: ProductFilter = {
          search: searchQuery,
          category_id: selectedCategory,
          min_price: minPrice ? parseFloat(minPrice) : undefined,
          max_price: maxPrice ? parseFloat(maxPrice) : undefined,
          in_stock_only: inStockOnly,
          sort_by: sortBy !== 'default' ? sortBy : undefined,
        };
        const products = await searchProducts(filter);
        setCurrentProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, minPrice, maxPrice, inStockOnly, sortBy]);

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach(cat => map.set(cat.id_key, cat.name));
    return map;
  }, [categories]);

  const categoryOptions = useMemo(() => {
    return [{ id_key: undefined, name: 'Todas' }, ...categories];
  }, [categories]);

  return (
    <div className="page">
      <div className="container products-page">
        <div className="products-layout">
          <aside className="filters-panel">
            <div className="filters-panel__header">
              <h2>Filtros</h2>
              <button type="button" className="filters-reset" onClick={() => {
                setSelectedCategory(undefined);
                setMinPrice('');
                setMaxPrice('');
                setInStockOnly(false);
                setSortBy('default');
              }}>
                Limpiar todo
              </button>
            </div>

            <div className="filters-group">
              <h3>Categoría</h3>
              <div className="filters-options">
                {categoryOptions.map(category => (
                  <label key={category.id_key} className="checkbox-row">
                    <input
                      type="radio"
                      name="category"
                      value={category.id_key}
                      checked={selectedCategory === category.id_key}
                      onChange={() => setSelectedCategory(category.id_key)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filters-group">
              <h3>Rango de precio</h3>
              <div className="filters-fields">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="filters-group">
              <h3>Otros</h3>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>Solo en stock</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="default">Ordenar por</option>
                <option value="price_asc">Precio: de menor a mayor</option>
                <option value="price_desc">Precio: de mayor a menor</option>
                <option value="name_asc">Nombre: A-Z</option>
                <option value="name_desc">Nombre: Z-A</option>
              </select>
            </div>
          </aside>

          <main className="products-content">
            <div className="section-header section-header--left">
              <h1 className="section-title">Productos</h1>
              <p className="section-subtitle">{currentProducts.length} productos encontrados</p>
            </div>

            <div className="products-list">
              {currentProducts.map(product => (
                <ProductCard
                  key={product.id_key}
                  product={product}
                  categoryName={categoryMap.get(product.category_id) || 'Desconocida'}
                  onAddToCart={addToCart}
                />
              ))}
            </div>

            {currentProducts.length === 0 && (
              <div className="empty-state">
                No se encontraron productos con los filtros seleccionados
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

