import { useState, useEffect } from 'react';
import axios from 'axios';

function UploadMovie({ token, onMovieAdded }) {
  console.log('UploadMovie component mounted with token:', token);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Action',
    language: 'Telugu',
    movieType: 'movie',
    releaseDate: '',
    posterUrl: '',
    posterImage: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchGenresAndLanguages();
  }, []);

  const fetchGenresAndLanguages = async () => {
    try {
      const [genresRes, languagesRes] = await Promise.all([
        axios.get('/api/genres'),
        axios.get('/api/languages')
      ]);

      const genresData = Array.isArray(genresRes.data) ? genresRes.data : [];
      const languagesData = Array.isArray(languagesRes.data) ? languagesRes.data : [];

      setGenres(genresData);
      setLanguages(languagesData);

      if (genresData.length > 0) {
        setFormData(prev => ({ ...prev, genre: genresData[0] }));
      }
    } catch (error) {
      console.error('Error fetching genres/languages:', error);
      setError('Failed to load genres and languages');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    const maxSize = 2 * 1024 * 1024; // 2MB instead of 5MB for faster processing
    if (file.size > maxSize) {
      setError('Image size must be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setError('');

    // Use setTimeout to prevent blocking UI
    setTimeout(() => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const base64 = event.target.result;
          setImagePreview(base64);
          setFormData(prev => ({
            ...prev,
            posterImage: base64
          }));
        } catch (err) {
          console.error('Error processing image:', err);
          setError('Error processing image. Please try again.');
        }
      };

      reader.onerror = () => {
        setError('Error reading file. Please try again.');
      };

      reader.readAsDataURL(file);
    }, 0);
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
      const response = await axios.post('/api/movies', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form after successful upload
      setFormData({
        title: '',
        description: '',
        genre: genres[0] || 'Action',
        language: 'Telugu',
        movieType: 'movie',
        releaseDate: '',
        posterUrl: '',
        posterImage: null
      });
      setImagePreview(null);
      setError('');

      // Call callback to refresh data
      if (onMovieAdded) {
        onMovieAdded();
      }
    } catch (error) {
      console.error('Error uploading movie:', error);

      if (error.response?.status === 401) {
        // Token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Your session has expired. Please login again.');
        setTimeout(() => window.location.reload(), 1500);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('Failed to upload movie. Please try again.');
      }
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
            <option value="series">Series</option>
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
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

export default UploadMovie;
