import { useEffect } from 'react';
import { Truck } from 'lucide-react'; // Import the Truck icon

interface PurchaseSuccessPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PurchaseSuccessPopup: React.FC<PurchaseSuccessPopupProps> = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Popup visible for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="purchase-popup">
      <div className="purchase-popup__card">
        <h2 className="purchase-popup__title">
          <Truck size={26} /> ¡Compra Exitosa!
        </h2>
        <div className="purchase-popup__animation">
          {/* Truck SVG */}
          <svg className="truck-animation" viewBox="0 0 100 50" width="100" height="50" preserveAspectRatio="xMidYMid meet">
            <g>
              {/* Truck Body */}
              <rect x="0" y="20" width="60" height="20" fill="#60A5FA" rx="5" ry="5"/>
              <rect x="60" y="15" width="20" height="25" fill="#60A5FA" rx="5" ry="5"/>
              {/* Wheels */}
              <circle cx="15" cy="40" r="8" fill="#333"/>
              <circle cx="50" cy="40" r="8" fill="#333"/>
              <circle cx="68" cy="40" r="8" fill="#333"/>
            </g>
          </svg>
          {/* Flag SVG */}
          <svg className="flag-static" viewBox="0 0 30 50" preserveAspectRatio="xMidYMid meet">
            <line x1="5" y1="5" x2="5" y2="45" stroke="#FFF" strokeWidth="3"/>
            <polygon points="5,5 25,15 5,25" fill="#EF4444"/>
          </svg>
        </div>
        <p className="purchase-popup__text">Tu pedido está en camino.</p>
        <button
          onClick={onClose}
          className="purchase-popup__button"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

