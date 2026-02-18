import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>HardwareHub</h3>
          <p>Tu tienda de confianza para componentes electrónicos y tecnología de alto rendimiento.</p>
          <div className="footer-contact">
            <Mail size={18} />
            <span>info@hardwarehub.com</span>
          </div>
        </div>

        <div className="footer-links">
          <h4>Enlaces utiles</h4>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/products">Productos</Link>
            </li>
            <li>
              <a href="#">Ofertas</a>
            </li>
            <li>
              <a href="#">Nosotros</a>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li>
              <a href="#">Terminos y Condiciones</a>
            </li>
            <li>
              <a href="#">Poltica de Privacidad</a>
            </li>
            <li>
              <a href="#">Politica de Devoluciones</a>
            </li>
            <li>
              <a href="#">Garantias</a>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Seguinos en</h4>
          <p>Mantenete al dia con nuestras promociones y lanzamientos.</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Youtube">
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 HardwareHub. Todos los derechos reservados.</span>
        <div className="footer-bottom__links">
          <a href="#">Términos de uso</a>
          <a href="#">Privacidad</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
