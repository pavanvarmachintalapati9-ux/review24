import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import MovieListPopcorn from './components/MovieListPopcorn';
import MovieDetailsNew from './components/MovieDetailsNew';
import UploadMovie from './components/UploadMovie';
import UpcomingMoviesCarousel from './components/UpcomingMoviesCarousel';

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
  const [selectedMovieType, setSelectedMovieType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('home');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);

  useEffect(() => {
    if (token) {
      // Verify token is still valid
      verifyToken();
      fetchGenres();
      fetchLanguages();
      fetchMovies();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      // Token is invalid, clear it
      console.log('Token invalid, clearing session');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMovies();
    }
  }, [selectedGenre, selectedLanguage, selectedTab, searchQuery, showUpcomingOnly, token]);

  const fetchGenres = async () => {
    try {
      const response = await axios.get('/api/genres');
      if (response.data && Array.isArray(response.data)) {
        setGenres(response.data);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await axios.get('/api/languages');
      if (response.data && Array.isArray(response.data)) {
        setLanguages(response.data);
      }
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
      if (selectedTab === 'movies') params.append('movieType', 'movie');
      else if (selectedTab === 'series') params.append('movieType', 'series');
      if (searchQuery) params.append('search', searchQuery);

      const response = await axios.get(`/api/movies?${params.toString()}`);

      // Ensure response data is an array
      if (!Array.isArray(response.data)) {
        console.error('Invalid movies response:', response.data);
        setMovies([]);
        return;
      }

      // Filter to only upcoming movies if showUpcomingOnly is true
      let filtered = response.data;
      if (showUpcomingOnly) {
        filtered = response.data.filter(movie =>
          new Date(movie.releaseDate) > new Date()
        );
      }

      // Sort by release date (latest first)
      const sortedMovies = filtered.sort((a, b) => {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      });

      setMovies(sortedMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken, newUser) => {
    console.log('handleLogin called with token:', newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
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

  const handleMovieAdded = async () => {
    setShowUploadForm(false);
    try {
      await Promise.all([
        fetchMovies(),
        fetchGenres(),
        fetchLanguages()
      ]);
    } catch (error) {
      console.error('Error refreshing data after movie upload:', error);
    }
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
          {/* Hamburger Menu */}
          <div className="header-left">
            <button
              className="btn-menu"
              onClick={() => setShowMenu(!showMenu)}
              title="Menu"
            >
              ☰
            </button>

            {showMenu && (
              <div className="dropdown-menu">
                <button
                  className={`btn-menu-toggle full-width ${showUpcomingOnly ? 'active' : ''}`}
                  onClick={() => {
                    setShowUpcomingOnly(!showUpcomingOnly);
                    setShowMenu(false);
                  }}
                >
                  {showUpcomingOnly ? '✓ Only Upcoming Releases' : '○ All Releases'}
                </button>

                <div className="menu-divider"></div>

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
            {!user?.isAdmin && (
              <>
                <button
                  className={`btn-filter ${selectedTab === 'home' ? 'active' : ''}`}
                  onClick={() => setSelectedTab('home')}
                  title="Home"
                >
                  🏠 Home
                </button>
                <button
                  className={`btn-filter ${selectedTab === 'movies' ? 'active' : ''}`}
                  onClick={() => setSelectedTab('movies')}
                  title="Movies"
                >
                  🎬 Movies
                </button>
                <button
                  className={`btn-filter ${selectedTab === 'series' ? 'active' : ''}`}
                  onClick={() => setSelectedTab('series')}
                  title="Series"
                >
                  📺 Series
                </button>
              </>
            )}
            {user?.isAdmin && (
              <button
                className="btn-upload"
                onClick={() => setShowUploadForm(true)}
                title="Upload"
              >
                + Upload
              </button>
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
              onRatingUpdate={fetchMovies}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {!user?.isAdmin && <UpcomingMoviesCarousel movies={movies} token={token} user={user} selectedTab={selectedTab} onLikeDislike={fetchMovies} />}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading content...</p>
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
