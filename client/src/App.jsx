import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import MovieListPopcorn from './components/MovieListPopcorn';
import MovieDetailsNew from './components/MovieDetailsNew';
import UploadMovie from './components/UploadMovie';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState(['All']);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchGenres();
      fetchMovies();
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchMovies();
    }
  }, [selectedGenre, searchQuery, token]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGenre !== 'All') params.append('genre', selectedGenre);
      if (searchQuery) params.append('search', searchQuery);

      const response = await axios.get(`/api/movies?${params.toString()}`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setMovies([]);
    setSelectedMovie(null);
  };

  const handleMovieAdded = () => {
    setShowUploadForm(false);
    fetchMovies();
    fetchGenres();
  };

  // Show login if not authenticated
  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header-new">
        <div className="header-content-new">
          <h1 className="logo">🎬 CinemaReview</h1>

          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn-search" onClick={fetchMovies}>
              Search
            </button>
          </div>

          <div className="header-right">
            <select
              className="genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            {user?.isAdmin && (
              <button
                className="btn-upload"
                onClick={() => setShowUploadForm(true)}
              >
                + Upload Movie
              </button>
            )}

            <div className="user-info">
              <span className="user-phone">📱 {user.phone}</span>
              {user.isAdmin && <span className="admin-badge">Admin</span>}
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Movie Modal (Admin Only) */}
      {showUploadForm && user?.isAdmin && (
        <div className="modal-overlay" onClick={() => setShowUploadForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload New Movie</h2>
              <button className="close-btn" onClick={() => setShowUploadForm(false)}>
                ×
              </button>
            </div>
            <UploadMovie token={token} onMovieAdded={handleMovieAdded} />
          </div>
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMovie.title}</h2>
              <button className="close-btn" onClick={() => setSelectedMovie(null)}>
                ×
              </button>
            </div>
            <MovieDetailsNew
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
              user={user}
              token={token}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading movies...</p>
          </div>
        ) : movies.length > 0 ? (
          <MovieListPopcorn movies={movies} onSelectMovie={setSelectedMovie} />
        ) : (
          <div className="empty-state">
            <p>No movies found. Try adjusting your filters!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
