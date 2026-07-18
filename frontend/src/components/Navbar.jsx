import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🍔 FoodExpress</Link>
      <div className="navbar-links">
        <Link to="/">Restaurants</Link>
        {user && <Link to="/cart">Cart ({itemCount})</Link>}
        {user && <Link to="/orders">My Orders</Link>}
        {user && (user.role === 'admin' || user.role === 'restaurant_owner') && (
          <Link to="/admin">Dashboard</Link>
        )}
        {user ? (
          <>
            <Link to="/profile">{user.name}</Link>
            <button onClick={handleLogout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
