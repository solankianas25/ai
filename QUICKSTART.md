# Quick Start Guide - VMC Complaint System

## 30-Second Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Database
Visit one of these:
- **Option A**: `http://localhost:3000/api/admin/setup-db` (if API works)
- **Option B**: Supabase Dashboard > SQL Editor > Copy `scripts/01-init-schema.sql` and run

### 3. Run Development Server
```bash
pnpm dev
```

### 4. Visit the App
- Home: http://localhost:3000
- File complaint: http://localhost:3000/form
- Track: http://localhost:3000/track/VHB-2024-00001
- Officer dashboard: http://localhost:3000/dashboard

## 5-Minute Tour

### Public User Journey
1. Go to http://localhost:3000 (home page)
2. Click "File a Complaint"
3. Fill form and submit
4. Get reference number (VHB-2024-XXXXX)
5. Track status at /track/[reference]

### Officer Journey
1. Go to http://localhost:3000/dashboard
2. See all complaints with filters
3. Click "View" on any complaint
4. Update status, priority, add notes
5. See timeline of changes

## What Works Now

✅ File complaints via web form
✅ View complaint status
✅ Officer dashboard
✅ AI categorization (mock mode)
✅ Status tracking
✅ Multiple integrations ready

## What's Mock vs Real

### Mock (No Setup Needed)
- Web form filing
- Status tracking
- Officer dashboard
- AI classification
- Twilio/WhatsApp webhooks (accept but don't send)

### Real (Requires Configuration)
- Twilio IVR (set TWILIO_* env vars)
- WhatsApp (set WHATSAPP_* env vars)
- Groq AI (set GROQ_API_KEY)
- Email notifications (not implemented yet)

## Key Files to Know

| File | Purpose | Edit? |
|------|---------|-------|
| `app/globals.css` | Colors & theme | Yes, to customize colors |
| `lib/types.ts` | Data types | Yes, to add new categories |
| `scripts/01-init-schema.sql` | Database | No, already set up |
| `app/api/ai/process/route.ts` | AI logic | Yes, to customize classification |
| `SETUP.md` | Full guide | Reference |

## Common Tasks

### Change the Color Theme
Edit `app/globals.css` - modify the :root variables

### Add a New Complaint Category
1. Edit `lib/types.ts` - add to ComplaintCategory enum
2. Edit `app/form/page.tsx` - add to CATEGORIES array
3. Update database if already deployed

### Connect Real Twilio
1. Add TWILIO_* env vars
2. Set USE_MOCK_TWILIO=false
3. Update webhook URL in Twilio console

### Connect Real WhatsApp
1. Add WHATSAPP_* env vars
2. Update webhook URL in WhatsApp Business console

### Use Real Groq AI
1. Add GROQ_API_KEY env var
2. Set USE_MOCK_AI=false

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm start           # Start production server

# Database
# Copy SQL from scripts/01-init-schema.sql into Supabase console

# Deployment
git push origin main  # Deploy to Vercel
```

## Troubleshooting

### Database connection fails
- Verify Supabase URL and keys in env vars
- Check database schema is created (run SQL migration)
- Verify RLS policies allow access

### Forms won't submit
- Check browser console for errors
- Verify /api/complaints/create endpoint is working
- Check Supabase database logs

### Dashboard shows no complaints
- Create a complaint via /form first
- Check database directly in Supabase console
- Verify RLS policies

### AI not classifying
- Check USE_MOCK_AI is true (for mock)
- Check GROQ_API_KEY if using real
- Review api_processing_log table

## Next Steps

1. ✅ **Explore the UI** - File a complaint, track it, check dashboard
2. 📖 **Read SETUP.md** - For detailed configuration
3. 🎨 **Customize theme** - Edit globals.css
4. 🔌 **Set up integrations** - Twilio, WhatsApp, Groq
5. 🚀 **Deploy** - Push to Vercel with `git push`

## Quick API Tests

### File a Complaint
```bash
curl -X POST http://localhost:3000/api/complaints/create \
  -H "Content-Type: application/json" \
  -d '{
    "citizen_name": "John Doe",
    "citizen_phone": "555-1234",
    "category": "roads",
    "title": "Pothole",
    "description": "Big hole in street",
    "location": "Main St",
    "intake_channel": "website"
  }'
```

### List Complaints
```bash
curl http://localhost:3000/api/complaints/list
```

### Process with AI
```bash
curl -X POST http://localhost:3000/api/ai/process \
  -H "Content-Type: application/json" \
  -d '{
    "complaint_id": "comp-001",
    "text": "Large pothole on Main Street causing damage",
    "processing_type": "classification"
  }'
```

## Support

- Read `SETUP.md` for detailed docs
- Check `PROJECT_SUMMARY.md` for feature overview
- Review code comments for implementation details
- Check Supabase logs for errors

## You're Ready!

The system is fully functional and ready to:
- Deploy to Vercel
- Connect to real integrations
- Scale for production use

Start with the Quick Start above and refer to SETUP.md for detailed configuration.

**Happy coding! 🚀**
