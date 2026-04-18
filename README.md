# VMC Complaint Management System

A complete, production-ready municipal complaint management system for Vadodara Municipal Corporation with modern dark-mode UI, multi-channel intake, AI-powered processing, and real-time tracking.

## 🎯 Overview

This is a **full-stack web application** built with Next.js 16, Supabase PostgreSQL, and TypeScript. It provides:

- **Multi-channel complaint intake**: Web form, Twilio IVR/SMS, WhatsApp Business API
- **AI-powered processing**: Complaint classification, duplicate detection, priority assignment using Groq
- **Officer dashboard**: Real-time complaint queue with filtering and status updates
- **Citizen tracking**: Public complaint tracking by ID
- **Production-ready infrastructure**: Row-level security, audit trails, comprehensive error handling

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js)              │
├─────────────────────────────────────────┤
│  • Home Page (landing)                  │
│  • Complaint Form (web intake)          │
│  • Tracking Page (citizen view)         │
│  • Officer Dashboard (management)       │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│      API Routes (Server Actions)        │
├─────────────────────────────────────────┤
│  • POST /api/complaints/create          │
│  • GET  /api/complaints/list            │
│  • GET  /api/complaints/[id]            │
│  • PATCH /api/complaints/[id]           │
│  • POST /api/integrations/twilio/*      │
│  • POST /api/integrations/whatsapp/*    │
│  • POST /api/ai/process                 │
│  • POST /api/admin/setup-db             │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   Supabase (PostgreSQL Database)        │
├─────────────────────────────────────────┤
│  • complaints (core table)              │
│  • complaint_updates (timeline)         │
│  • officers (staff directory)           │
│  • integrations_log (audit trail)       │
│  • ai_processing_log (ML tracking)      │
│  And 5+ supporting tables               │
└─────────────────────────────────────────┘
```

## 📋 Database Schema

### Core Tables

**complaints**
- `id` (UUID, PK) - Unique complaint identifier
- `citizen_name`, `citizen_email`, `citizen_phone` - Filer information
- `category` - Complaint type (water_supply, roads, garbage, etc.)
- `title`, `description` - Complaint content
- `location`, `location_coordinates` - Address with lat/lng
- `status` - Workflow state (registered, assigned, in_progress, resolved, closed)
- `priority` - Urgency level (low, medium, high, critical)
- `intake_channel` - Source (website, ivr, sms, whatsapp, social)
- `assigned_officer`, `officer_department` - Assignment tracking
- `created_at`, `updated_at` - Timestamps
- Full row-level security (RLS) enabled

**complaint_updates**
- `id` (UUID, PK)
- `complaint_id` (FK to complaints)
- `status` - New status
- `notes` - Update details
- `updated_by` - Officer who made update
- `created_at`
- Forms complete audit trail

**officers**
- `id` (UUID, PK)
- `name`, `email`, `phone`
- `department` - Assigned department
- `is_active` - Enable/disable

**integrations_log**
- Tracks all external API calls (Twilio, WhatsApp, Groq)
- Records request/response data for debugging

**ai_processing_log**
- Logs all AI classification and priority decisions
- Includes model confidence scores

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account with PostgreSQL database

### Installation

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd v0-project
   pnpm install
   ```

2. **Database Setup**
   - Supabase integration is pre-configured
   - Visit `http://localhost:3000/api/admin/setup-db` to initialize schema
   - This creates all tables, indexes, and RLS policies

3. **Environment Variables**
   Already configured via Supabase integration:
   - `POSTGRES_URL` - Supabase connection string
   - Add these for full features:
     - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
     - `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_API_TOKEN`
     - `GROQ_API_KEY` - For AI processing
     - Optional: `USE_MOCK_AI=true` for testing without costs

4. **Start Development**
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000

## 📱 Features by Channel

### Web Form (`/form`)
- Full complaint registration with validation
- Category, title, description, location
- Optional: File uploads, coordinates
- Real-time success confirmation
- Complaint tracking integration

### IVR/SMS (Twilio)
- Webhook: `POST /api/integrations/twilio/webhook`
- Automated voice system for phone complaints
- SMS confirmation and tracking
- Requires Twilio setup

### WhatsApp Bot
- Webhook: `POST /api/integrations/whatsapp/webhook`
- Natural language chat interface
- Instant complaint registration
- Requires WhatsApp Business API setup

### Officer Dashboard (`/dashboard`)
- Real-time complaint queue
- Filter by status, priority, category
- Search functionality
- Click-to-open detail view
- Status update workflow
- Update history timeline

### Public Tracking (`/track`)
- Search by complaint ID
- Real-time status updates
- Complete complaint details
- Status history timeline

## 🤖 AI Processing

All complaints automatically processed through Groq:

1. **Classification** - Categories and subcategories
2. **Duplicate Detection** - Identifies similar complaints
3. **Priority Assessment** - Assigns urgency level
4. **Department Routing** - Suggests responsible officer

**Mock Mode**: Set `USE_MOCK_AI=true` to use predefined responses (free testing)

## 🔒 Security Features

- **Row-Level Security (RLS)** - Officers only see their department's complaints
- **Data Encryption** - PostgreSQL native encryption
- **Audit Trail** - Every change logged in integrations_log
- **Input Validation** - All forms validated server-side
- **CORS Protection** - Restricted webhook endpoints
- **Rate Limiting** - Webhook endpoints throttled

## 📊 API Endpoints

### Public Endpoints

**POST /api/complaints/create**
- Create new complaint
- Body: citizen info, category, title, description, location
- Returns: complaint_id

**GET /api/complaints/[id]**
- Fetch complaint details by ID
- Returns: full complaint object with updates

### Protected Endpoints (Officer)

**GET /api/complaints/list**
- List all complaints (filtered by officer's department via RLS)
- Query params: status, priority, category

**PATCH /api/complaints/[id]**
- Update complaint status
- Body: new status, update notes
- Returns: updated complaint

### Integration Endpoints

**POST /api/integrations/twilio/webhook**
- Twilio inbound webhook
- Headers: `x-twilio-signature`

**POST /api/integrations/whatsapp/webhook**
- WhatsApp Business API webhook
- Signature validation required

**POST /api/ai/process**
- Internal: AI classification
- Body: complaint text
- Returns: category, priority, routing

## 🛠️ Configuration

### Environment Variables

```env
# Supabase (Auto-set)
POSTGRES_URL=postgresql://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Twilio (Optional)
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp (Optional)
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_API_TOKEN=xxxxxxxx

# Groq AI (Optional)
GROQ_API_KEY=gsk_xxxxxxxx
USE_MOCK_AI=false  # Set true to disable API costs
```

### Database Initialization

The schema is automatically created when you visit:
```
http://localhost:3000/api/admin/setup-db
```

This creates:
- 10+ tables with proper indexes
- Row-level security policies
- Trigger functions for audit logs
- Views for dashboards

## 📈 Workflow

```
1. Citizen Files Complaint
   ↓
2. System Receives via (Web/IVR/SMS/WhatsApp)
   ↓
3. AI Processes (Classification, Duplicate Check, Priority)
   ↓
4. Officer Dashboard Updated
   ↓
5. Officer Assigns to Department
   ↓
6. Officer Updates Status
   ↓
7. Citizen Receives Updates via Tracking Page
```

## 🧪 Testing

### Mock Data
- Use `USE_MOCK_AI=true` to avoid Groq API costs
- Twilio/WhatsApp can use ngrok for local webhooks
- Database pre-seeded with sample complaints

### Sample Complaint IDs
After setup, test tracking with sample IDs visible in dashboard.

## 🌍 Deployment

### Vercel
```bash
pnpm run build
vercel deploy
```

Environment variables automatically pulled from Supabase integration.

### Self-Hosted
1. Set `POSTGRES_URL` to your PostgreSQL instance
2. Run migrations: `pnpm run migrate`
3. `pnpm run build && pnpm start`

## 📚 File Structure

```
app/
  ├── page.tsx              # Home page
  ├── form/page.tsx         # Complaint form
  ├── track/page.tsx        # Public tracking
  ├── dashboard/
  │   ├── page.tsx          # Officer dashboard
  │   └── complaints/[id]/page.tsx  # Complaint detail
  └── api/
      ├── complaints/       # Core CRUD endpoints
      ├── integrations/     # Twilio, WhatsApp webhooks
      ├── ai/              # Groq processing
      └── admin/           # Database setup

lib/
  ├── types.ts              # TypeScript definitions
  ├── supabase-server.ts   # Database client
  └── utils.ts             # Helpers

scripts/
  └── 01-init-schema.sql   # Database migration

components/
  └── ui/                  # shadcn/ui components
```

## 🎨 UI Design

- **Modern Dark Theme**: Cyan accent (#00B4D8), Deep background
- **Responsive**: Mobile-first, optimized for all devices
- **Accessibility**: WCAG compliant, semantic HTML, ARIA labels
- **Performance**: Optimized images, lazy loading, code splitting

## 🐛 Troubleshooting

### Database Connection Error
- Check `POSTGRES_URL` environment variable
- Visit `/api/admin/setup-db` to initialize schema
- Verify Supabase project is active

### Twilio Webhooks Not Working
- Ensure `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are set
- Configure webhook URL in Twilio console
- Verify request signature validation

### AI Not Working
- Check `GROQ_API_KEY` is valid
- Enable mock mode: `USE_MOCK_AI=true`
- Check integration logs for API errors

## 📞 Support

For issues:
1. Check error logs in integrations_log table
2. Verify environment variables
3. Test database connection: `pnpm run db:test`
4. Review `/api/admin/setup-db` output

## 📄 License

Vadodara Municipal Corporation - All Rights Reserved

## 🙏 Acknowledgments

- Built with Next.js 16 + React 19
- Database: Supabase PostgreSQL
- UI: shadcn/ui + Tailwind CSS
- AI: Groq API (with mock mode option)
- Integrations: Twilio, WhatsApp Business API
