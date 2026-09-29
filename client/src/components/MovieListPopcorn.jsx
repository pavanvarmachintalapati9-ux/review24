function MovieListPopcorn({ movies, onSelectMovie }) {
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
          </div>

          <div className="popcorn-info">
            <div className="title-rating-row">
              <h3 className="movie-title">{movie.title}</h3>
              {movie.ratingCount > 0 && (
                <span className="rating-badge">{movie.avgRating}/5</span>
              )}
            </div>

            <div className="movie-meta-row">
              <span className="genre">{movie.genre}</span>
              <span className="year">
                {new Date(movie.releaseDate).getFullYear()}
              </span>
            </div>

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
