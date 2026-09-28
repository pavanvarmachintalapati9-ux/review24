function MovieList({ movies, onSelectMovie }) {
  const renderStars = (rating) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  return (
    <>
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <div className="movie-poster">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} />
            ) : (
              <span>📽️ No Image</span>
            )}
          </div>
          <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-meta">
              {movie.genre} • {new Date(movie.releaseDate).getFullYear()}
            </p>
            {movie.reviewCount > 0 && (
              <div className="movie-rating">
                <span className="stars">{renderStars(movie.avgRating)}</span>
                <span className="rating-value">
                  {movie.avgRating} ({movie.reviewCount} reviews)
                </span>
              </div>
            )}
            <p className="movie-description">
              {movie.description.substring(0, 100)}...
            </p>
            <button
              className="view-details-btn"
              onClick={() => onSelectMovie(movie)}
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default MovieList;
