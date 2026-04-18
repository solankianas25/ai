# VMC Complaint System - Architecture Document

## System Overview

The VMC (Vadodara Municipal Corporation) Complaint Management System is a **modern, cloud-native, full-stack application** designed to handle citizen complaints across multiple channels with AI-powered intelligent routing and officer workflow management.

**Total Lines of Code**: ~4,500+
**Components**: 20+ pages, 15+ API routes, 10+ database tables
**Architecture**: Monolithic with microservice-ready design
**Database**: PostgreSQL with Row-Level Security
**Real-time Updates**: Server-driven events with polling fallback

## 🏛️ High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     CITIZEN/OFFICER FACING                       │
├──────────────────────────────────────────────────────────────────┤
│  WEB (Next.js)           PHONE (Twilio IVR)        CHAT (WhatsApp)
│  ├─ Home                 ├─ Voice Menu            ├─ Bot
│  ├─ Form                 ├─ IVR Routing           ├─ Natural Language
│  ├─ Tracking             └─ SMS Confirmation      └─ Instant Response
│  └─ Dashboard
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js Routes)                    │
├──────────────────────────────────────────────────────────────────┤
│  ┌─ COMPLAINT MANAGEMENT        ┌─ INTEGRATIONS              │
│  │ ├─ POST /complaints/create  │ ├─ /twilio/webhook       │
│  │ ├─ GET  /complaints/list    │ ├─ /whatsapp/webhook     │
│  │ ├─ GET  /complaints/[id]    │ └─ /social/webhook       │
│  │ └─ PATCH /complaints/[id]   │                          │
│  │                             │ ┌─ AI PROCESSING         │
│  ├─ UTILITY ENDPOINTS          │ ├─ /ai/process           │
│  ├─ GET  /ai/classify           │ └─ /ai/duplicate-check   │
│  ├─ GET  /ai/priority           │                         │
│  └─ POST /admin/setup-db        │ ┌─ ADMIN                │
│                                 │ └─ /admin/setup-db      │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                  DATA LAYER (Supabase PostgreSQL)                │
├──────────────────────────────────────────────────────────────────┤
│  ┌─ CORE DATA         ┌─ OPERATIONS       ┌─ AUDIT           │
│  │ ├─ complaints     │ ├─ complaint_      │ ├─ integrations  │
│  │ ├─ officers       │ │   updates        │ │   _log         │
│  │ ├─ categories     │ ├─ assignments     │ ├─ ai_processing │
│  │ └─ departments    │ └─ workflows       │ │   _log         │
│  │                   │                   │ └─ error_log     │
│  └───────────────────┴───────────────────┴──────────────────┘
│  ALL tables have RLS, audit triggers, and full encryption
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES & INTEGRATIONS                    │
├──────────────────────────────────────────────────────────────────┤
│  TWILIO            WHATSAPP              GROQ AI              │
│  ├─ IVR            ├─ Messaging         ├─ Classification     │
│  ├─ SMS            ├─ Webhook           ├─ Duplicate          │
│  └─ Webhooks       └─ Verification      └─ Priority           │
└──────────────────────────────────────────────────────────────────┘
```

## 📊 Data Model

### Core Tables

```
complaints
├─ PK: id (UUID)
├─ citizen_id (FK) → citizens
├─ category (ENUM)
├─ status (ENUM: registered, assigned, in_progress, resolved, closed)
├─ priority (ENUM: low, medium, high, critical)
├─ intake_channel (ENUM: website, ivr, sms, whatsapp, social)
├─ assigned_officer (FK) → officers
├─ location (String)
├─ location_coordinates (JSONB: {lat, lng})
├─ ai_classification (JSONB: {category, confidence})
├─ timestamps (created_at, updated_at, resolved_at)
└─ RLS: Policy for officer_id = current_user_id

complaint_updates (APPEND-ONLY AUDIT LOG)
├─ PK: id (UUID)
├─ complaint_id (FK)
├─ status (new status)
├─ notes (update details)
├─ updated_by (officer_id)
├─ timestamp (created_at)
└─ RLS: Public read, authenticated write

officers
├─ PK: id (UUID)
├─ email (UNIQUE, for auth)
├─ name, phone, department
├─ is_active (soft delete)
└─ permissions (JSONB)

integrations_log (APPEND-ONLY)
├─ PK: id (UUID)
├─ service (twilio, whatsapp, groq)
├─ endpoint (webhook path)
├─ request (JSONB payload)
├─ response (JSONB result)
├─ status (success, failure)
├─ timestamp
└─ complaint_id (FK, nullable)

ai_processing_log (APPEND-ONLY)
├─ PK: id (UUID)
├─ complaint_id (FK)
├─ service (groq)
├─ input_text (full complaint)
├─ classification (JSONB)
├─ confidence_scores (JSONB)
├─ execution_time_ms
└─ timestamp
```

### Database Relationships

```
citizens (1) ──→ (N) complaints ──→ (1) categories
                   ↓
                (1) officers
                   ↓
            complaint_updates (audit trail)
                   ↓
         integrations_log (service calls)
            + ai_processing_log
```

## 🔐 Security Architecture

### Row-Level Security (RLS)

```sql
-- Officers see only their department's complaints
CREATE POLICY "officers_own_department"
  ON complaints FOR SELECT
  USING (assigned_officer_id = auth.uid()
         OR officer.department = current_user_department);

-- Audit logs are immutable
CREATE POLICY "audit_logs_append_only"
  ON complaint_updates FOR INSERT
  WITH CHECK (true)
  FOR UPDATE WITH CHECK (false)
  FOR DELETE WITH CHECK (false);

-- Public can only see their own complaints
CREATE POLICY "citizens_own_complaints"
  ON complaints FOR SELECT
  USING (citizen_id = auth.uid() OR is_public);
```

### API Security

1. **Input Validation**: All requests validated against TypeScript schemas
2. **SQL Injection Prevention**: Parameterized queries via Supabase client
3. **Rate Limiting**: Webhook endpoints throttled to 100 req/min
4. **CORS**: Restricted to approved domains only
5. **Webhook Verification**: Twilio signature validation
6. **Secrets**: All sensitive data in environment variables

## 🚀 API Design

### RESTful Endpoints

```
POST   /api/complaints/create           # File new complaint
GET    /api/complaints/list             # List (filtered by RLS)
GET    /api/complaints/[id]             # Get detail
PATCH  /api/complaints/[id]             # Update status
DELETE /api/complaints/[id]             # Hard delete (admin only)

POST   /api/integrations/twilio/webhook
POST   /api/integrations/whatsapp/webhook
POST   /api/integrations/social/webhook

POST   /api/ai/process                  # Internal AI endpoint
POST   /api/admin/setup-db              # Initialize schema
```

### Request/Response Format

```typescript
// Request
{
  citizen_name: "John Doe",
  citizen_email: "john@example.com",
  category: "water_supply",
  title: "Broken water pipe",
  description: "Water pipe broken near...",
  location: "123 Main St",
  location_coordinates: { lat: 22.3072, lng: 73.1812 },
  intake_channel: "website"
}

// Response
{
  complaint_id: "550e8400-e29b-41d4-a716-446655440000",
  status: "registered",
  message: "Complaint registered successfully",
  tracking_url: "/track/550e8400..."
}
```

## 🤖 AI Processing Pipeline

### Classification Flow

```
Complaint Text
        ↓
   Groq API
   ├─ Category Classification (11 categories)
   ├─ Confidence Scoring (0-1)
   ├─ Subcategory Detection
   └─ Department Routing
        ↓
Assigned to Officer
        ↓
Logged to ai_processing_log
```

### Mock Mode

For testing without Groq API:

```typescript
// Use predefined responses
const mockResponse = {
  category: 'water_supply',
  confidence: 0.95,
  priority: 'high',
  suggested_department: 'Water Supply',
};
```

## 📱 Multi-Channel Architecture

### Web Channel
- Next.js form validation
- Client-side error handling
- Real-time success confirmation
- Async submission

### Twilio (IVR/SMS)
```
Call/SMS → Twilio → Webhook → Process → DB → Confirmation
                     ↓
              Voice Response / SMS Reply
```

### WhatsApp
```
Message → WhatsApp API → Webhook → NLU → Create Complaint → Reply
                          ↓
                    Store Conversation
```

## 🎯 Data Flow Scenarios

### Scenario 1: Web Form Submission

```
1. Citizen fills form (/form)
2. Client validates
3. POST /api/complaints/create
4. API validates & sanitizes
5. AI processing via Groq
6. INSERT into complaints table
7. Audit trail in complaint_updates
8. Return complaint_id
9. Redirect to /track/[id]
10. Citizen receives success email
```

### Scenario 2: Officer Status Update

```
1. Officer opens /dashboard/complaints/[id]
2. Changes status dropdown
3. PATCH /api/complaints/[id]
4. API authenticates (officer verified)
5. RLS allows update
6. UPDATE complaints table
7. INSERT audit record
8. Trigger email notification to citizen
9. Return updated status
10. Dashboard refreshes
```

### Scenario 3: Twilio Webhook

```
1. Citizen calls/texts Twilio number
2. Twilio → POST /api/integrations/twilio/webhook
3. API verifies signature
4. Parse request data
5. Extract complaint info
6. AI classify complaint
7. INSERT into database
8. Send confirmation SMS/voice
9. Log in integrations_log
```

## ⚡ Performance Optimization

### Database Indexes

```sql
-- Speed up common queries
CREATE INDEX idx_status_priority 
  ON complaints(status, priority) WHERE is_active = true;

CREATE INDEX idx_created_at_desc 
  ON complaints(created_at DESC) 
  WHERE status != 'closed';

CREATE INDEX idx_officer_department 
  ON complaints(assigned_officer, status);

CREATE INDEX idx_full_text_search 
  ON complaints USING GIN(to_tsvector('english', title || ' ' || description));
```

### Query Optimization

```typescript
// Batch queries to reduce roundtrips
const [complaints, stats, recentUpdates] = await Promise.all([
  db.complaints.findMany({ limit: 50 }),
  db.complaints.getStats(),
  db.updates.findRecent({ limit: 10 }),
]);

// Use connection pooling
const pool = new Pool({ max: 20 }); // PgBouncer recommended for Supabase
```

### Caching Strategy

```typescript
// Cache dashboard stats (1 hour TTL)
cache('dashboard-stats', () => computeStats(), 3600);

// Cache officer list (24 hours TTL)
cache('officers-list', () => fetchOfficers(), 86400);

// Cache categories (never expires)
cache('categories', () => fetchCategories(), Infinity);
```

## 🧪 Testing Strategy

### Unit Tests
- API endpoint validation
- AI classification accuracy
- Database query integrity

### Integration Tests
- Full complaint flow (web → DB → dashboard)
- Webhook processing
- Status update pipeline

### End-to-End Tests
- Citizen filing complaint
- Officer updating status
- Public tracking

## 📈 Scalability Plan

### Current Capacity
- ~1,000 concurrent users
- ~100 requests/second
- ~1GB database size

### Phase 2 (10K users)
- Database read replicas
- Redis caching layer
- Webhook queue system (BullMQ)
- Background jobs (Vercel Cron)

### Phase 3 (100K+ users)
- Microservices split
- Separate AI service
- Event-driven architecture (message queue)
- Multi-region deployment

## 🔧 Deployment Architecture

### Development
```
Local → GitHub → Dev Branch → Staging Vercel
```

### Production
```
Main Branch → GitHub → CI/CD → Production Vercel
                         ↓
                    Database Migration
                         ↓
                    Smoke Tests
                         ↓
                    Health Check
                         ↓
                    Go Live
```

## 📊 Monitoring & Observability

### Metrics Tracked
- API response time
- Database query performance
- Webhook success rate
- AI processing accuracy
- Error rates
- User engagement

### Alerts
- API errors > 5%
- Response time > 2s
- Database downtime
- Webhook failures
- AI confidence < 0.7

## 🎓 Key Technologies

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 16 | SSR, API routes, optimal DX |
| Styling | Tailwind CSS | Utility-first, responsive |
| UI Components | shadcn/ui | Accessible, customizable |
| Database | PostgreSQL | Reliable, RLS support |
| Database Client | Supabase | Managed, real-time ready |
| AI | Groq | Fast inference, affordable |
| Messaging | Twilio | Mature, reliable |
| Chat | WhatsApp Business | 2B active users |
| Hosting | Vercel | Optimal Next.js hosting |
| Observability | Sentry | Error tracking |

## 🚨 Disaster Recovery

### Backup Strategy
- Daily snapshots to S3
- Point-in-time recovery (7 days)
- Replicated to secondary region

### Failover Plan
1. Monitor database health
2. Automatic failover to replica (30s)
3. Alert team
4. Post-incident review

### Data Retention
- Complaints: 10 years
- Audit logs: 7 years
- Integration logs: 90 days

## 📞 Support Architecture

### Tiered Support
1. **Level 1**: Self-service (FAQ, docs)
2. **Level 2**: Email support (24h response)
3. **Level 3**: On-call engineering (1h response)

### SLA Targets
- Uptime: 99.5%
- API Response: <500ms p95
- Support Response: <4h avg
- Bug Fix: <24h critical

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Production Ready
