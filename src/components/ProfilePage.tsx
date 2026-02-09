import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as AuthUser, Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';
import type { Order, Bill, Client, OrderDetail } from './types';
import { getProfile, getOrdersByClientId, getOrderDetails, getBillsByClientId, getProducts } from './api';
import { toast } from 'sonner';
import './AdminPage.css';

type ProfileSection = 'profile' | 'bills' | 'orders';

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ProfileSection>('profile');
  const [profile, setProfile] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<number, OrderDetail[]>>({});
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [userProfile, userOrders, userBills] = await Promise.all([
        getProfile(Number(user.id)),
        getOrdersByClientId(Number(user.id)),
        getBillsByClientId(Number(user.id)),
      ]);
      setProfile(userProfile ?? null);
      setOrders(userOrders);
      setBills(userBills);
    } catch (error) {
      toast.error('Error al cargar los datos del perfil');
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    if (orderDetails[orderId]) {
      return;
    }
    try {
      const allProducts = await getProducts();
      const productMap = new Map(allProducts.map(p => [p.id_key, p]));

      const details = await getOrderDetails(orderId);
      const detailsWithProductNames = details.map(detail => ({
        ...detail,
        product: productMap.get(detail.product_id) || detail.product,
      }));
      setOrderDetails(prev => ({ ...prev, [orderId]: detailsWithProductNames }));
    } catch (error) {
      toast.error(`Error al cargar los detalles del pedido #${orderId}: ${error.message || error}`);
    }
  };

  if (!user) return null;

  return (
    <div className="page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Mi cuenta</h1>
          <p>Gestioná tu información personal, facturas e historial de compras.</p>
        </div>

        <div className="admin-layout">
          <aside className="admin-sidebar">
            <button
              className={`admin-menu-btn ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              Mi perfil
            </button>
            <button
              className={`admin-menu-btn ${activeSection === 'bills' ? 'active' : ''}`}
              onClick={() => setActiveSection('bills')}
            >
              Mis Facturas
            </button>
            <button
              className={`admin-menu-btn ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              Historial de Pedidos
            </button>
          </aside>

          <div className="admin-content">
            {activeSection === 'profile' && (
              <section className="admin-section">
                <h2>Mi Perfil</h2>
                <div className="admin-card">
                  {profile ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <AuthUser className="w-6 h-6 text-cyan-400" />
                        <span className="text-white">{profile.name} {profile.lastname}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-cyan-400" />
                        <span className="text-white">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-cyan-400" />
                        <span className="text-white">{profile.telephone || 'No especificado'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No se pudo cargar la información del perfil.</p>
                  )}
                </div>
              </section>
            )}

            {activeSection === 'bills' && (
              <section className="admin-section">
                <h2>Mis Facturas</h2>
                <div className="admin-card">
                  <div className="space-y-4">
                    {bills.map(bill => (
                      <div key={bill.id_key} className="p-4 bg-gray-900/50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold">Factura #{bill.bill_number}</p>
                          <p className="text-gray-400 text-sm">{new Date(bill.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">${bill.total.toFixed(2)}</p>
                          <p className="text-gray-400 text-sm">{bill.payment_type}</p>
                        </div>
                      </div>
                    ))}
                    {bills.length === 0 && <p className="text-gray-500">No tienes facturas.</p>}
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'orders' && (
              <section className="admin-section">
                <h2>Historial de Pedidos</h2>
                <div className="admin-card">
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id_key}>
                        <div className="p-4 bg-gray-900/50 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="text-white font-semibold">Pedido #{order.id_key}</p>
                            <p className="text-gray-400 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-lg">${order.total.toFixed(2)}</p>
                            <button
                              onClick={() => fetchOrderDetails(order.id_key)}
                              className="text-cyan-400 hover:text-cyan-300 transition"
                            >
                              Ver detalles
                            </button>
                          </div>
                        </div>
                        {orderDetails[order.id_key] && (
                          <div className="p-4 bg-gray-900 rounded-b-lg">
                            <h4 className="font-semibold text-white mb-2">Detalles del Pedido:</h4>
                            <ul className="space-y-2">
                              {orderDetails[order.id_key].map(detail => (
                                <li key={detail.id_key} className="flex justify-between text-gray-300">
                                  <span>{detail.quantity} x {detail.product?.name || `Producto ID: ${detail.product_id}`}</span>
                                  <span>${detail.price.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-gray-500">No has realizado ningún pedido.</p>}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
