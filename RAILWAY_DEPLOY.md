# Deploying Career Compass to Railway

## Quick Deploy Steps

### 1. Create a New Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo" and select this repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create and link the database
4. The `DATABASE_URL` environment variable will be set automatically

### 3. Configure Environment Variables

In your web service settings, add these variables:

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `SESSION_SECRET` | Random 32+ character string | Yes |
| `ENCRYPTION_KEY` | Random 32+ character string | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | No (for AI coaching) |

**Generate secure secrets:**
```bash
# Generate SESSION_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY
openssl rand -base64 32
```

### 4. Configure Build Settings

Railway should auto-detect these, but verify:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 5. Initialize Database Schema

After your first deployment, run this **once** via Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run database migration
railway run npm run db:push
```

### 6. Deploy

1. Push your code to GitHub
2. Railway will automatically build and deploy
3. Your app will be available at the Railway-provided URL

## Environment-Specific Configuration

### Development (Local)
- Uses Docker Compose for PostgreSQL
- Environment variables from `.env` file
- Run with `npm run dev`

### Production (Railway)
- Uses Railway's managed PostgreSQL
- Environment variables from Railway dashboard
- Automatic deployments from GitHub
- Run with `npm start`

## Common Issues

### Issue: "DATABASE_URL must be set"
**Solution**: Ensure PostgreSQL service is created and linked to your web service in Railway

### Issue: Database tables don't exist
**Solution**: Run `railway run npm run db:push` to initialize the schema

### Issue: Session/Cookie issues
**Solution**: Ensure `SESSION_SECRET` is set in Railway environment variables

### Issue: "Application failed to respond"
**Solution**: Check Railway logs for errors. Ensure `PORT` environment variable is not set (Railway sets this automatically)

## Monitoring

View logs in Railway dashboard:
1. Click on your web service
2. Go to "Deployments" tab
3. Click on the latest deployment
4. View logs in real-time

## Database Management

### Access Railway PostgreSQL

```bash
# Via Railway CLI
railway run psql $DATABASE_URL

# Or get connection string
railway variables
# Look for DATABASE_URL
```

### View users table
```bash
railway run psql $DATABASE_URL -c "SELECT id, username, xp, level FROM users;"
```

## Cost Considerations

Railway offers:
- **Free Tier**: $5 credit per month
- **Hobby Plan**: $5/month (500 hours)
- **Pro Plan**: Pay-as-you-go

Your app should stay within free tier limits for development/testing.

## Automatic Deployments

Railway automatically deploys when you push to your main branch. To disable:
1. Go to service settings
2. Under "Deploy Triggers"
3. Toggle off "Automatic Deployments"

## Custom Domain (Optional)

1. In Railway service settings
2. Go to "Settings" → "Networking"
3. Click "Generate Domain" or add custom domain
4. Follow DNS configuration instructions
