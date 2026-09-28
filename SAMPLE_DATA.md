# Sample Data - Test the App

Here's sample data you can use to quickly test all features of the Movie Review App.

## How to Add Sample Movies

### Using cURL
Copy and paste these commands in your terminal while the app is running:

#### Movie 1: The Shawshank Redemption
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Shawshank Redemption",
    "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. A classic tale of friendship, hope, and perseverance against all odds.",
    "genre": "Drama",
    "releaseDate": "1994-10-14",
    "posterUrl": "https://via.placeholder.com/300x450/1a1a1a/e50914?text=Shawshank"
  }'
```

#### Movie 2: Inception
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "description": "A skilled thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO. An intricate science fiction masterpiece.",
    "genre": "Sci-Fi",
    "releaseDate": "2010-07-16",
    "posterUrl": "https://via.placeholder.com/300x450/1a1a1a/e50914?text=Inception"
  }'
```

#### Movie 3: Pulp Fiction
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pulp Fiction",
    "description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption. A landmark film in cinema history.",
    "genre": "Thriller",
    "releaseDate": "1994-10-14",
    "posterUrl": "https://via.placeholder.com/300x450/1a1a1a/e50914?text=PulpFiction"
  }'
```

#### Movie 4: The Dark Knight
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Dark Knight",
    "description": "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests to fight injustice. An action thriller like no other.",
    "genre": "Action",
    "releaseDate": "2008-07-18",
    "posterUrl": "https://via.placeholder.com/300x450/1a1a1a/e50914?text=DarkKnight"
  }'
```

#### Movie 5: Spirited Away
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spirited Away",
    "description": "During her family'\''s move to the suburbs, a sullen girl takes solace in a world hidden behind her garage. A magical anime adventure that transcends all ages.",
    "genre": "Animation",
    "releaseDate": "2001-07-20",
    "posterUrl": "https://via.placeholder.com/300x450/1a1a1a/e50914?text=SpiritedAway"
  }'
```

#### Movie 6: Parasite
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Parasite",
    "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan. A brilliant social commentary wrapped in suspense.",
    "genre": "Thriller",
    "releaseDate": "2019-05-30",
    "posterUrl": "https://via.placeholder.com/300x450/1a1a1a/e50914?text=Parasite"
  }'
```

#### Movie 7: The Breakfast Club
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Breakfast Club",
    "description": "Five high school students meet in Saturday detention and discover how they have a lot more in common than they thought. An iconic comedy-drama about teenage life and friendship.",
    "genre": "Comedy",
    "releaseDate": "1985-02-15",
    "posterUrl": "https://via.placeholder.com/300x450/1a1a1a/e50914?text=BreakfastClub"
  }'
```

#### Movie 8: Interstellar
```bash
curl -X POST http://localhost:3001/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Interstellar",
    "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity'\''s survival. An epic sci-fi adventure about love, sacrifice, and human endurance.",
    "genre": "Sci-Fi",
    "releaseDate": "2014-11-07",
    "posterUrl": "https://via.placeholder.com/300x450/1a1a1a/e50914?text=Interstellar"
  }'
```

## Adding Sample Reviews

Once movies are added, add reviews:

### Review 1: The Shawshank Redemption
```bash
curl -X POST http://localhost:3001/api/movies/MOVIE_ID_1/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "author": "John Doe",
    "rating": 5,
    "comment": "Simply the best movie ever made! The writing, acting, cinematography - everything is perfect. Morgan Freeman and Tim Robbins deliver career-best performances. If you haven'\''t seen this, stop reading and go watch it now!",
    "reviewType": "after-release"
  }'
```

### Review 2: Inception
```bash
curl -X POST http://localhost:3001/api/movies/MOVIE_ID_2/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Jane Smith",
    "rating": 5,
    "comment": "Christopher Nolan is a genius. This movie blew my mind! The concept is mind-bending, the action sequences are incredible, and Hans Zimmer'\''s score is absolutely breathtaking. Watched it 5 times and still discovering new details.",
    "reviewType": "after-release"
  }'
```

### Review 3: The Dark Knight
```bash
curl -X POST http://localhost:3001/api/movies/MOVIE_ID_4/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Michael Chen",
    "rating": 4,
    "comment": "Heath Ledger'\''s portrayal of the Joker is absolutely phenomenal. He creates a villain that is both terrifying and captivating. The whole film is a masterclass in tension and storytelling. Highly recommended!",
    "reviewType": "after-release"
  }'
```

### Review 4: Before Release
```bash
curl -X POST http://localhost:3001/api/movies/MOVIE_ID_2/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Sarah Williams",
    "rating": 4,
    "comment": "I'\''m so excited for this movie! Nolan + DiCaprio + mind-bending plot = must watch. The trailers look absolutely amazing. Can'\''t wait to see what secrets are hidden in the dream layers!",
    "reviewType": "before-release"
  }'
```

## Adding Comments and Replies

### Add Comment to Review
```bash
# First, get the review ID from the reviews list
curl -X POST http://localhost:3001/api/reviews/REVIEW_ID/comments \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Alice Johnson",
    "text": "I completely agree! This movie changed my perspective on filmmaking. The attention to detail is insane!"
  }'
```

### Add Reply to Comment
```bash
curl -X POST http://localhost:3001/api/comments/COMMENT_ID/replies \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Bob Garcia",
    "text": "Yes! And the cinematography is just chef'\''s kiss. Deakins is the best in the business."
  }'
```

## Sample Genres Available
- Action
- Comedy
- Drama
- Fantasy
- Horror
- Romance
- Sci-Fi
- Thriller
- Animation
- Documentary
- Adventure

## Testing Workflow

1. **Add movies** using cURL commands above
2. **View movie list** at http://localhost:3000
3. **Filter by genre** - select from dropdown
4. **Search movies** - type in search box
5. **Click View Details** on any movie
6. **Write a review** - fill in the form
7. **Add comments** - engage with other reviews
8. **Try AI analysis** - click "Analyze" button
9. **Test before-release reviews** - mix with after-release reviews

## Manual Testing Checklist

- [ ] Movie upload works
- [ ] Movie list displays correctly
- [ ] Genre filter works
- [ ] Search functionality works
- [ ] Movie details modal opens
- [ ] Can write a review
- [ ] Can rate movies (1-5 stars)
- [ ] Review type selection works
- [ ] Comments section works
- [ ] Can add comments to reviews
- [ ] Can reply to comments
- [ ] AI Film Critic button loads
- [ ] AI generates detailed analysis
- [ ] Average rating calculation is correct
- [ ] Review count is accurate
- [ ] Comments expand/collapse works
- [ ] Modal closes correctly
- [ ] Responsive design on mobile

## Tips for Testing

1. **Test with different ratings** to see rating calculation
2. **Mix review types** (before and after release)
3. **Test deep comment threads** for performance
4. **Try edge cases** like very long reviews
5. **Test search** with partial matches
6. **Test genre filter** with single and multiple selections

## Sample Movie IDs (Replace with actual IDs)

After adding movies, you'll get IDs like:
- MOVIE_ID_1: The Shawshank Redemption
- MOVIE_ID_2: Inception
- MOVIE_ID_3: Pulp Fiction
- MOVIE_ID_4: The Dark Knight
- MOVIE_ID_5: Spirited Away
- MOVIE_ID_6: Parasite
- MOVIE_ID_7: The Breakfast Club
- MOVIE_ID_8: Interstellar

Use these IDs in the review, comment, and AI review endpoints.
