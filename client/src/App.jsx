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
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [movieType, setMovieType] = useState('movie');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchGenres();
      fetchLanguages();
      fetchMovies();
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchMovies();
    }
  }, [selectedGenre, selectedLanguage, movieType, searchQuery, token]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await axios.get('/api/languages');
      setLanguages(response.data);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedLanguage) params.append('language', selectedLanguage);
      if (movieType) params.append('movieType', movieType);
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
    fetchLanguages();
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
          <h1 className="logo">📺 Review 24</h1>

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

          {/* Hamburger Menu */}
          <div className="header-right">
            <button
              className="btn-menu"
              onClick={() => setShowMenu(!showMenu)}
              title="Menu"
            >
              ☰
            </button>

            {showMenu && (
              <div className="dropdown-menu">
                <div className="menu-section">
                  <label>Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                      setShowMenu(false);
                    }}
                    className="menu-select"
                  >
                    <option value="">All Languages</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="menu-section">
                  <label>Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => {
                      setSelectedGenre(e.target.value);
                      setShowMenu(false);
                    }}
                    className="menu-select"
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="menu-section">
                  <label>Type</label>
                  <div className="type-options">
                    <button
                      className={`type-btn ${movieType === 'movie' ? 'active' : ''}`}
                      onClick={() => {
                        setMovieType('movie');
                        setShowMenu(false);
                      }}
                    >
                      🎬 Movies
                    </button>
                    <button
                      className={`type-btn ${movieType === 'tv-show' ? 'active' : ''}`}
                      onClick={() => {
                        setMovieType('tv-show');
                        setShowMenu(false);
                      }}
                    >
                      📺 TV Shows
                    </button>
                  </div>
                </div>

                {user?.isAdmin && (
                  <div className="menu-section">
                    <button
                      className="btn-upload-menu"
                      onClick={() => {
                        setShowUploadForm(true);
                        setShowMenu(false);
                      }}
                    >
                      + Upload Movie
                    </button>
                  </div>
                )}

                <div className="menu-divider"></div>

                <div className="menu-section user-section">
                  <div className="user-info-menu">
                    <span>📱 {user.phone}</span>
                    {user.isAdmin && <span className="admin-badge-menu">Admin</span>}
                  </div>
                  <button className="btn-logout-menu" onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}>
                    Logout
                  </button>
                </div>
              </div>
            )}
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
            <p>Loading {movieType === 'movie' ? 'movies' : 'TV shows'}...</p>
          </div>
        ) : movies.length > 0 ? (
          <MovieListPopcorn movies={movies} onSelectMovie={setSelectedMovie} />
        ) : (
          <div className="empty-state">
            <p>No content found. Try adjusting your filters!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
