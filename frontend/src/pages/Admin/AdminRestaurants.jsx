import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRestaurants, createRestaurant, deleteRestaurant } from '../../services/restaurantService';

const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000/uploads';

const AdminRestaurants = ({ onSelectRestaurant }) => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', phone: '',cuisine: '', openingHours: '' });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await getRestaurants();
    const mine = user.role === 'admin' ? data : data.filter((r) => r.ownerId === user._id || r.ownerId?._id === user._id);
    setRestaurants(mine);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('address', form.address);
      fd.append('phone', form.phone);
      fd.append('cuisine', form.cuisine);
      fd.append('openingHours', form.openingHours);
      if (imageFile) fd.append('image', imageFile);
      await createRestaurant(fd);
      setForm({ name: '', address: '', phone: '',cuisin:'',openingHours:'' });
      setImageFile(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create restaurant');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant and all its menu items?')) return;
    await deleteRestaurant(id);
    load();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <form className="inline-form" onSubmit={handleCreate}>
        <h3>Add Restaurant</h3>
        {error && <p className="error-text">{error}</p>}
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input placeholder="Cuisine Type"value={form.cuisine}onChange={(e) => setForm({ ...form, cuisine: e.target.value })}required/>
        <input placeholder="Opening Hours"value={form.openingHours}onChange={(e) => setForm({ ...form, openingHours: e.target.value })}required/>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        <button type="submit">Add Restaurant</button>
      </form>

      <div className="grid">
        {restaurants.map((r) => (
          <div className="card" key={r._id}>
            <img src={r.image ? `${IMAGE_BASE}/${r.image}` : 'https://via.placeholder.com/200x140?text=Restaurant'} alt={r.name} />
            <h4>{r.name}</h4>
            <p className="muted">{r.address}</p>
            <button onClick={() => onSelectRestaurant(r)}>Manage Menu</button>
            <button className="btn-danger" onClick={() => handleDelete(r._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRestaurants;
