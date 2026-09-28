# Setup Guide for Movie Review App

## Quick Start (5 minutes)

### Step 1: Get Your API Key
1. Visit https://console.anthropic.com
2. Sign up or log in to your Anthropic account
3. Create a new API key
4. Copy the key (it starts with `sk-ant-`)

### Step 2: Install & Configure
```bash
# Navigate to project
cd /home/user/review24

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env and paste your API key:
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# Install client dependencies
cd ../client
npm install
cd ..
```

### Step 3: Run the App
```bash
# Start both server and client
npm run dev
```

Open browser to http://localhost:3000

## Detailed Setup

### System Requirements
- Node.js 18 or higher
- npm or yarn
- ~500MB disk space
- Active internet connection (for AI features)

### Environment Setup

#### Option A: Using .env file (Recommended)
```bash
cd server
cp .env.example .env
# Edit .env with your favorite editor
nano .env
```

Edit the file to include:
```
PORT=3001
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
NODE_ENV=development
```

#### Option B: Using Environment Variables
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key
npm run dev:server
```

### Development vs Production

#### Development Mode
```bash
npm run dev
```
- Hot reload enabled
- Source maps for debugging
- Detailed error messages
- Mock data support (future)

#### Production Build
```bash
npm run build
npm start
```
- Optimized bundle size
- Minified code
- Production-ready

## Testing the Application

### 1. Upload Sample Movies
Click "+ Upload Movie" and add:
- **Title**: The Shawshank Redemption
- **Genre**: Drama
- **Release Date**: 1994-10-14
- **Description**: Two imprisoned men bond over a number of years...

### 2. Write Test Reviews
- Rate 5 stars
- Review Type: After Release
- Comment: "Amazing movie! Highly recommended."

### 3. Test Comments & Replies
- Click "Show comments" on a review
- Add a comment in the input
- Reply to existing comments

### 4. Try AI Analysis
- Click "Analyze" button in AI Film Critic section
- Wait for Claude to generate insights

### 5. Test Search & Filter
- Use genre dropdown to filter
- Use search box to find movies
- Combine filters for more results

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY is not defined"
**Solution**: 
- Check if .env file exists in server directory
- Verify the key is correctly set
- Restart the server after changing .env

```bash
cd server
cat .env  # Check if file exists and has correct key
```

### Issue: "Cannot GET /api/movies"
**Solution**: 
- Ensure backend is running on port 3001
- Check if Express server started successfully
- Look for errors in server terminal

```bash
cd server
npm run dev
```

### Issue: Port already in use
**Solution**: 
Either kill the process or use different port:

```bash
# Find process using port 3001
lsof -i :3001

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=3002
```

### Issue: AI features not working
**Solution**:
1. Verify API key is correct: https://console.anthropic.com
2. Check API key hasn't expired
3. Ensure you have API quota available
4. Try using the API key directly in a test:

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: sk-ant-your-key" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model": "claude-3-5-sonnet-20241022", "max_tokens": 100, "messages": [{"role": "user", "content": "test"}]}'
```

### Issue: Frontend won't connect to backend
**Solution**:
- Verify backend is running (should see "Server running on port 3001")
- Check frontend terminal for errors
- Ensure CORS is not blocking (already configured)
- Restart both servers

## Performance Tips

### For Better Performance
1. **Use a real database** instead of in-memory:
   - MongoDB (easy to setup)
   - PostgreSQL (more robust)
   - Firebase (serverless option)

2. **Cache AI responses**:
   - Store AI reviews in database
   - Avoid regenerating for same movie

3. **Optimize images**:
   - Compress poster images
   - Use optimized image URLs

4. **Database indexing**:
   - Index movie titles for search
   - Index genres for filtering

## Deployment

### Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set ANTHROPIC_API_KEY=sk-ant-your-key

# Deploy
git push heroku main
```

### Deploy to Vercel (Frontend)
```bash
npm install -g vercel
cd client
vercel --prod
```

### Deploy to Railway
```bash
# Push code to GitHub
# Connect repo to Railway
# Set ANTHROPIC_API_KEY in environment
# Auto-deploy on push
```

## Monitoring

### Logs
```bash
# Backend logs
npm run dev:server

# Frontend build logs
npm run build:client
```

### API Monitoring
Add this to track API calls:
- Use browser DevTools Network tab
- Check server console for requests
- Monitor API response times

## Next Steps

1. ✅ Install and run locally
2. ✅ Test with sample data
3. ✅ Customize styling (client/src/index.css)
4. ✅ Add authentication (future enhancement)
5. ✅ Setup database (production)
6. ✅ Deploy to cloud

## Need Help?

1. Check README.md for feature documentation
2. Review API endpoints in README.md
3. Check component code for implementation details
4. Visit Anthropic docs: https://docs.anthropic.com

## Support Contacts
- Anthropic API Issues: https://console.anthropic.com/help
- Project Issues: Create GitHub issue with details
- Feature Requests: Open discussion thread
