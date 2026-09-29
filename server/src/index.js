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
app.use(express.json({ limit: '50mb' }));

// Initialize Anthropic client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// In-memory database
const db = {
  movies: [],
  reviews: [],
  comments: [],
  replies: [],
  users: [],
  otps: {},
  likes: [],
  ratings: []
};

// Admin credentials
const ADMIN_PHONE = process.env.ADMIN_PHONE || '9876543210';
const ADMIN_OTP = '1234';

// Helper function to validate phone number
function isValidPhoneNumber(phone) {
  return /^[0-9]{10}$/.test(phone);
}

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, 4);
}

// Authentication middleware
function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = db.users.find(u => u.token === token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = user;
  next();
}

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

// Authentication Routes

// Send OTP to phone number
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!isValidPhoneNumber(phone)) {
    return res.status(400).json({ error: 'Invalid phone number. Please enter a valid 10-digit phone number.' });
  }

  // For testing: use 1234, for production use generateOTP()
  const otp = process.env.NODE_ENV === 'production' ? generateOTP() : '1234';
  db.otps[phone] = otp;

  // In production, send OTP via SMS. For now, log it
  console.log(`OTP for ${phone}: ${otp}`);

  res.json({ message: 'OTP sent successfully', phone, testOTP: otp });
});

// Verify OTP and login
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  if (!isValidPhoneNumber(phone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  if (db.otps[phone] !== otp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  const isAdmin = phone === ADMIN_PHONE;
  const token = uuidv4();

  let user = db.users.find(u => u.phone === phone);
  if (!user) {
    user = {
      id: uuidv4(),
      phone,
      isAdmin,
      token,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
  } else {
    user.token = token;
  }

  delete db.otps[phone];

  res.json({
    token,
    user: {
      id: user.id,
      phone: user.phone,
      isAdmin: user.isAdmin
    }
  });
});

// Get current user
app.get('/api/auth/me', authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

// Update user name
app.post('/api/auth/update-name', authenticateUser, (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  req.user.name = name.trim();
  res.json({
    token: req.user.token,
    user: {
      id: req.user.id,
      phone: req.user.phone,
      name: req.user.name,
      isAdmin: req.user.isAdmin
    }
  });
});

// GET all movies with filters
app.get('/api/movies', (req, res) => {
  const { genre, language, movieType, search } = req.query;
  let filtered = [...db.movies];

  if (genre) {
    filtered = filtered.filter(m => m.genre === genre);
  }

  if (language) {
    filtered = filtered.filter(m => m.language === language);
  }

  if (movieType) {
    filtered = filtered.filter(m => m.movieType === movieType);
  }
  // If movieType is not specified, show all content (movies and series)

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(m =>
      m.title.toLowerCase().includes(searchLower) ||
      m.description.toLowerCase().includes(searchLower)
    );
  }

  // Add stats to each movie
  const moviesWithStats = filtered.map(movie => {
    const ratings = db.ratings.filter(r => r.movieId === movie.id);
    const avgRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    const likes = db.likes.filter(l => l.movieId === movie.id && l.type === 'like').length;
    const comments = db.comments.filter(c => c.movieId === movie.id).length;
    const reviews = db.reviews.filter(r => r.movieId === movie.id).length;

    return {
      ...movie,
      avgRating: parseFloat(avgRating),
      likes,
      ratingCount: ratings.length,
      commentCount: comments,
      reviewCount: reviews
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

// POST new movie (Admin only)
app.post('/api/movies', authenticateUser, (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Only admins can upload movies' });
    }

    const { title, description, genre, language, releaseDate, posterUrl, posterImage, movieType } = req.body;

    if (!title || !description || !genre || !language || !releaseDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!posterImage && !posterUrl) {
      return res.status(400).json({ error: 'Poster image or URL is required' });
    }

    const movie = {
      id: uuidv4(),
      title,
      description,
      genre,
      language,
      releaseDate,
      movieType: movieType || 'movie',
      posterUrl: posterImage || posterUrl,
      uploadedBy: req.user.id,
      createdAt: new Date().toISOString()
    };

    db.movies.push(movie);
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error uploading movie:', error);
    res.status(500).json({ error: 'Failed to upload movie' });
  }
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

// NEW ENDPOINTS: Likes, Ratings, Comments, Reviews

// POST like/dislike a movie
app.post('/api/movies/:movieId/like', authenticateUser, (req, res) => {
  const { movieId } = req.params;
  const { type } = req.body; // 'like', 'unlike', 'dislike', or 'undislike'

  const movie = db.movies.find(m => m.id === movieId);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const existingReaction = db.likes.find(l => l.movieId === movieId && l.userId === req.user.id);

  if (type === 'like') {
    if (!existingReaction) {
      // Add new like
      db.likes.push({
        id: uuidv4(),
        movieId,
        userId: req.user.id,
        type: 'like',
        createdAt: new Date().toISOString()
      });
    } else if (existingReaction.type === 'dislike') {
      // Convert dislike to like
      existingReaction.type = 'like';
    }
  } else if (type === 'unlike') {
    if (existingReaction && existingReaction.type === 'like') {
      db.likes = db.likes.filter(l => l.id !== existingReaction.id);
    }
  } else if (type === 'dislike') {
    if (!existingReaction) {
      // Add new dislike
      db.likes.push({
        id: uuidv4(),
        movieId,
        userId: req.user.id,
        type: 'dislike',
        createdAt: new Date().toISOString()
      });
    } else if (existingReaction.type === 'like') {
      // Convert like to dislike
      existingReaction.type = 'dislike';
    }
  } else if (type === 'undislike') {
    if (existingReaction && existingReaction.type === 'dislike') {
      db.likes = db.likes.filter(l => l.id !== existingReaction.id);
    }
  }

  const likes = db.likes.filter(l => l.movieId === movieId && l.type === 'like').length;
  const dislikes = db.likes.filter(l => l.movieId === movieId && l.type === 'dislike').length;
  const userReaction = db.likes.find(l => l.movieId === movieId && l.userId === req.user.id);

  res.json({
    likes,
    dislikes,
    liked: userReaction?.type === 'like' ? true : false,
    disliked: userReaction?.type === 'dislike' ? true : false,
    userReaction: userReaction?.type || null
  });
});

// GET likes and dislikes for movie
app.get('/api/movies/:movieId/likes', (req, res) => {
  const likes = db.likes.filter(l => l.movieId === req.params.movieId && l.type === 'like').length;
  const dislikes = db.likes.filter(l => l.movieId === req.params.movieId && l.type === 'dislike').length;
  res.json({ likes, dislikes });
});

// POST rating for movie (stars)
app.post('/api/movies/:movieId/rate', authenticateUser, (req, res) => {
  const { movieId } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const movie = db.movies.find(m => m.id === movieId);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  // Update or create rating
  const existingRating = db.ratings.find(r => r.movieId === movieId && r.userId === req.user.id);

  if (existingRating) {
    existingRating.rating = rating;
    existingRating.updatedAt = new Date().toISOString();
  } else {
    db.ratings.push({
      id: uuidv4(),
      movieId,
      userId: req.user.id,
      rating,
      createdAt: new Date().toISOString()
    });
  }

  const ratings = db.ratings.filter(r => r.movieId === movieId);
  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  res.json({ rating, avgRating: parseFloat(avgRating), ratingCount: ratings.length });
});

// GET ratings for movie
app.get('/api/movies/:movieId/ratings', authenticateUser, (req, res) => {
  const userRating = db.ratings.find(r => r.movieId === req.params.movieId && r.userId === req.user.id);
  const allRatings = db.ratings.filter(r => r.movieId === req.params.movieId);
  const avgRating = allRatings.length > 0
    ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
    : 0;

  res.json({
    userRating: userRating?.rating || 0,
    avgRating: parseFloat(avgRating),
    ratingCount: allRatings.length
  });
});

// POST comment on movie (separate from reviews)
app.post('/api/movies/:movieId/comments', authenticateUser, (req, res) => {
  const { movieId } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  const movie = db.movies.find(m => m.id === movieId);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const comment = {
    id: uuidv4(),
    movieId,
    userId: req.user.id,
    phone: req.user.phone,
    name: req.user.name || req.user.phone,
    text,
    createdAt: new Date().toISOString()
  };

  db.comments.push(comment);
  res.status(201).json(comment);
});

// GET comments for movie
app.get('/api/movies/:movieId/comments', (req, res) => {
  const comments = db.comments.filter(c => c.movieId === req.params.movieId).reverse();
  res.json(comments);
});

// POST review for movie (separate from comments)
app.post('/api/movies/:movieId/reviews', authenticateUser, (req, res) => {
  const { movieId } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Review text is required' });
  }

  const movie = db.movies.find(m => m.id === movieId);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const review = {
    id: uuidv4(),
    movieId,
    userId: req.user.id,
    phone: req.user.phone,
    name: req.user.name || req.user.phone,
    text,
    createdAt: new Date().toISOString()
  };

  db.reviews.push(review);
  res.status(201).json(review);
});

// GET reviews for movie
app.get('/api/movies/:movieId/reviews', (req, res) => {
  const reviews = db.reviews.filter(r => r.movieId === req.params.movieId).reverse();
  res.json(reviews);
});

// GET genres (short names in ascending order)
app.get('/api/genres', (req, res) => {
  const allGenres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
    'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ];
  res.json(allGenres);
});

// GET languages (Indian + International)
app.get('/api/languages', (req, res) => {
  const languages = [
    'Bengali', 'Chinese', 'English', 'Gujarati', 'Hindi', 'Japanese',
    'Kannada', 'Korean', 'Malayalam', 'Marathi', 'Odia', 'Punjabi', 'Tamil', 'Telugu'
  ];
  res.json(languages);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
