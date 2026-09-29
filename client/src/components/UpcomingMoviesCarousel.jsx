import { useState, useEffect } from 'react';
import axios from 'axios';

// Auto-scroll time interval in milliseconds (change this value to adjust speed)
const AUTO_SCROLL_INTERVAL = 2000; // 2 seconds

function UpcomingMoviesCarousel({ movies, token, user, selectedTab, onLikeDislike }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Filter and sort upcoming movies by likes (descending)
  let upcomingMovies = [];
  try {
    upcomingMovies = (movies || [])
      .filter(movie => {
        // Ensure movie and releaseDate exist
        if (!movie || !movie.releaseDate) return false;

        try {
          const isUpcoming = new Date(movie.releaseDate) > new Date();
          if (!isUpcoming) return false;

          // Filter by selected tab
          if (selectedTab === 'movies') return movie.movieType === 'movie';
          if (selectedTab === 'series') return movie.movieType === 'series';
          return true; // Show all for 'home' tab
        } catch (error) {
          console.error('Error filtering movie:', movie, error);
          return false;
        }
      })
      .sort((a, b) => {
        return (b.likes || 0) - (a.likes || 0);
      });
  } catch (error) {
    console.error('Error processing carousel movies:', error);
    upcomingMovies = [];
  }

  // Show only first 9 in carousel
  const carouselMovies = upcomingMovies.slice(0, 9);

  // Include "More" as 10th slide if there are more than 9 movies
  const totalSlides = upcomingMovies.length > 0 ? carouselMovies.length + (upcomingMovies.length > 9 ? 1 : 0) : 0;

  // Reset index when slides change
  useEffect(() => {
    setCurrentIndex(0);
  }, [totalSlides]);

  // Auto-scroll effect (paused when modal is open)
  useEffect(() => {
    if (totalSlides === 0 || selectedMovie) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [totalSlides, selectedMovie]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const isMoreSlide = currentIndex === carouselMovies.length;

  // Safety check: ensure currentIndex is valid
  const safeCurrentIndex = Math.min(currentIndex, carouselMovies.length - 1);
  const canRenderMovieCard = !isMoreSlide && carouselMovies.length > 0;

  const handleSelectMovie = async (movie) => {
    try {
      const [likesRes, commentsRes] = await Promise.all([
        axios.get(`/api/movies/${movie.id}/likes`),
        axios.get(`/api/movies/${movie.id}/comments`)
      ]);

      setSelectedMovie(movie);
      setLikes(likesRes.data.likes);
      setDislikes(likesRes.data.dislikes || 0);
      setLiked(false);
      setDisliked(false);
      setComments(commentsRes.data);
      setNewComment('');
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `/api/movies/${selectedMovie.id}/like`,
        { type: liked ? 'unlike' : 'like' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes || 0);
      setLiked(response.data.liked);
      setDisliked(response.data.disliked || false);
      setUpdateTrigger(prev => prev + 1);

      if (onLikeDislike) {
        onLikeDislike();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await axios.post(
        `/api/movies/${selectedMovie.id}/like`,
        { type: disliked ? 'undislike' : 'dislike' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes || 0);
      setLiked(response.data.liked);
      setDisliked(response.data.disliked || false);
      setUpdateTrigger(prev => prev + 1);

      if (onLikeDislike) {
        onLikeDislike();
      }
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `/api/movies/${selectedMovie.id}/comments`,
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
        `/api/movies/${selectedMovie.id}/comments`,
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

  const currentMovie = upcomingMovies[currentIndex];

  if (upcomingMovies.length === 0) {
    return <div className="upcoming-carousel-container"></div>;
  }

  return (
    <div className="upcoming-carousel-container">
      <div className="carousel-header">
        <h2>Coming Soon</h2>
      </div>

      <div className="carousel-wrapper">
        <button className="carousel-nav prev" onClick={prevSlide}>
          ❮
        </button>

        <div className="carousel-slide">
          {isMoreSlide ? (
            <div className="upcoming-more-card">
              <div className="more-content">
                <h2>More Upcoming Releases</h2>
                <p>View all {upcomingMovies.length} upcoming movies and series</p>
                <button
                  className="btn-view-all"
                  onClick={() => setShowAllUpcoming(true)}
                >
                  View All →
                </button>
              </div>
            </div>
          ) : canRenderMovieCard ? (
            <div className="upcoming-movie-card">
              <div className="upcoming-poster">
                {carouselMovies[safeCurrentIndex].posterUrl ? (
                  <img src={carouselMovies[safeCurrentIndex].posterUrl} alt={carouselMovies[safeCurrentIndex].title} />
                ) : (
                  <div className="poster-placeholder">📽️</div>
                )}
                <div className="new-release-badge">🆕 New Release</div>
                <div className="poster-overlay">
                  <button
                    className="play-btn"
                    onClick={() => handleSelectMovie(carouselMovies[safeCurrentIndex])}
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="upcoming-info">
                <div className="upcoming-type-badge">
                  {carouselMovies[safeCurrentIndex].movieType === 'series' ? '📺 Series' : '🎬 Movie'}
                </div>
                <h3 className="upcoming-title">{carouselMovies[safeCurrentIndex].title}</h3>
                <p className="upcoming-release">
                  Coming on {new Date(carouselMovies[safeCurrentIndex].releaseDate).toLocaleDateString()}
                </p>
                <p className="upcoming-genre">{carouselMovies[safeCurrentIndex].genre}</p>
                <p className="upcoming-description">{carouselMovies[safeCurrentIndex].description}</p>
                <div className="upcoming-likes-display">
                  <span>❤️ {selectedMovie?.id === carouselMovies[safeCurrentIndex].id ? likes : (carouselMovies[safeCurrentIndex].likes || 0)} likes</span>
                  <span>👎 {selectedMovie?.id === carouselMovies[safeCurrentIndex].id ? dislikes : (carouselMovies[safeCurrentIndex].dislikes || 0)} dislikes</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="upcoming-movie-card">
              <div className="poster-placeholder">📽️</div>
            </div>
          )}
        </div>

        <button className="carousel-nav next" onClick={nextSlide}>
          ❯
        </button>
      </div>

      <div className="carousel-indicators">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content upcoming-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMovie.title}</h2>
              <button className="close-btn" onClick={() => setSelectedMovie(null)}>
                ×
              </button>
            </div>

            <div className="upcoming-modal-body">
              <div className="upcoming-modal-poster">
                {selectedMovie.posterUrl ? (
                  <img src={selectedMovie.posterUrl} alt={selectedMovie.title} />
                ) : (
                  <div className="poster-placeholder">📽️</div>
                )}
              </div>

              <div className="upcoming-modal-info">
                <div className="upcoming-type-badge">
                  {selectedMovie.movieType === 'series' ? '📺 Series' : '🎬 Movie'}
                </div>
                <p className="modal-release">
                  <strong>Release Date:</strong> {new Date(selectedMovie.releaseDate).toLocaleDateString()}
                </p>
                <p className="modal-genre">
                  <strong>Genre:</strong> {selectedMovie.genre}
                </p>
                <p className="modal-description">{selectedMovie.description}</p>

                <div className="like-dislike-section">
                  <button
                    className={`btn-like ${liked ? 'active' : ''}`}
                    onClick={handleLike}
                  >
                    {liked ? '❤️' : '🤍'} {liked ? 'Liked' : 'Like'} ({likes})
                  </button>
                  <button
                    className={`btn-dislike ${disliked ? 'active' : ''}`}
                    onClick={handleDislike}
                  >
                    {disliked ? '👎' : '👎'} {disliked ? 'Disliked' : 'Dislike'} ({dislikes})
                  </button>
                </div>

                <div className="comments-section">
                  <h4>Comments</h4>
                  <form onSubmit={handleCommentSubmit} className="comment-form">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="comment-input"
                    />
                    <button type="submit" className="btn-comment-submit">
                      Post
                    </button>
                  </form>

                  <div className="comments-list">
                    {comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-user">👤 {comment.name || comment.phone}</span>
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                        <button
                          className="btn-reply-small"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          Reply
                        </button>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="reply-form-small">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              rows="2"
                              className="reply-input-small"
                            />
                            <div className="reply-buttons-small">
                              <button type="submit" className="btn-submit-reply-small">
                                Post
                              </button>
                              <button
                                type="button"
                                className="btn-cancel-reply-small"
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
                          <div className="replies-container-small">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="reply-item-small">
                                <div className="reply-header-small">
                                  <span className="reply-user">👤 {reply.name || reply.phone}</span>
                                  <span className="reply-date">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="reply-text-small">{reply.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAllUpcoming && (
        <div className="modal-overlay" onClick={() => setShowAllUpcoming(false)}>
          <div className="modal-content all-upcoming-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>All Upcoming Releases</h2>
              <button className="close-btn" onClick={() => setShowAllUpcoming(false)}>
                ×
              </button>
            </div>

            <div className="all-upcoming-grid">
              {upcomingMovies.map((movie) => (
                <div key={movie.id} className="all-upcoming-item">
                  <div className="all-upcoming-poster">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt={movie.title} />
                    ) : (
                      <div className="poster-placeholder">📽️</div>
                    )}
                    <div className="new-release-badge">🆕 New Release</div>
                  </div>
                  <div className="all-upcoming-info">
                    <div className="upcoming-type-badge">
                      {movie.movieType === 'series' ? '📺 Series' : '🎬 Movie'}
                    </div>
                    <h4 className="all-upcoming-title">{movie.title}</h4>
                    <p className="all-upcoming-release">
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </p>
                    <p className="all-upcoming-likes">
                      ❤️ {movie.likes || 0} likes
                    </p>
                    <button
                      className="btn-view-details"
                      onClick={() => handleSelectMovie(movie)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpcomingMoviesCarousel;
