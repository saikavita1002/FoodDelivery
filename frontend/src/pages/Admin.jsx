import { useState, useEffect } from 'react';
import AdminRestaurants from './Admin/AdminRestaurants';
import AdminMenu from './Admin/AdminMenu';
import AdminOrders from './Admin/AdminOrders';
import { getRestaurants } from '../services/restaurantService';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('restaurants'); // 'restaurants' | 'orders'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [myRestaurants, setMyRestaurants] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await getRestaurants();
      const mine = user.role === 'admin' ? data : data.filter((r) => (r.ownerId?._id || r.ownerId) === user._id);
      setMyRestaurants(mine);
    };
    load();
  }, [user, tab]);

  return (
    <div className="page">
      <h2>Dashboard</h2>
      <div className="tabs">
        <button className={tab === 'restaurants' ? 'tab active' : 'tab'} onClick={() => { setTab('restaurants'); setSelectedRestaurant(null); }}>
          Restaurants &amp; Menu
        </button>
        <button className={tab === 'orders' ? 'tab active' : 'tab'} onClick={() => setTab('orders')}>
          Orders
        </button>
      </div>

      {tab === 'restaurants' && (
        selectedRestaurant ? (
          <AdminMenu restaurant={selectedRestaurant} onBack={() => setSelectedRestaurant(null)} />
        ) : (
          <AdminRestaurants onSelectRestaurant={setSelectedRestaurant} />
        )
      )}

      {tab === 'orders' && <AdminOrders restaurants={myRestaurants} />}
    </div>
  );
};

export default Admin;
