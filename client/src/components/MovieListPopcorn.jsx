function MovieListPopcorn({ movies, onSelectMovie }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="popcorn-grid">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="popcorn-card"
          onClick={() => onSelectMovie(movie)}
        >
          <div className="popcorn-poster">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} />
            ) : (
              <div className="poster-placeholder">📽️</div>
            )}
            <div className="poster-overlay">
              <button className="play-btn">▶</button>
            </div>
          </div>

          <div className="popcorn-info">
            <h3 className="movie-title">{movie.title}</h3>

            <div className="movie-meta-row">
              <span className="genre">{movie.genre}</span>
              <span className="year">
                {new Date(movie.releaseDate).getFullYear()}
              </span>
            </div>

            {movie.ratingCount > 0 && (
              <div className="rating-section">
                <div className="stars-small">
                  {renderStars(movie.avgRating)}
                </div>
                <span className="rating-text">{movie.avgRating}/5</span>
              </div>
            )}

            <div className="engagement-stats">
              {movie.likes > 0 && (
                <span className="stat">❤️ {movie.likes}</span>
              )}
              {movie.commentCount > 0 && (
                <span className="stat">💬 {movie.commentCount}</span>
              )}
              {movie.reviewCount > 0 && (
                <span className="stat">📝 {movie.reviewCount}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieListPopcorn;
