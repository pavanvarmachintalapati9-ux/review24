import { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import AIReview from './AIReview';

function MovieDetails({ movie, onClose }) {
  const [movieData, setMovieData] = useState(movie);
  const [activeTab, setActiveTab] = useState('all-reviews');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchMovieDetails();
  }, [movie.id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`/api/movies/${movie.id}`);
      setMovieData(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const handleReviewAdded = () => {
    fetchMovieDetails();
    setRefreshKey(prev => prev + 1);
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  const getReviewsToDisplay = () => {
    if (!movieData.reviews) return [];
    if (activeTab === 'all-reviews') return movieData.reviews;
    if (activeTab === 'before-release') return movieData.reviews.filter(r => r.reviewType === 'before-release');
    if (activeTab === 'after-release') return movieData.reviews.filter(r => r.reviewType === 'after-release');
    return movieData.reviews;
  };

  const reviewsToDisplay = getReviewsToDisplay();

  return (
    <div className="modal-body">
      <div className="movie-details">
        <div className="movie-poster-large">
          {movieData.posterUrl ? (
            <img src={movieData.posterUrl} alt={movieData.title} />
          ) : (
            <span>📽️ No Image</span>
          )}
        </div>
        <div className="movie-detail-info">
          <h1 className="movie-detail-title">{movieData.title}</h1>
          <div className="movie-detail-meta">
            <span>{movieData.genre}</span>
            <span>{new Date(movieData.releaseDate).toLocaleDateString()}</span>
            {movieData.reviewCount > 0 && (
              <span>{movieData.reviewCount} reviews</span>
            )}
          </div>
          {movieData.reviewCount > 0 && (
            <div className="movie-detail-rating">
              <span className="stars">{renderStars(movieData.avgRating)}</span>
              <span>{movieData.avgRating.toFixed(1)}/5</span>
            </div>
          )}
          <p className="movie-detail-description">{movieData.description}</p>
        </div>
      </div>

      <AIReview key={refreshKey} movieId={movieData.id} title={movieData.title} description={movieData.description} genre={movieData.genre} />

      <div className="form-section">
        <h3>Write a Review</h3>
        <ReviewForm movieId={movieData.id} onReviewAdded={handleReviewAdded} />
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all-reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-reviews')}
          >
            All Reviews ({movieData.reviewCount || 0})
          </button>
          <button
            className={`tab ${activeTab === 'before-release' ? 'active' : ''}`}
            onClick={() => setActiveTab('before-release')}
          >
            Before Release ({movieData.reviews?.filter(r => r.reviewType === 'before-release').length || 0})
          </button>
          <button
            className={`tab ${activeTab === 'after-release' ? 'active' : ''}`}
            onClick={() => setActiveTab('after-release')}
          >
            After Release ({movieData.reviews?.filter(r => r.reviewType === 'after-release').length || 0})
          </button>
        </div>

        {reviewsToDisplay.length > 0 ? (
          <ReviewList reviews={reviewsToDisplay} onReplyAdded={handleReviewAdded} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
