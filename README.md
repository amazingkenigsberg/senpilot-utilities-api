# Senpilot Utilities API

Standalone API service for CSR (Customer Service Representative) testing and VAPI voice agent integration.

## What's Inside

This service provides mock utility company data for testing voice agents and customer service flows:

### 1. **CSR Utilities API** (`/csr-utilities/*`)
6 tool endpoints designed for VAPI function calling:
- `GET /csr-utilities/check-balance` - Check customer account balance
- `GET /csr-utilities/check-outages` - Check service outages
- `GET /csr-utilities/check-meter` - Get current meter reading
- `GET /csr-utilities/analyze-meter` - Analyze usage patterns
- `GET /csr-utilities/analyze-bills` - Get billing history
- `POST /csr-utilities/create-ticket` - Create support tickets

### 2. **GreenLeaf Mock API** (`/greenleaf/*`)
Simulates a quirky external utility company with spiritual themes:
- `GET /greenleaf/health` - Health check with personality
- `GET /greenleaf/api/v2/customer/lookup/by-phone` - Customer lookup

### 3. **Test Data**
Realistic but humorous test data for 3 utilities:
- **ZapCo Electric** (Direct access)
- **AquaFlow Water** (Direct access)
- **GreenLeaf Energy** (External API simulation)

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The server runs on `http://localhost:3000` by default.

### Test Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Check balance for ZapCo customer
curl "http://localhost:3000/csr-utilities/check-balance?utility=zapco&identifier=phone&value=555-0123"

# GreenLeaf health check
curl http://localhost:3000/greenleaf/health
```

## Test Data

### ZapCo Electric (Direct Access)
- Phone: `555-0123` → Account: `ZC-47291`
- Phone: `555-9876` → Account: `ZC-88203` (Bartholomew Skittles - cash only!)

### AquaFlow Water (Direct Access)
- Phone: `555-2468` → Account: `AF-11947`
- Phone: `555-7531` → Account: `AF-55821`

### GreenLeaf Energy (External API)
- Phone: `555-1111` → Account: `GL-2024-SAGE`
- Phone: `555-3333` → Account: `GL-2024-CYPRESS`

## Deploy to Render

### Option 1: One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Option 2: Manual Deployment

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Senpilot Utilities API"
   git branch -M main
   git remote add origin git@github.com:YOUR_USERNAME/senpilot-utilities-api.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Configure:
     - **Name**: `senpilot-utilities-api`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Get Your URL**:
   ```
   https://senpilot-utilities-api.onrender.com
   ```

## Integrate with VAPI

Once deployed, configure your main backend with:

```bash
# Environment variables
UTILITIES_API_URL=https://senpilot-utilities-api.onrender.com
```

Update your VAPI assistant configuration to call:
```
https://senpilot-utilities-api.onrender.com/csr-utilities/*
```

## API Reference

### Check Account Balance

```http
GET /csr-utilities/check-balance?utility=zapco&identifier=phone&value=555-0123
```

**Response:**
```json
{
  "utility": "ZapCo Electric",
  "customer_name": "John Doe",
  "account_number": "ZC-47291",
  "current_balance": 127.45,
  "account_status": "active",
  "last_payment": {
    "date": "2024-11-15",
    "amount": 98.32
  },
  "autopay": true
}
```

### Check Outages

```http
GET /csr-utilities/check-outages?utility=zapco&zip_code=97201
```

**Response:**
```json
{
  "utility": "ZapCo Electric",
  "zip_code": "97201",
  "current_outages": 0,
  "affected_customers": 0,
  "estimated_restoration": null,
  "message": "No outages reported in your area"
}
```

### Check Meter

```http
GET /csr-utilities/check-meter?utility=zapco&account_number=ZC-47291
```

**Response:**
```json
{
  "utility": "ZapCo Electric",
  "account_number": "ZC-47291",
  "current_reading": 45892,
  "previous_reading": 45234,
  "usage": 658,
  "read_date": "2024-11-30"
}
```

### Create Ticket

```http
POST /csr-utilities/create-ticket
Content-Type: application/json

{
  "utility": "zapco",
  "account_number": "ZC-47291",
  "issue_type": "billing_question",
  "description": "Question about recent charges",
  "priority": "medium"
}
```

**Response:**
```json
{
  "ticket_id": "TKT-1701234567-ABC123",
  "utility": "zapco",
  "account_number": "ZC-47291",
  "issue_type": "billing_question",
  "description": "Question about recent charges",
  "priority": "medium",
  "status": "open",
  "created_at": "2024-12-04T10:30:00.000Z"
}
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Senpilot Utilities API (Single Service)            │
│                                                      │
│  ┌────────────────────┐  ┌─────────────────────┐   │
│  │ CSR Utilities API  │  │ GreenLeaf Mock API  │   │
│  │  /csr-utilities/*  │  │   /greenleaf/*       │   │
│  └────────────────────┘  └─────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │           Test Databases                     │   │
│  │  • ZapCo (6 customers, 4 bills)             │   │
│  │  • AquaFlow (5 customers, 4 bills)           │   │
│  │  • GreenLeaf (5 customers, 4 bills)         │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                         ↑
                         │ HTTPS
                         │
                  ┌──────┴──────┐
                  │ VAPI Agent  │
                  └─────────────┘
```

## Why Separate Repo?

- ✅ Deploy independently without main repo permissions
- ✅ Easy to test and iterate on utility data
- ✅ Clean separation of testing infrastructure
- ✅ Can be shared across multiple projects
- ✅ Simpler Render deployment configuration

## License

MIT

## Support

For issues or questions, open an issue on GitHub.
