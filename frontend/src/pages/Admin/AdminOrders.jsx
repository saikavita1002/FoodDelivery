import { useEffect, useState } from 'react';
import { getRestaurantOrders, updateOrderStatus } from '../../services/orderService';

const STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const AdminOrders = ({ restaurants }) => {
  const [restaurantId, setRestaurantId] = useState(restaurants[0]?._id || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (id) => {
    if (!id) return;
    setLoading(true);
    const { data } = await getRestaurantOrders(id);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(restaurantId); }, [restaurantId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    load(restaurantId);
  };

  if (restaurants.length === 0) return <p>You don't have any restaurants yet — add one first.</p>;

  return (
    <div>
      <h3>Incoming Orders</h3>
      <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
        {restaurants.map((r) => (
          <option key={r._id} value={r._id}>{r.name}</option>
        ))}
      </select>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet for this restaurant.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-card-header">
              <h4>{order.userId?.name} — {order.userId?.mobile}</h4>
              <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>{item.foodName} × {item.quantity}</li>
              ))}
            </ul>
            <p className="price">Total: ₹{order.totalAmount}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
