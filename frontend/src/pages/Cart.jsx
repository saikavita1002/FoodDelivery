import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';

const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000/uploads';

const Cart = () => {
  const { cart, updateItem, removeItem, refreshCart } = useCart();
  const { user } = useAuth();
  console.log(cart.items);
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const total = cart.items.reduce((sum, item) => {
    const price = item.foodId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      await placeOrder(address.trim());
      await refreshCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return <p className="center-text">Your cart is empty. Go add something delicious!</p>;
  }

  return (
    <div className="page">
      <h2>Your Cart</h2>
      <div className="cart-list">
        {cart.items.map((item) => (
          <div className="cart-row" key={item.foodId?._id || item.foodId}>
            <img
              src={item.foodId?.image ? `${IMAGE_BASE}/${item.foodId.image}` : 'https://via.placeholder.com/80x80?text=Food'}
              alt={item.foodId?.foodName}
            />
            <div className="cart-row-info">
              <h4>{item.foodId?.foodName}</h4>
              <p className="muted">₹{item.foodId?.price} each</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateItem(item.foodId._id, Math.max(1, Number(e.target.value)))}
            />
            <button className="btn-link" onClick={() => removeItem(item.foodId._id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: ₹{total}</h3>
        <label>Delivery Address</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter delivery address" />
        {error && <p className="error-text">{error}</p>}
        <button onClick={handleCheckout} disabled={placing}>
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
