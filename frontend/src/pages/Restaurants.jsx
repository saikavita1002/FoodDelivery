import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRestaurantById } from '../services/restaurantService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';



const Restaurants = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getRestaurantById(id);
        setRestaurant(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAdd = async (foodId) => {
    if (!user) {
      alert('Please login to add items to your cart');
      return;
    }

    await addItem(foodId, 1);
    setAddedId(foodId);
    setTimeout(() => setAddedId(null), 1200);
  };

  if (loading) return <p className="center-text">Loading...</p>;

  if (!restaurant) {
    return <p className="center-text">Restaurant not found.</p>;
  }

  return (
    <div className="page">
      <div className="restaurant-header">
        <img
  src={restaurant.image || "/images/default-restaurant.jpg"}
  alt={restaurant.name}
/>

        <div>
          <h2>{restaurant.name}</h2>
          <p className="muted">{restaurant.address}</p>
          <p className="muted">📞 {restaurant.phone}</p>
        </div>
      </div>

      <h3>Menu</h3>

      {!restaurant.menu || restaurant.menu.length === 0 ? (
        <p>No menu items yet.</p>
      ) : (
        <div className="grid">
          {restaurant.menu.map((food) => (
            <div className="card" key={food._id}>
              <Link to={`/food/${food._id}`}>
                <img
  src={food.image || "/images/default-food.jpg"}
  alt={food.name}
/>
                <h4>{food.foodName}</h4>
              </Link>

              <p className="muted">{food.category}</p>
              <p>₹{food.price}</p>

              <button onClick={() => handleAdd(food._id)}>
                {addedId === food._id ? 'Added ✓' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;