# VMC Complaint Management System - Setup Guide

## Overview

This is a complete, production-ready complaint management system built with Next.js, Supabase, and multiple integration channels (Web, Twilio IVR/SMS, WhatsApp, Social Media).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── admin/setup-db/          # Database setup endpoint
│   │   ├── complaints/
│   │   │   ├── create/              # Create new complaint
│   │   │   ├── list/                # List complaints
│   │   │   └── [id]/                # Get/update complaint details
│   │   ├── ai/
│   │   │   └── process/             # AI processing (classification, priority)
│   │   └── integrations/
│   │       ├── twilio/webhook/      # Twilio IVR & SMS webhook
│   │       └── whatsapp/webhook/    # WhatsApp Business API webhook
│   ├── dashboard/
│   │   ├── page.tsx                 # Officer dashboard (complaints queue)
│   │   └── complaints/[id]/page.tsx # Complaint detail & management
│   ├── form/                        # Public complaint filing form
│   ├── track/[id]/                  # Public complaint tracking
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Theme & styling
├── lib/
│   ├── types.ts                     # TypeScript type definitions
│   └── supabase-server.ts           # Supabase client initialization
└── scripts/
    ├── 01-init-schema.sql           # Database schema migration
    └── migrate.mjs                  # Migration runner scripts
```

## Database Setup

### 1. Initialize Database Schema

The database schema includes:
- Users table (with roles: citizen, officer, admin, supervisor)
- Complaints table (with status tracking and AI fields)
- Attachments table
- Complaint updates/audit trail
- AI processing logs
- Integration logs (Twilio, WhatsApp)
- Notifications
- Views for officer dashboard and analytics

### 2. Run Database Migration

You have two options:

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to Supabase Dashboard > SQL Editor
2. Create a new query
3. Copy the entire contents of `scripts/01-init-schema.sql`
4. Run the query

**Option B: Via Setup Endpoint**
```bash
curl -X POST http://localhost:3000/api/admin/setup-db \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json"
```

### 3. Verify Database

Check that all tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

## Environment Variables

Required environment variables (already set in Supabase integration):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
POSTGRES_URL=your_postgres_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling

# AI Processing
USE_MOCK_AI=true  # Set to false to use real Groq API
GROQ_API_KEY=your_groq_api_key  # Only needed if USE_MOCK_AI=false

# Twilio (Optional for real integration)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
USE_MOCK_TWILIO=true

# WhatsApp (Optional for real integration)
WHATSAPP_BUSINESS_PHONE_ID=your_whatsapp_phone_id
WHATSAPP_BUSINESS_TOKEN=your_whatsapp_token
WHATSAPP_VERIFY_TOKEN=your_verify_token

# Admin
ADMIN_SECRET=your_admin_secret_for_setup_endpoint
```

## Features

### 1. Public Complaint Filing
- **Web Form** (`/form`) - Complete complaint form with file uploads
- **Twilio IVR** - Voice-based complaint registration via phone
- **SMS** - Text-based complaint submission
- **WhatsApp** - Chatbot-based complaint filing
- **Social Media** - Integration ready (implementation needed)

### 2. Complaint Tracking
- Public tracking page (`/track/[id]`)
- Real-time status updates
- Reference number generation (VHB-YYYY-XXXXX format)
- Timeline visualization

### 3. Officer Dashboard
- Complaints queue with filtering
- Status, priority, and search filters
- Complaint detail view with update capabilities
- AI analysis display
- Timeline tracking

### 4. AI Processing
- Automatic complaint classification
- Priority assessment
- Duplicate detection
- Mock mode for testing (USE_MOCK_AI=true)
- Real integration with Groq (set USE_MOCK_AI=false + add GROQ_API_KEY)

### 5. Integrations
- **Twilio**: IVR system for complaint registration via phone
- **WhatsApp**: Business API integration for complaint collection
- **Webhook Support**: Receive messages from external systems
- **Extensible**: Easy to add more channels (SMS, Social, Email, etc.)

## API Endpoints

### Complaints
```
POST   /api/complaints/create          # File a complaint
GET    /api/complaints/list            # Get complaints (with filters)
GET    /api/complaints/[id]            # Get complaint details
PATCH  /api/complaints/[id]            # Update complaint
```

### AI Processing
```
POST   /api/ai/process                 # Classify/assess complaint
```

### Integrations
```
POST   /api/integrations/twilio/webhook    # Twilio IVR/SMS webhook
POST   /api/integrations/whatsapp/webhook  # WhatsApp webhook
GET    /api/integrations/whatsapp/webhook  # WhatsApp verification
```

### Admin
```
POST   /api/admin/setup-db             # Initialize database
GET    /api/admin/setup-db             # Setup status
```

## Testing the System

### 1. Test Web Form
1. Go to http://localhost:3000
2. Click "File a Complaint"
3. Fill out the form and submit
4. Get a complaint reference number

### 2. Test Status Tracking
1. Use the reference number from step 1
2. Go to http://localhost:3000/track/VHB-2024-XXXXX
3. View complaint details and status updates

### 3. Test Officer Dashboard
1. Go to http://localhost:3000/dashboard
2. View all complaints with filters
3. Click "View" to see complaint details
4. Update status, priority, and add notes

### 4. Test AI Processing
- The system automatically processes complaints when filed
- Set `USE_MOCK_AI=true` for mock responses
- Set `USE_MOCK_AI=false` + provide `GROQ_API_KEY` for real AI

### 5. Test Integrations
- **Mock Twilio**: Complaints filed via IVR appear in dashboard
- **Mock WhatsApp**: Messages sent to webhook are converted to complaints

## Deployment

### Deploy to Vercel
```bash
git push origin main
```

The application will automatically:
1. Build the Next.js project
2. Run database migrations (via /api/admin/setup-db if needed)
3. Deploy to Vercel edge network

### Production Checklist
- [ ] Set up real Supabase project
- [ ] Configure Twilio credentials (if using real IVR/SMS)
- [ ] Configure WhatsApp Business API (if using real WhatsApp)
- [ ] Set Groq API key for real AI processing
- [ ] Enable HTTPS and proper security headers
- [ ] Set up monitoring and error tracking
- [ ] Configure email notifications for updates
- [ ] Set up backup strategy for database
- [ ] Test all integration webhooks with production numbers

## Key Files Overview

### Database Schema (`scripts/01-init-schema.sql`)
- 441 lines of SQL
- Creates all tables with proper indexes
- Enables Row Level Security (RLS)
- Includes useful views for dashboards

### API Routes
- **create**: Generate complaint ID, store in DB, trigger AI
- **list**: Query with filtering by status/priority/category
- **[id]**: Fetch details with updates and AI logs
- **ai/process**: Mock/real classification and priority assessment
- **webhooks**: Parse Twilio/WhatsApp messages into complaints

### Frontend Pages
- **Home** (`/`): Marketing page with feature overview
- **Form** (`/form`): Responsive complaint filing form
- **Track** (`/track/[id]`): Public status tracking interface
- **Dashboard** (`/dashboard`): Officer management console

## Customization

### Add New Complaint Categories
Edit `lib/types.ts`:
```typescript
export type ComplaintCategory = 
  | 'water_supply' 
  | 'your_new_category'
  | ...
```

### Change Color Theme
Edit `app/globals.css` - modify CSS variables in `:root` section

### Add New Integration Channel
1. Create new webhook route in `app/api/integrations/[channel]/webhook/`
2. Parse incoming data into complaint format
3. Call `/api/complaints/create` API

### Customize AI Logic
Edit `app/api/ai/process/route.ts`:
- Modify classification rules
- Adjust priority assessment
- Improve duplicate detection

## Support & Maintenance

### Monitor System Health
- Check Supabase logs for database errors
- Review webhook logs for integration issues
- Monitor AI processing performance

### Common Issues

**Complaint not appearing in dashboard:**
- Check Supabase database directly
- Verify RLS policies allow access
- Check integration_logs table for errors

**AI processing not working:**
- Verify USE_MOCK_AI setting
- Check GROQ_API_KEY if using real API
- Review ai_processing_log table

**Webhooks not working:**
- Verify webhook URL is accessible
- Check integration_logs for failed requests
- Review request/response data in logs

## Next Steps

1. **Database Setup**: Run the SQL migration to create tables
2. **Test Filing**: File a complaint through the web form
3. **Test Tracking**: View complaint status
4. **Test Dashboard**: Access officer dashboard
5. **Configure Integrations**: Set up Twilio/WhatsApp as needed
6. **Customize**: Modify categories, theme, and workflows
7. **Deploy**: Push to Vercel for production

## Technology Stack

- **Framework**: Next.js 16 with React 19
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth + Custom
- **AI**: Groq API (with mock fallback)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Integrations**: Twilio SDK, Axios
- **Deployment**: Vercel

---

Built with v0 • Powered by Vercel
