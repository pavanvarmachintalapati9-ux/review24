import { useState } from 'react';
import axios from 'axios';

function UploadMovie({ token, onMovieAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Drama',
    language: 'English',
    movieType: 'movie',
    releaseDate: '',
    posterUrl: '',
    posterImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const genres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Musical',
    'Romance', 'Sci-Fi', 'Mystery', 'Short', 'Sport', 'Thriller', 'War',
    'Western', 'Commercial', 'Mass', 'Anime', 'Crime', 'K-Drama', 'C-Drama',
    'J-Drama'
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Chinese', 'Hindi', 'Portuguese', 'Russian', 'Arabic', 'Turkish', 'Dutch', 'Swedish', 'Polish', 'Greek', 'Thai', 'Vietnamese'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setFormData(prev => ({
          ...prev,
          posterImage: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.language || !formData.releaseDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.posterImage) {
      setError('Please upload a poster image');
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
        language: 'English',
        movieType: 'movie',
        releaseDate: '',
        posterUrl: '',
        posterImage: null
      });
      setImagePreview(null);
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
          <label>Genre *</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            disabled={loading}
            required
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Language *</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            disabled={loading}
            required
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            name="movieType"
            value={formData.movieType}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="movie">Movie</option>
            <option value="tv-show">TV Show</option>
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
          <label>Poster Image * (Max 5MB)</label>
          <div className="image-upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              id="poster-upload"
              className="file-input"
            />
            <label htmlFor="poster-upload" className="file-label">
              📸 Click to upload or drag image
            </label>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, posterImage: null }));
                  }}
                  className="btn-remove-image"
                  disabled={loading}
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Poster URL (Optional - if no image uploaded)</label>
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
