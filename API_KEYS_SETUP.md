# 🔑 API Keys Setup Guide

## Quick Setup for Phase 4 Features

This guide will help you obtain the necessary API keys to enable AI solutions and YouTube video search.

---

## 1. Google Gemini AI API Key (For AI Solutions)

### Steps:

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key" button
   - Select an existing Google Cloud project or create new one
   - Copy the generated API key

3. **Add to .env file**
   ```bash
   GEMINI_API_KEY=AIzaSy...your-key-here
   ```

### Free Tier Limits:
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ Free for testing and development

### Documentation:
- API Docs: https://ai.google.dev/docs
- Pricing: https://ai.google.dev/pricing

---

## 2. YouTube Data API Key (For Video Search)

### Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Click project dropdown at top
   - Click "New Project"
   - Enter project name (e.g., "ExamVerse")
   - Click "Create"

3. **Enable YouTube Data API v3**
   - In search bar, type "YouTube Data API v3"
   - Click on it
   - Click "Enable" button

4. **Create Credentials**
   - Click "Create Credentials" button
   - Select "API Key"
   - Copy the generated API key
   - (Optional) Click "Restrict Key" to limit usage

5. **Add to .env file**
   ```bash
   YOUTUBE_API_KEY=AIzaSy...your-key-here
   ```

### Free Tier Limits:
- ✅ 10,000 quota units per day
- ✅ 1 search = 100 units (100 searches/day)
- ✅ Free for testing and development

### Quota Management:
- Each API call costs quota units:
  - `search.list`: 100 units
  - `videos.list`: 1 unit
- Monitor usage in Google Cloud Console

### Documentation:
- API Docs: https://developers.google.com/youtube/v3
- Quota Calculator: https://developers.google.com/youtube/v3/determine_quota_cost

---

## 3. Update Your .env File

Open `backend/.env` and add both keys:

```bash
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=examverse
SECRET_KEY=examverse-secret-key-change-in-production-2024

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# OCR Configuration (Optional)
OCR_SPACE_API_KEY=K82602779688957

# Google Gemini AI (For AI solutions) ⬇️ ADD THIS
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# YouTube API (For video search) ⬇️ ADD THIS
YOUTUBE_API_KEY=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

---

## 4. Restart Your Server

```bash
cd backend
uvicorn app.main:app --reload
```

---

## 5. Test the Integration

### Test AI Solution Generation:

```bash
# Using curl
curl -X POST http://localhost:8000/questions/{question_id}/ai-solution

# Or visit Swagger UI
http://localhost:8000/docs
```

### Test YouTube Video Search:

```bash
# Using curl
curl http://localhost:8000/questions/{question_id}/videos

# Or visit Swagger UI
http://localhost:8000/docs
```

---

## ⚠️ Important Notes

### Security:
- **Never commit .env file to git**
- **Never share API keys publicly**
- **Use .gitignore to exclude .env**

### Rate Limiting:
- Implement caching (already done ✅)
- Add request throttling on frontend
- Monitor API usage in Google Cloud Console

### Development vs Production:
- **Development**: Use separate API keys
- **Production**: Restrict API keys by IP/domain
- **Environment**: Use different .env files

---

## 🔍 Troubleshooting

### "Gemini API key not configured"
- Check if `GEMINI_API_KEY` is set in `.env`
- Restart the server after adding key
- Verify key is valid (no extra spaces)

### "YouTube API key not configured"
- Check if `YOUTUBE_API_KEY` is set in `.env`
- Ensure YouTube Data API v3 is enabled
- Verify quota hasn't been exceeded

### API Key Not Working:
1. Check for typos in `.env` file
2. Ensure no extra quotes or spaces
3. Verify API is enabled in Google Cloud Console
4. Check API key restrictions

### Quota Exceeded:
1. Wait for quota reset (midnight Pacific Time)
2. Request quota increase in Google Cloud Console
3. Implement better caching (already done)
4. Add rate limiting on frontend

---

## 📊 Cost Estimation

### For Small to Medium Usage (100-500 users):

| Service | Free Tier | Cost After Free Tier |
|---------|-----------|---------------------|
| Gemini AI | 1,500 req/day | $0.00025 per request |
| YouTube API | 10,000 units/day | $0 (rarely exceeded) |

### Expected Monthly Cost:
- **Development**: $0 (within free tier)
- **Production**: ~$5-20/month (depends on usage)

---

## ✅ Checklist

- [ ] Created Google account
- [ ] Obtained Gemini API key
- [ ] Obtained YouTube API key
- [ ] Added both keys to `.env` file
- [ ] Restarted server
- [ ] Tested AI solution generation
- [ ] Tested video search
- [ ] Verified API quotas in Google Cloud Console

---

## 🎯 Next Steps

Once both APIs are configured:
1. Upload a paper PDF using `/papers/upload`
2. Questions will be auto-extracted
3. Click "Generate AI Solution" on any question
4. Click "Watch Video" to see YouTube explanations
5. Solutions are cached for future use

---

## 📚 Additional Resources

- [Google AI Documentation](https://ai.google.dev/docs)
- [YouTube API Documentation](https://developers.google.com/youtube/v3)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [ExamVerse API Docs](http://localhost:8000/docs)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify API keys in Google Cloud Console
3. Test API keys with simple requests
4. Review the error messages in API responses

---

*Last Updated: November 1, 2025*
*ExamVerse Backend v1.0.0*
