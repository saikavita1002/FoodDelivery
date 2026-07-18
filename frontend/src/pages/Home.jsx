import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../services/restaurantService';
import { searchFoods } from '../services/foodService';

const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000/uploads';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError('Could not load restaurants. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const { data } = await searchFoods(searchQuery.trim());
    setSearchResults(data);
  };

  if (loading) return <p className="center-text">Loading restaurants...</p>;
  if (error) return <p className="center-text error-text">{error}</p>;

  return (
    <div className="page">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search for food (e.g. pizza, biryani)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {searchResults ? (
        <>
          <h2>Search results for "{searchQuery}"</h2>
          {searchResults.length === 0 ? (
            <p>No food items matched your search.</p>
          ) : (
            <div className="grid">
              {searchResults.map((food) => (
                <Link to={`/food/${food._id}`} key={food._id} className="card">
                  <img
                    src={food.image ? `${IMAGE_BASE}/${food.image}` : 'https://via.placeholder.com/200x140?text=Food'}
                    alt={food.foodName}
                  />
                  <h3>{food.foodName}</h3>
                  <p>₹{food.price}</p>
                  <p className="muted">{food.restaurantId?.name}</p>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2>Restaurants Near You</h2>
          {restaurants.length === 0 ? (
            <p>No restaurants available yet.</p>
          ) : (
            <div className="grid">
              {restaurants.map((r) => (
                <Link to={`/restaurants/${r._id}`} key={r._id} className="card">
                  <img
                    src={r.image ? `${IMAGE_BASE}/${r.image}` : 'https://via.placeholder.com/200x140?text=Restaurant'}
                    alt={r.name}
                  />
                  <h3>{r.name}</h3>
                  <p className="muted">{r.address}</p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
