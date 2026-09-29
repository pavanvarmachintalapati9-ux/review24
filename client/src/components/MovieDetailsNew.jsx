import { useState, useEffect } from 'react';
import axios from 'axios';

function MovieDetailsNew({ movie, onClose, user, token, onRatingUpdate }) {
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
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

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
      if (onRatingUpdate) {
        onRatingUpdate();
      }
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

  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const response = await axios.post(
        `/api/movies/${movie.id}/comments`,
        { text: replyText, parentCommentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update comments with the new reply
      const updatedComments = comments.map(comment =>
        comment.id === parentCommentId
          ? { ...comment, replies: [...(comment.replies || []), response.data] }
          : comment
      );
      setComments(updatedComments);
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply');
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

  const handleDeleteMovie = async () => {
    if (!window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(
        `/api/movies/${movie.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Movie deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie');
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
            {user?.isAdmin && (
              <button
                className="action-btn delete-btn"
                onClick={handleDeleteMovie}
                title="Delete this movie"
              >
                <span className="icon">🗑️</span>
                <span>Delete</span>
              </button>
            )}
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

      {/* Tabs - Show reviews for everyone, comments only for non-admin */}
      <div className="tabs-section">
        {!user?.isAdmin && (
          <button
            className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            💬 Comments ({comments.length})
          </button>
        )}
        <button
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          📝 Reviews ({reviews.length})
        </button>
      </div>

      {/* Comments Section - Only for non-admin users */}
      {!user?.isAdmin && activeTab === 'comments' && (
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
                    <span className="user-info">👤 {comment.name || comment.phone}</span>
                    <span className="timestamp">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <button
                    className="btn-reply"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    Reply
                  </button>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="reply-form">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        rows="2"
                        className="reply-input"
                      />
                      <div className="reply-buttons">
                        <button type="submit" className="btn-submit-reply">
                          Post Reply
                        </button>
                        <button
                          type="button"
                          className="btn-cancel-reply"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Replies List */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies-container">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="reply-box">
                          <div className="reply-header">
                            <span className="user-info">👤 {reply.name || reply.phone}</span>
                            <span className="timestamp">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="reply-text">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-content">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}

      {/* Reviews Section - For everyone */}
      {activeTab === 'reviews' && (
        <div className="section-box">
          <h3>Reviews</h3>

          {/* Review Form - Only for non-admin */}
          {!user?.isAdmin && (
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
          )}

          {/* Admin Notice */}
          {user?.isAdmin && (
            <div className="admin-notice-inline">
              <p>👤 Admin Account - View user reviews below</p>
            </div>
          )}

          {/* Reviews List - For everyone */}
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-box">
                  <div className="review-header">
                    <span className="user-info">👤 {review.name || review.phone}</span>
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
    </div>
  );
}

export default MovieDetailsNew;
