import { useState } from 'react';
import axios from 'axios';

function UpcomingMoviesCarousel({ movies, token, user }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const upcomingMovies = movies.filter(movie => {
    return new Date(movie.releaseDate) > new Date();
  });

  if (upcomingMovies.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % upcomingMovies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? upcomingMovies.length - 1 : prevIndex - 1
    );
  };

  const handleSelectMovie = async (movie) => {
    try {
      const [likesRes, commentsRes] = await Promise.all([
        axios.get(`/api/movies/${movie.id}/likes`),
        axios.get(`/api/movies/${movie.id}/comments`)
      ]);

      setSelectedMovie(movie);
      setLikes(likesRes.data.likes);
      setLiked(false);
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
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error toggling like:', error);
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

  const currentMovie = upcomingMovies[currentIndex];

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
          <div className="upcoming-movie-card">
            <div className="upcoming-poster">
              {currentMovie.posterUrl ? (
                <img src={currentMovie.posterUrl} alt={currentMovie.title} />
              ) : (
                <div className="poster-placeholder">📽️</div>
              )}
              <div className="new-release-badge">🆕 New Release</div>
              <div className="poster-overlay">
                <button
                  className="play-btn"
                  onClick={() => handleSelectMovie(currentMovie)}
                >
                  ▶
                </button>
              </div>
            </div>

            <div className="upcoming-info">
              <h3 className="upcoming-title">{currentMovie.title}</h3>
              <p className="upcoming-release">
                Coming on {new Date(currentMovie.releaseDate).toLocaleDateString()}
              </p>
              <p className="upcoming-genre">{currentMovie.genre}</p>
              <p className="upcoming-description">{currentMovie.description}</p>
            </div>
          </div>
        </div>

        <button className="carousel-nav next" onClick={nextSlide}>
          ❯
        </button>
      </div>

      <div className="carousel-indicators">
        {upcomingMovies.map((_, index) => (
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
                  <button className="btn-dislike">
                    👎 Dislike
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
                          <span className="comment-user">📱 {comment.phone}</span>
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpcomingMoviesCarousel;
