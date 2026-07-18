import { useEffect, useState } from 'react';
import { getFoods, addFood, deleteFood, updateFood } from '../../services/foodService';

const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000/uploads';

const AdminMenu = ({ restaurant, onBack }) => {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({ foodName: '', price: '', category: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await getFoods(restaurant._id);
    setFoods(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      fd.append('restaurantId', restaurant._id);
      if (imageFile) fd.append('image', imageFile);
      await addFood(fd);
      setForm({ foodName: '', price: '', category: '', description: '' });
      setImageFile(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add food item');
    }
  };

  const handleToggleAvailable = async (food) => {
    const fd = new FormData();
    fd.append('isAvailable', !food.isAvailable);
    await updateFood(food._id, fd);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    await deleteFood(id);
    load();
  };

  if (loading) return <p>Loading menu...</p>;

  return (
    <div>
      <button className="btn-link" onClick={onBack}>&larr; Back to restaurants</button>
      <h3>Menu for {restaurant.name}</h3>

      <form className="inline-form" onSubmit={handleAdd}>
        {error && <p className="error-text">{error}</p>}
        <input placeholder="Food name" value={form.foodName} onChange={(e) => setForm({ ...form, foodName: e.target.value })} required />
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min={0} />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        <button type="submit">Add Food Item</button>
      </form>

      <div className="grid">
        {foods.map((food) => (
          <div className="card" key={food._id}>
            <img src={food.image ? `${IMAGE_BASE}/${food.image}` : 'https://via.placeholder.com/200x140?text=Food'} alt={food.foodName} />
            <h4>{food.foodName}</h4>
            <p className="muted">{food.category} — ₹{food.price}</p>
            <p className="muted">{food.isAvailable ? '✅ Available' : '❌ Unavailable'}</p>
            <button onClick={() => handleToggleAvailable(food)}>
              {food.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
            </button>
            <button className="btn-danger" onClick={() => handleDelete(food._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;
