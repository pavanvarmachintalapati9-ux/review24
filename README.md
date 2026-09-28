# 🎬 CinemaReview - Movie Review App

A modern movie review application with AI-powered film analysis, user reviews, and community engagement features.

## Features

### 📽️ Core Features
- **Movie Management**: Upload and browse movies with details
- **User Reviews**: Rate movies (1-5 stars) and write detailed reviews
- **Review Types**: Separate reviews for before and after movie release
- **Comments & Replies**: Engage in discussions on movie reviews
- **Genre Filtering**: Filter movies by genre for easy discovery
- **Search**: Find movies by title or description
- **AI Film Critic**: Get genuine movie analysis powered by Claude AI

### 🤖 AI Features
- Movie description analysis
- Plot overview without spoilers
- Key strengths and potential drawbacks
- Target audience recommendations
- Expert assessment and opinions

## Tech Stack

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **CSS3**: Modern styling with CSS variables and Grid

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **Anthropic Claude API**: AI movie analysis
- **UUID**: Unique ID generation

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API Key (get from https://console.anthropic.com)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd review24
```

2. **Install dependencies**
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

3. **Configure Environment**

Create `.env` file in the server directory:
```bash
cp server/.env.example server/.env
```

Edit `server/.env` and add your Anthropic API key:
```
PORT=3001
ANTHROPIC_API_KEY=sk-ant-...
NODE_ENV=development
```

### Running the Application

**Development Mode** (runs both frontend and backend):
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

**Individual Development**:
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

### Building for Production

```bash
npm run build
```

This creates:
- `server/` - Backend ready to deploy
- `client/dist/` - Optimized frontend build

## Project Structure

```
review24/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── src/
│   │   └── index.js       # Server setup and routes
│   ├── package.json
│   └── .env.example
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies (with filters)
- `GET /api/movies/:id` - Get single movie with reviews
- `POST /api/movies` - Upload new movie
- `GET /api/genres` - Get all genres

### Reviews
- `POST /api/movies/:movieId/reviews` - Add review
- `GET /api/movies/:movieId/reviews` - Get movie reviews

### Comments & Replies
- `POST /api/reviews/:reviewId/comments` - Add comment
- `POST /api/comments/:commentId/replies` - Add reply

### AI
- `POST /api/movies/:movieId/ai-review` - Generate AI analysis

## Usage Guide

### 1. Adding a Movie
1. Click "+ Upload Movie" button in the header
2. Fill in movie details (title, description, genre, release date, poster URL)
3. Click "Upload Movie"

### 2. Writing a Review
1. Click "View Details" on a movie card
2. In the "Write a Review" section:
   - Enter your name
   - Rate the movie using stars (1-5)
   - Select review type (Before/After Release)
   - Write your review
   - Submit

### 3. Commenting on Reviews
1. Once in movie details, scroll to a review
2. Click "Show comments" to see existing comments
3. Use the comment input at the bottom of each review
4. Click "Reply" to respond to other comments

### 4. Using AI Film Critic
1. In movie details, find the "AI Film Critic" section
2. Click "Analyze" button
3. Wait for Claude AI to generate insights
4. Review the detailed analysis including plot, strengths, and recommendations

### 5. Searching & Filtering
1. Use the genre dropdown to filter by movie genre
2. Use the search bar to find movies by title or description
3. Click "Search" to apply filters

## Environment Variables

### Server (.env)
- `PORT`: Server port (default: 3001)
- `ANTHROPIC_API_KEY`: Your Anthropic API key (required for AI features)
- `NODE_ENV`: Environment mode (development/production)

## Database

Currently uses in-memory storage (perfect for development and testing). For production, consider integrating:
- MongoDB
- PostgreSQL
- Firebase
- Any other database solution

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Persistent database storage
- [ ] Movie ratings aggregation and statistics
- [ ] User follow system
- [ ] Watchlist/bookmark features
- [ ] Social media integration
- [ ] Mobile app version
- [ ] Email notifications
- [ ] Advanced AI features (recommendation engine)
- [ ] Image upload support

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include steps to reproduce if reporting a bug

## Acknowledgments

- Built with React and Express
- AI-powered by Anthropic Claude API
- Inspired by modern movie platforms
