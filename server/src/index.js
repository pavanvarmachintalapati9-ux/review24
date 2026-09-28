import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// In-memory database
const db = {
  movies: [],
  reviews: [],
  comments: [],
  replies: []
};

// Helper function to get movie recommendations from AI
async function getAIMovieReview(movieTitle, movieDescription, genre) {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `As a genuine film critic, provide a detailed analysis of the movie "${movieTitle}" (Genre: ${genre}).

Movie Description: ${movieDescription}

Please provide:
1. Plot Overview: A brief summary without spoilers
2. Key Strengths: What makes this movie worth watching
3. Potential Drawbacks: Any potential concerns
4. Who Should Watch: Target audience
5. Overall Assessment: Your expert opinion on the film

Be honest, detailed, and helpful for someone deciding whether to watch this movie.`
        }
      ]
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (error) {
    console.error('Error getting AI review:', error);
    throw error;
  }
}

// Routes

// GET all movies with filters
app.get('/api/movies', (req, res) => {
  const { genre, search } = req.query;
  let filtered = [...db.movies];

  if (genre && genre !== 'All') {
    filtered = filtered.filter(m => m.genre === genre);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(m =>
      m.title.toLowerCase().includes(searchLower) ||
      m.description.toLowerCase().includes(searchLower)
    );
  }

  // Add review stats to each movie
  const moviesWithStats = filtered.map(movie => {
    const reviews = db.reviews.filter(r => r.movieId === movie.id);
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return {
      ...movie,
      reviewCount: reviews.length,
      avgRating: parseFloat(avgRating)
    };
  });

  res.json(moviesWithStats);
});

// GET single movie
app.get('/api/movies/:id', (req, res) => {
  const movie = db.movies.find(m => m.id === req.params.id);
  if (!movie) return res.status(404).json({ error: 'Movie not found' });

  const reviews = db.reviews.filter(r => r.movieId === movie.id);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  res.json({
    ...movie,
    reviewCount: reviews.length,
    avgRating: parseFloat(avgRating),
    reviews: reviews.map(review => ({
      ...review,
      comments: db.comments
        .filter(c => c.reviewId === review.id)
        .map(comment => ({
          ...comment,
          replies: db.replies.filter(r => r.commentId === comment.id)
        }))
    }))
  });
});

// POST new movie
app.post('/api/movies', (req, res) => {
  const { title, description, genre, releaseDate, posterUrl } = req.body;

  if (!title || !description || !genre) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const movie = {
    id: uuidv4(),
    title,
    description,
    genre,
    releaseDate,
    posterUrl,
    createdAt: new Date().toISOString()
  };

  db.movies.push(movie);
  res.status(201).json(movie);
});

// POST review for movie
app.post('/api/movies/:movieId/reviews', (req, res) => {
  const { author, rating, comment, reviewType, userId } = req.body;

  if (!author || rating === undefined || !comment || !reviewType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  if (!['before-release', 'after-release'].includes(reviewType)) {
    return res.status(400).json({ error: 'Invalid review type' });
  }

  const review = {
    id: uuidv4(),
    movieId: req.params.movieId,
    userId: userId || uuidv4(),
    author,
    rating,
    comment,
    reviewType,
    createdAt: new Date().toISOString()
  };

  db.reviews.push(review);
  res.status(201).json(review);
});

// GET reviews for movie
app.get('/api/movies/:movieId/reviews', (req, res) => {
  const { reviewType } = req.query;
  let reviews = db.reviews.filter(r => r.movieId === req.params.movieId);

  if (reviewType && reviewType !== 'all') {
    reviews = reviews.filter(r => r.reviewType === reviewType);
  }

  const reviewsWithComments = reviews.map(review => ({
    ...review,
    comments: db.comments
      .filter(c => c.reviewId === review.id)
      .map(comment => ({
        ...comment,
        replies: db.replies.filter(r => r.commentId === comment.id)
      }))
  }));

  res.json(reviewsWithComments);
});

// POST comment on review
app.post('/api/reviews/:reviewId/comments', (req, res) => {
  const { author, text, userId } = req.body;

  if (!author || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const comment = {
    id: uuidv4(),
    reviewId: req.params.reviewId,
    userId: userId || uuidv4(),
    author,
    text,
    createdAt: new Date().toISOString()
  };

  db.comments.push(comment);
  res.status(201).json(comment);
});

// POST reply to comment
app.post('/api/comments/:commentId/replies', (req, res) => {
  const { author, text, userId } = req.body;

  if (!author || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const reply = {
    id: uuidv4(),
    commentId: req.params.commentId,
    userId: userId || uuidv4(),
    author,
    text,
    createdAt: new Date().toISOString()
  };

  db.replies.push(reply);
  res.status(201).json(reply);
});

// GET AI review for movie
app.post('/api/movies/:movieId/ai-review', async (req, res) => {
  try {
    const movie = db.movies.find(m => m.id === req.params.movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const aiReview = await getAIMovieReview(movie.title, movie.description, movie.genre);
    res.json({ movieId: movie.id, review: aiReview });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI review' });
  }
});

// GET genres
app.get('/api/genres', (req, res) => {
  const genres = [...new Set(db.movies.map(m => m.genre))].sort();
  res.json(['All', ...genres]);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
