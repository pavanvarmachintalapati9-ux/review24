import { useState } from 'react';
import axios from 'axios';

function UploadMovie({ token, onMovieAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Drama',
    releaseDate: '',
    posterUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const genres = [
    'Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance',
    'Sci-Fi', 'Thriller', 'Animation', 'Documentary', 'Adventure'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.releaseDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/movies', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        title: '',
        description: '',
        genre: 'Drama',
        releaseDate: '',
        posterUrl: ''
      });
      onMovieAdded();
    } catch (error) {
      console.error('Error uploading movie:', error);
      setError(error.response?.data?.error || 'Failed to upload movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-body">
      <form onSubmit={handleSubmit} className="upload-movie-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Movie Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter movie description or synopsis"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Genre</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            disabled={loading}
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Release Date *</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Poster URL</label>
          <input
            type="url"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            placeholder="https://example.com/poster.jpg"
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Movie'}
        </button>
      </form>
    </div>
  );
}

export default UploadMovie;
