# Quick Start Guide - Movie Review App

Get the app running in 5 minutes! ⚡

## 1️⃣ Get API Key (1 minute)
Visit https://console.anthropic.com and create an API key

## 2️⃣ Install Dependencies (1 minute)
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

## 3️⃣ Setup Environment (1 minute)
```bash
cd server
cp .env.example .env
# Edit .env and add your API key:
# ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## 4️⃣ Run the App (1 minute)
```bash
npm run dev
```

Open http://localhost:3000 in your browser!

---

## 🎬 Test It Out (1 minute)

### Add a Sample Movie
Click "+ Upload Movie" and fill in:
- **Title**: Inception
- **Genre**: Sci-Fi
- **Release Date**: 2010-07-16
- **Description**: A skilled thief steals corporate secrets through dreams

### Write a Review
1. Click "View Details" on the movie card
2. Scroll to "Write a Review"
3. Enter your name, rate it 5 stars
4. Write: "Amazing mind-bending thriller!"
5. Click "Submit Review"

### Try AI Film Critic
1. In movie details, find red "AI Film Critic" section
2. Click "Analyze"
3. Wait for Claude to generate analysis
4. Read detailed film critique!

### Test Comments
1. Scroll down to your review
2. Use the comment input
3. Click "Comment"
4. Test replies to comments

### Try Filters
1. Use genre dropdown
2. Search for "Inception"
3. Combine filters

---

## 📚 Learn More

- **Setup Issues?** → See [SETUP.md](./SETUP.md)
- **API Help?** → See [API_DOCS.md](./API_DOCS.md)
- **All Features?** → See [FEATURES.md](./FEATURES.md)
- **Sample Data?** → See [SAMPLE_DATA.md](./SAMPLE_DATA.md)

---

## 🔧 Troubleshooting

### "ANTHROPIC_API_KEY is not defined"
Make sure .env file exists and has your API key:
```bash
cd server
cat .env  # Should show your key
```

### "Cannot connect to server"
Server not running? Try:
```bash
npm run dev:server
```

### Port 3000/3001 already in use
Change in .env:
```
PORT=3002  # or any free port
```

---

## 📊 What's Included

✅ Full-stack app (React + Express)
✅ AI-powered movie analysis
✅ User reviews & ratings
✅ Comment threads
✅ Genre filtering & search
✅ Dark theme UI
✅ Mobile responsive
✅ Complete documentation

---

## 🚀 Next Steps

1. Explore all features in the UI
2. Read [FEATURES.md](./FEATURES.md) for details
3. Check [API_DOCS.md](./API_DOCS.md) for API info
4. Plan database integration
5. Add user authentication
6. Deploy to production!

---

## 📞 Need Help?

1. Check SETUP.md for common issues
2. Review API_DOCS.md for endpoints
3. Look at FEATURES.md for feature details
4. Browse SAMPLE_DATA.md for test examples

**Happy reviewing! 🎬**
