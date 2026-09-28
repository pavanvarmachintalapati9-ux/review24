import { useState } from 'react';
import axios from 'axios';

function ReviewForm({ movieId, onReviewAdded }) {
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    comment: '',
    reviewType: 'after-release'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.author || !formData.comment) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/movies/${movieId}/reviews`, formData);
      setFormData({
        author: '',
        rating: 5,
        comment: '',
        reviewType: 'after-release'
      });
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-section">
      <div className="form-group">
        <label>Your Name</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="form-group">
        <label>Rating</label>
        <div className="rating-input">
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`star-btn ${formData.rating >= star ? 'selected' : ''}`}
                onClick={() => handleRatingClick(star)}
              >
                ★
              </button>
            ))}
          </div>
          <span>{formData.rating}/5</span>
        </div>
      </div>

      <div className="form-group">
        <label>Review Type</label>
        <select
          name="reviewType"
          value={formData.reviewType}
          onChange={handleChange}
        >
          <option value="before-release">Before Release (Anticipation)</option>
          <option value="after-release">After Release (Experience)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Your Review</label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your thoughts about the movie..."
          required
        />
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;
