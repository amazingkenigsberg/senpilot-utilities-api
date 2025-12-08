# Deploying to Render

## Prerequisites
- GitHub account with the utilities API repository
- Render account (free tier works fine)

## Step-by-Step Deployment Guide

### 1. Commit and Push Your Changes

```bash
cd /Users/danielkenigsberg/senpilot-utilities-api

# Check what's changed
git status

# Add all changes
git add .

# Commit
git commit -m "Prepare for Render deployment with PostgreSQL database"

# Push to GitHub
git push origin main  # or master, depending on your branch name
```

### 2. Deploy to Render Using Dashboard

#### Option A: Using render.yaml (Recommended)

1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository `senpilot-utilities-api`
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to create both the database and web service
6. Wait for deployment to complete (5-10 minutes)

#### Option B: Manual Setup

If the Blueprint doesn't work, create services manually:

**Create PostgreSQL Database:**
1. Go to https://dashboard.render.com
2. Click "New" → "PostgreSQL"
3. Name: `utilities-db`
4. Database: `utilities_db`
5. User: `utilities_user`
6. Region: Oregon (or closest to you)
7. Plan: Free
8. Click "Create Database"
9. Wait for database to be ready
10. Copy the "Internal Database URL" (starts with `postgresql://`)

**Create Web Service:**
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - Name: `senpilot-utilities-api`
   - Region: Oregon
   - Branch: `main` (or `master`)
   - Root Directory: leave blank
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Plan: Free
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = [paste the Internal Database URL from step 10 above]
5. Click "Create Web Service"

### 3. Verify Deployment

Once deployed, you'll get a URL like: `https://senpilot-utilities-api.onrender.com`

Test the endpoints:

```bash
# Health check
curl https://senpilot-utilities-api.onrender.com/health

# Test account balance endpoint
curl -X POST https://senpilot-utilities-api.onrender.com/csr-utilities \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "toolCallList": [{
        "id": "test-1",
        "function": {
          "name": "check_account_balance",
          "arguments": "{\"utility\":\"zapco\",\"identifier\":\"phone\",\"value\":\"503-555-DROP\"}"
        }
      }]
    }
  }'
```

### 4. Update Frontend Admin Panel

Update the API URL in your frontend admin panel:

Edit `/Users/danielkenigsberg/senpilot/app/packages/frontend/src/pages/admin/pages/utilities-api/UtilitiesApi.tsx`:

Change line ~239:
```typescript
const response = await fetch("https://senpilot-utilities-api.onrender.com/csr-utilities", {
```

### 5. Update VAPI Configuration

In your main senpilot repo, update any VAPI configuration to point to the new Render URL:

```
https://senpilot-utilities-api.onrender.com/csr-utilities
```

## Troubleshooting

### Database Migration Issues
If migrations fail on first deploy:
1. Go to Render dashboard → your web service
2. Click "Shell" tab
3. Run: `npx prisma migrate deploy`
4. Run: `npx tsx src/seed.ts`
5. Restart the service

### Viewing Logs
1. Go to Render dashboard → your web service
2. Click "Logs" tab to see real-time logs
3. Look for:
   - `✨ Senpilot Utilities API running on port...`
   - `✅ Seeded X customers...`

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid tier for production use

## What Happens on Deploy

1. **Build Phase:**
   - Installs npm packages
   - Generates Prisma client
   - Compiles TypeScript to JavaScript

2. **Start Phase:**
   - Runs database migrations (`prisma migrate deploy`)
   - Seeds the database with test data (ZapCo, AquaFlow customers)
   - Starts the Express server

3. **Database:**
   - Creates PostgreSQL database with 3 tables:
     - `utility_tenant` (zapco, aquaflow, greenleaf)
     - `utility_customer` (11 test customers)
     - `utility_bill` (8 test bills)

## Endpoints Available

After deployment, these endpoints will be live:

- `GET /health` - Health check
- `POST /csr-utilities` - Main VAPI webhook (handles all 6 tools)
- `GET /csr-utilities/check-balance` - Check account balance
- `GET /csr-utilities/check-outages` - Check outage map
- `GET /csr-utilities/check-meter` - Get current meter reading
- `GET /csr-utilities/analyze-meter` - Analyze meter usage trends
- `GET /csr-utilities/analyze-bills` - Analyze billing history  
- `POST /csr-utilities/create-ticket` - Create support ticket
- GreenLeaf mock API endpoints under `/greenleaf/*`

## Cost

**Free Tier (both services):**
- PostgreSQL: 1GB storage, 97 hours/month compute
- Web Service: 750 hours/month, spins down after inactivity

**No credit card required for free tier**
