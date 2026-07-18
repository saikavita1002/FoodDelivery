import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';

const STATUS_COLORS = {
  Pending: '#f0ad4e',
  Preparing: '#5bc0de',
  'Out for Delivery': '#0275d8',
  Delivered: '#5cb85c',
  Cancelled: '#d9534f',
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await getUserOrders(user._id);
      setOrders(data);
      setLoading(false);
    };
    if (user) load();
  }, [user]);

  if (loading) return <p className="center-text">Loading orders...</p>;
  if (orders.length === 0) return <p className="center-text">You haven't placed any orders yet.</p>;

  return (
    <div className="page">
      <h2>Order History</h2>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-card-header">
            <h4>{order.restaurantId?.name || 'Restaurant'}</h4>
            <span className="status-badge" style={{ backgroundColor: STATUS_COLORS[order.status] }}>
              {order.status}
            </span>
          </div>
          <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>{item.foodName} × {item.quantity} — ₹{item.price * item.quantity}</li>
            ))}
          </ul>
          <p className="muted">Deliver to: {order.deliveryAddress}</p>
          <p className="price">Total: ₹{order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
