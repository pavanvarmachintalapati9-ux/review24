import { useState, useEffect } from 'react';
import axios from 'axios';

function MovieDetailsNew({ movie, onClose, user, token }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newReview, setNewReview] = useState('');
  const [activeTab, setActiveTab] = useState('comments');

  useEffect(() => {
    fetchData();
  }, [movie.id]);

  const fetchData = async () => {
    try {
      const [likesRes, ratingsRes, commentsRes, reviewsRes] = await Promise.all([
        axios.get(`/api/movies/${movie.id}/likes`),
        axios.get(`/api/movies/${movie.id}/ratings`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/movies/${movie.id}/comments`),
        axios.get(`/api/movies/${movie.id}/reviews`)
      ]);

      setLikes(likesRes.data.likes);
      setUserRating(ratingsRes.data.userRating);
      setAvgRating(ratingsRes.data.avgRating);
      setRatingCount(ratingsRes.data.ratingCount);
      setComments(commentsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `/api/movies/${movie.id}/like`,
        { type: liked ? 'unlike' : 'like' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(response.data.likes);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleRating = async (rating) => {
    try {
      const response = await axios.post(
        `/api/movies/${movie.id}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserRating(rating);
      setAvgRating(response.data.avgRating);
      setRatingCount(response.data.ratingCount);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `/api/movies/${movie.id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    try {
      const response = await axios.post(
        `/api/movies/${movie.id}/reviews`,
        { text: newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([response.data, ...reviews]);
      setNewReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i + 1} className={`star ${i < Math.round(rating) ? 'filled' : 'empty'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="modal-body movie-details-new">
      <div className="movie-hero">
        <div className="hero-poster">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} />
          ) : (
            <div className="poster-placeholder-large">📽️</div>
          )}
        </div>

        <div className="hero-info">
          <h1>{movie.title}</h1>
          <p className="meta-info">
            <span>{movie.genre}</span>
            <span>•</span>
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          </p>

          <p className="description">{movie.description}</p>

          {/* Like Button */}
          <div className="actions-section">
            <button
              className={`action-btn like-btn ${liked ? 'active' : ''}`}
              onClick={handleLike}
            >
              <span className="icon">❤️</span>
              <span>{likes} Likes</span>
            </button>
          </div>

          {/* Rating Stars */}
          <div className="rating-section">
            <p className="rating-label">Your Rating</p>
            <div className="stars-interactive">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${userRating >= star ? 'active' : ''}`}
                  onClick={() => handleRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="rating-info">
              Average: {avgRating}/5 ({ratingCount} ratings)
            </p>
          </div>
        </div>
      </div>

      {/* Only show tabs and content for non-admin users */}
      {!user?.isAdmin ? (
        <>
          {/* Tabs */}
          <div className="tabs-section">
            <button
              className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              💬 Comments ({comments.length})
            </button>
            <button
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              📝 Reviews ({reviews.length})
            </button>
          </div>

          {/* Comments Section */}
          {activeTab === 'comments' && (
            <div className="section-box">
              <h3>Comments</h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="input-section">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this movie..."
                  rows="3"
                />
                <button type="submit" className="btn-submit">
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-box">
                      <div className="comment-header">
                        <span className="user-info">👤 {comment.phone}</span>
                        <span className="timestamp">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-content">No comments yet. Be the first!</p>
                )}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {activeTab === 'reviews' && (
            <div className="section-box">
              <h3>Reviews</h3>

              {/* Review Form */}
              <form onSubmit={handleReviewSubmit} className="input-section">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write a detailed review about this movie..."
                  rows="4"
                />
                <button type="submit" className="btn-submit">
                  Post Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="reviews-list">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="review-box">
                      <div className="review-header">
                        <span className="user-info">👤 {review.phone}</span>
                        <span className="timestamp">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-content">No reviews yet. Share your thoughts!</p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="section-box admin-notice">
          <p>✅ As an admin, you can upload movies using the "+ Upload Movie" button.</p>
          <p>Regular users can comment and review movies.</p>
        </div>
      )}
    </div>
  );
}

export default MovieDetailsNew;
