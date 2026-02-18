import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem, Product } from '../components/types';
import { useAuth } from '../context/AuthContext';
import { createOrder, createOrderDetail, createBill, getProducts } from '../components/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onCheckoutSuccess: () => void;
  setShowPurchaseSuccessPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckoutSuccess, setShowPurchaseSuccessPopup }: CartProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Debes iniciar sesion para finalizar la compra.');
      onClose();
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('El carrito está vacío.');
      return;
    }

    try {
      // --- verifcacion de stock ---
      const products = await getProducts();
      const productsMap = new Map(products.map(p => [p.id_key, p]));
      const stockErrors = [];
      for (const item of items) {
        const productInDb = productsMap.get(item.id_key);
        if (!productInDb) {
          stockErrors.push(`El producto "${item.name}" ya no está disponible.`);
        } else if (item.quantity > productInDb.stock) {
          stockErrors.push(`No hay stock para "${item.name}". Disponible: ${productInDb.stock}, en carrito: ${item.quantity}.`);
        }
      }

      if (stockErrors.length > 0) {
        toast.error(stockErrors.join(' '));
        return;
      }

      // 1. Crear Factura
      const billData = {
        client_id: Number(user.id),
        total: total,
        bill_number: `B-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        payment_type: 1, // 1: Asumiendo 'Tarjeta'
      };
      const createdBill = await createBill(billData);

      // 2. Crear orden
      const orderData = {
        client_id: Number(user.id),
        total: total,
        status: 1, // 1: 'Pendiente'
        delivery_method: 1, // 1: 'Pickup'
        date: new Date().toISOString(),
        bill_id: createdBill.id_key,
      };
      const createdOrder = await createOrder(orderData);
      
      // 3. Crear los detalles de la orden
      const orderId = createdOrder.id_key;
      await Promise.all(
        items.map(item => {
          const detailData = {
            order_id: orderId,
            product_id: item.id_key,
            quantity: item.quantity,
            price: item.price
          };
          return createOrderDetail(detailData);
        })
      );
      
      toast.success(`¡Compra #${orderId} realizada con éxito!`);
      
      // Limpiar carrito
      onCheckoutSuccess();
      onClose(); // cerrar carrito de compras
      setShowPurchaseSuccessPopup(true); // Mostrar el popup de compra exitosa



    } catch (error) {
      console.error('Error al crear la orden:', error);
      toast.error('Error al procesar la compra. Inténtalo de nuevo.');
    }
  };


  if (!isOpen) return null;

  return (
    <>
      <div
        className="cart-overlay"
        onClick={onClose}
      />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Carrito de compras</h2>
          <button
            onClick={onClose}
            className="cart-close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="empty-state">
              Tu carrito está vacío
            </div>
          ) : (
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id_key} className="cart-item">
                  <div className="cart-item__media">
                    <div className="cart-item__image">
                      <img
                        src={item.image_url}
                        alt={item.name}
                      />
                    </div>
                  </div>
                  <div className="cart-item__info">
                    <div>
                      <h3>{item.name}</h3>
                      <p>${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id_key)}
                      className="cart-item__remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="cart-item__footer">
                    <div className="cart-qty">
                      <button onClick={() => onUpdateQuantity(item.id_key, item.quantity - 1)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id_key, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="cart-item__total">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-summary">
            <div className="cart-summary__line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary__line">
                <span>Envío</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="cart-summary__total">
                <span>Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="btn btn--primary"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}
