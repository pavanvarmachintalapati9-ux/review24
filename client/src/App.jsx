import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import UploadMovie from './components/UploadMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState(['All']);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, searchQuery]);

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

  const handleMovieAdded = () => {
    setShowUploadForm(false);
    fetchMovies();
    fetchGenres();
  };

  return (
    <div className="container">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo">🎬 CinemaReview</h1>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="btn-submit"
                onClick={fetchMovies}
              >
                Search
              </button>
            </div>
            <div className="genre-filter">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <button
                className="btn-submit"
                onClick={() => setShowUploadForm(true)}
              >
                + Upload Movie
              </button>
            </div>
          </div>
        </div>
      </header>

      {showUploadForm && (
        <div className="modal-overlay" onClick={() => setShowUploadForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload New Movie</h2>
              <button className="close-btn" onClick={() => setShowUploadForm(false)}>
                ×
              </button>
            </div>
            <UploadMovie onMovieAdded={handleMovieAdded} />
          </div>
        </div>
      )}

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMovie.title}</h2>
              <button className="close-btn" onClick={() => setSelectedMovie(null)}>
                ×
              </button>
            </div>
            <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
          </div>
        </div>
      )}

      <main className="main">
        {loading ? (
          <div className="empty-state">
            <div className="spinner"></div>
            <p>Loading movies...</p>
          </div>
        ) : movies.length > 0 ? (
          <MovieList
            movies={movies}
            onSelectMovie={setSelectedMovie}
          />
        ) : (
          <div className="no-movies">
            <p>No movies found. Try adjusting your filters or add a new movie!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
