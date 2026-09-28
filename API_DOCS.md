# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Response Format
All endpoints return JSON responses.

### Success Response (200)
```json
{
  "id": "uuid",
  "data": "..."
}
```

### Error Response (400/500)
```json
{
  "error": "Error message"
}
```

---

## Endpoints

### 🎬 Movies

#### GET /movies
Get all movies with optional filters.

**Query Parameters:**
- `genre` (optional): Filter by genre (e.g., "Action")
- `search` (optional): Search by title or description

**Example:**
```bash
GET /api/movies?genre=Action&search=superhero
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Dark Knight",
    "description": "...",
    "genre": "Action",
    "releaseDate": "2008-07-18",
    "posterUrl": "https://...",
    "reviewCount": 5,
    "avgRating": 4.8,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

#### GET /movies/:id
Get detailed information about a specific movie including all reviews.

**Parameters:**
- `id` (required): Movie UUID

**Example:**
```bash
GET /api/movies/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "The Dark Knight",
  "description": "...",
  "genre": "Action",
  "releaseDate": "2008-07-18",
  "posterUrl": "https://...",
  "reviewCount": 5,
  "avgRating": 4.8,
  "createdAt": "2024-01-01T00:00:00Z",
  "reviews": [
    {
      "id": "review-uuid",
      "movieId": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "user-uuid",
      "author": "John Doe",
      "rating": 5,
      "comment": "Amazing movie!",
      "reviewType": "after-release",
      "createdAt": "2024-01-01T00:00:00Z",
      "comments": [
        {
          "id": "comment-uuid",
          "reviewId": "review-uuid",
          "userId": "user-uuid",
          "author": "Jane Smith",
          "text": "I agree!",
          "createdAt": "2024-01-01T00:00:00Z",
          "replies": [
            {
              "id": "reply-uuid",
              "commentId": "comment-uuid",
              "userId": "user-uuid",
              "author": "Bob Jones",
              "text": "Best movie ever!",
              "createdAt": "2024-01-01T00:00:00Z"
            }
          ]
        }
      ]
    }
  ]
}
```

---

#### POST /movies
Upload a new movie.

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "genre": "string (required)",
  "releaseDate": "YYYY-MM-DD (optional)",
  "posterUrl": "string (optional)"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "description": "A skilled thief steals secrets through dreams",
    "genre": "Sci-Fi",
    "releaseDate": "2010-07-16",
    "posterUrl": "https://example.com/poster.jpg"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Inception",
  "description": "...",
  "genre": "Sci-Fi",
  "releaseDate": "2010-07-16",
  "posterUrl": "https://example.com/poster.jpg",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### GET /genres
Get list of all available genres.

**Example:**
```bash
GET /api/genres
```

**Response:**
```json
[
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Animation",
  "Documentary",
  "Adventure"
]
```

---

### ⭐ Reviews

#### GET /movies/:movieId/reviews
Get all reviews for a specific movie.

**Parameters:**
- `movieId` (required): Movie UUID
- `reviewType` (optional): Filter by "before-release" or "after-release"

**Example:**
```bash
GET /api/movies/550e8400-e29b-41d4-a716-446655440000/reviews?reviewType=after-release
```

**Response:**
```json
[
  {
    "id": "review-uuid",
    "movieId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-uuid",
    "author": "John Doe",
    "rating": 5,
    "comment": "Amazing movie!",
    "reviewType": "after-release",
    "createdAt": "2024-01-01T00:00:00Z",
    "comments": []
  }
]
```

---

#### POST /movies/:movieId/reviews
Create a new review for a movie.

**Parameters:**
- `movieId` (required): Movie UUID

**Request Body:**
```json
{
  "author": "string (required)",
  "rating": "number 1-5 (required)",
  "comment": "string (required)",
  "reviewType": "before-release | after-release (required)",
  "userId": "string (optional)"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/movies/550e8400-e29b-41d4-a716-446655440000/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "author": "John Doe",
    "rating": 5,
    "comment": "Best movie ever!",
    "reviewType": "after-release"
  }'
```

**Response:**
```json
{
  "id": "review-uuid",
  "movieId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "generated-uuid",
  "author": "John Doe",
  "rating": 5,
  "comment": "Best movie ever!",
  "reviewType": "after-release",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### 💬 Comments

#### POST /reviews/:reviewId/comments
Add a comment to a review.

**Parameters:**
- `reviewId` (required): Review UUID

**Request Body:**
```json
{
  "author": "string (required)",
  "text": "string (required)",
  "userId": "string (optional)"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/reviews/review-uuid/comments \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Jane Smith",
    "text": "I completely agree with this review!"
  }'
```

**Response:**
```json
{
  "id": "comment-uuid",
  "reviewId": "review-uuid",
  "userId": "generated-uuid",
  "author": "Jane Smith",
  "text": "I completely agree with this review!",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### POST /comments/:commentId/replies
Reply to a comment on a review.

**Parameters:**
- `commentId` (required): Comment UUID

**Request Body:**
```json
{
  "author": "string (required)",
  "text": "string (required)",
  "userId": "string (optional)"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/comments/comment-uuid/replies \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Bob Jones",
    "text": "Yes, the cinematography was incredible!"
  }'
```

**Response:**
```json
{
  "id": "reply-uuid",
  "commentId": "comment-uuid",
  "userId": "generated-uuid",
  "author": "Bob Jones",
  "text": "Yes, the cinematography was incredible!",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### 🤖 AI Analysis

#### POST /movies/:movieId/ai-review
Generate an AI-powered film analysis using Claude.

**Parameters:**
- `movieId` (required): Movie UUID

**Example:**
```bash
curl -X POST http://localhost:3001/api/movies/550e8400-e29b-41d4-a716-446655440000/ai-review \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "movieId": "550e8400-e29b-41d4-a716-446655440000",
  "review": "As a genuine film critic, here's my analysis of 'Inception':\n\nPlot Overview:\n[Detailed analysis...]\n\nKey Strengths:\n[Analysis...]\n\nPotential Drawbacks:\n[Analysis...]\n\nWho Should Watch:\n[Analysis...]\n\nOverall Assessment:\n[Analysis...]"
}
```

---

### 🏥 Health Check

#### GET /health
Check if the API is running.

**Example:**
```bash
GET /api/health
```

**Response:**
```json
{
  "status": "ok"
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (missing fields, invalid data) |
| 404 | Not Found (movie/review doesn't exist) |
| 500 | Server Error |

---

## Validation Rules

### Movie
- `title`: Required, non-empty string
- `description`: Required, non-empty string
- `genre`: Required, non-empty string
- `releaseDate`: Optional, valid date format
- `posterUrl`: Optional, valid URL format

### Review
- `author`: Required, non-empty string
- `rating`: Required, integer between 1-5
- `comment`: Required, non-empty string
- `reviewType`: Required, must be "before-release" or "after-release"

### Comment/Reply
- `author`: Required, non-empty string
- `text`: Required, non-empty string

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider:
- Limit requests per IP per minute
- Limit requests per user per day
- Cache AI review requests to save API calls

---

## CORS

CORS is enabled for all origins in development. Configure as needed for production:

```javascript
// server/src/index.js
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

---

## Pagination (Future)

When adding pagination:
```bash
GET /api/movies?page=1&limit=10
GET /api/reviews?movieId=xxx&page=1&limit=20
```

---

## Caching (Future)

Implement caching for:
- Movie lists by genre
- AI review responses
- Comment threads

---

## Authentication (Future)

Add JWT authentication:
```
Authorization: Bearer <token>
```

---

## Examples

### Complete Review Workflow

1. **Add movie**
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dune",
    "description": "Paul Atreides travels to the dangerous planet Tharsis...",
    "genre": "Sci-Fi",
    "releaseDate": "2021-10-22"
  }'
# Response contains: { "id": "movie-id", ... }
```

2. **Add review to movie**
```bash
curl -X POST http://localhost:3001/api/movies/movie-id/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Alice",
    "rating": 5,
    "comment": "Visually stunning!",
    "reviewType": "after-release"
  }'
# Response contains: { "id": "review-id", ... }
```

3. **Add comment to review**
```bash
curl -X POST http://localhost:3001/api/reviews/review-id/comments \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Bob",
    "text": "Agreed!"
  }'
# Response contains: { "id": "comment-id", ... }
```

4. **Reply to comment**
```bash
curl -X POST http://localhost:3001/api/comments/comment-id/replies \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Carol",
    "text": "The cinematography was amazing!"
  }'
```

5. **Get AI analysis**
```bash
curl -X POST http://localhost:3001/api/movies/movie-id/ai-review
# Response contains AI-generated film critique
```
