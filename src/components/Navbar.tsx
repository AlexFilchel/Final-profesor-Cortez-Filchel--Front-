import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Shield, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartItemsCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({ cartItemsCount, onCartClick, searchQuery, onSearchChange }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="top-banner">
        <div className="container">
          <div className="top-banner__content">
            💳 6 cuotas sin interés a partir de $30.000 • 🚚 Envío gratis en compras superiores a $50.000 • ⚡ 20% OFF pagando por transferencia
          </div>
        </div>
      </div>

      <div className="site-header__top container">
        <Link to="/" className="site-header__logo">
          HardwareHub
        </Link>

        <div className="site-header__search">
          <Search className="site-header__search-icon" size={18} />
          <input
            type="text"
            placeholder="Buscá por productos, marcas y categorías"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="site-header__actions">
          <Link to="/profile" className="site-header__action">
            <User size={20} />
            <span className="site-header__action-label">Mi cuenta</span>
          </Link>
          <button className="site-header__action site-header__action-btn" onClick={onCartClick}>
            <span className="site-header__action-icon">
              <ShoppingCart size={20} />
            </span>
            <span className="site-header__action-label">Carrito</span>
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </button>
          {user ? (
            <button className="site-header__action site-header__action-btn" onClick={logout} title="Cerrar Sesión">
              <LogOut size={20} />
              <span className="site-header__action-label">Salir</span>
            </button>
          ) : (
            <button
              className="site-header__action site-header__action-btn"
              onClick={() => navigate('/login')}
              title="Iniciar Sesión"
            >
              <LogIn size={20} />
              <span className="site-header__action-label">Ingresar</span>
            </button>
          )}
        </div>
      </div>

      <div className="site-header__bottom">
        <div className="container">
          <ul className="main-nav">
            <li>
              <Link to="/" className="main-nav__link">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/products" className="main-nav__link">
                Productos
              </Link>
            </li>
            {user?.isAdmin && (
              <li>
                <Link to="/admin" className="main-nav__link main-nav__admin" title="Panel de Administración">
                  <Shield size={16} />
                  Panel admin
                </Link>
              </li>
            )}
            <li className="main-nav__item main-nav__item--faq">
              <button type="button" className="main-nav__link main-nav__link--button">
                Preguntas frecuentes
              </button>
              <div className="faq-dropdown" aria-hidden="true">
                <article className="faq-dropdown__item">
                  <h4>¿Cuánto tarda en llegar mi pedido?</h4>
                  <p>Tu pedido llega entre 2 y 7 días hábiles según tu ubicación.</p>
                </article>
                <article className="faq-dropdown__item">
                  <h4>¿Puedo devolver un producto si no me gustó?</h4>
                  <p>Sí, podés devolverlo dentro de los primeros 10 días en perfecto estado.</p>
                </article>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
