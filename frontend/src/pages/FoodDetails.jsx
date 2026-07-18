import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFoodById } from '../services/foodService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000/uploads';

const FoodDetails = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      const { data } = await getFoodById(id);
      setFood(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAdd = async () => {
    if (!user) {
      alert('Please login to add items to your cart');
      return;
    }
    await addItem(food._id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) return <p className="center-text">Loading...</p>;
  if (!food) return <p className="center-text">Food item not found.</p>;

  return (
    <div className="page food-details">
      <img
        src={food.image ? `${IMAGE_BASE}/${food.image}` : 'https://via.placeholder.com/400x260?text=Food'}
        alt={food.foodName}
      />
      <div>
        <h2>{food.foodName}</h2>
        <p className="muted">{food.category}</p>
        <p>{food.description}</p>
        <p className="price">₹{food.price}</p>
        {food.restaurantId && (
          <p className="muted">
            From <Link to={`/restaurants/${food.restaurantId._id}`}>{food.restaurantId.name}</Link>
          </p>
        )}

        <div className="quantity-row">
          <label>Qty:</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          />
        </div>

        <button onClick={handleAdd}>{added ? 'Added to Cart ✓' : 'Add to Cart'}</button>
      </div>
    </div>
  );
};

export default FoodDetails;
