# VMC Complaint System - Deployment Guide

Complete guide for deploying the VMC Complaint Management System to production.

## Pre-Deployment Checklist

- [ ] Database initialized via `/api/admin/setup-db`
- [ ] All environment variables configured
- [ ] Twilio/WhatsApp credentials obtained (if using)
- [ ] Groq API key obtained (or mock mode enabled)
- [ ] Domain/hosting platform selected
- [ ] SSL certificate ready
- [ ] Backup strategy planned

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "VMC Complaint System v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/vmc-complaints.git
git push -u origin main
```

### Step 2: Connect Vercel Project

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Paste your GitHub URL
4. Select "Next.js" framework
5. Click "Deploy"

### Step 3: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
POSTGRES_URL = [From Supabase]
SUPABASE_ANON_KEY = [From Supabase]
SUPABASE_SERVICE_ROLE_KEY = [From Supabase]

TWILIO_ACCOUNT_SID = [From Twilio Console]
TWILIO_AUTH_TOKEN = [From Twilio Console]
TWILIO_PHONE_NUMBER = [Your Twilio number]

WHATSAPP_PHONE_NUMBER_ID = [From WhatsApp Business]
WHATSAPP_API_TOKEN = [From WhatsApp Business]

GROQ_API_KEY = [From Groq Console]
USE_MOCK_AI = false
```

### Step 4: Database Setup

1. Add the Supabase integration to your Vercel project
2. Click "Add Integration" → Search "Supabase"
3. Connect your Supabase account
4. Select your database
5. Variables auto-populate in Vercel

### Step 5: Initialize Database

After deployment:
1. Visit `https://your-domain.vercel.app/api/admin/setup-db`
2. This creates all tables and indexes
3. Should see "Schema created successfully"

### Step 6: Configure Webhooks

**Twilio IVR/SMS:**
1. Go to Twilio Console → Phone Numbers
2. Select your number
3. Webhook URL: `https://your-domain.vercel.app/api/integrations/twilio/webhook`
4. Method: POST
5. Save

**WhatsApp:**
1. Go to WhatsApp Business Platform
2. Configuration → Webhooks
3. Webhook URL: `https://your-domain.vercel.app/api/integrations/whatsapp/webhook`
4. Verify Token: Generate a strong random string
5. Add to env variable: `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

## 🐳 Deploy with Docker (Self-Hosted)

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

### Step 2: Create Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      POSTGRES_URL: postgresql://user:password@postgres:5432/complaints
      SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
      GROQ_API_KEY: ${GROQ_API_KEY}
      # ... other vars
    depends_on:
      - postgres
    restart: always

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: complaints
      POSTGRES_USER: user
      POSTGRES_PASSWORD: strong_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:
```

### Step 3: Deploy

```bash
docker-compose up -d
```

## ☁️ Deploy to AWS

### Step 1: Create RDS Database

```bash
aws rds create-db-instance \
  --db-instance-identifier vmc-complaints-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password [STRONG_PASSWORD]
```

### Step 2: Deploy to EC2

```bash
# Create EC2 instance (Ubuntu 22.04)
aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --instance-type t3.micro

# SSH into instance
ssh -i key.pem ubuntu@instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/YOUR_ORG/vmc-complaints.git
cd vmc-complaints
npm install -g pnpm
pnpm install
pnpm build

# Set environment variables
export POSTGRES_URL="postgresql://..."
export GROQ_API_KEY="..."

# Start
pnpm start
```

### Step 3: Setup Nginx Reverse Proxy

```nginx
upstream app {
  server localhost:3000;
}

server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### Step 4: Enable SSL

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔐 Security Hardening

### 1. Database Security

```sql
-- Restrict public access
REVOKE ALL ON DATABASE complaints FROM public;
REVOKE ALL ON SCHEMA public FROM public;

-- Create application role
CREATE ROLE app_user WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE complaints TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON complaints TO app_user;
```

### 2. Environment Variables

```bash
# Never commit secrets
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### 3. Rate Limiting

Add to Next.js middleware:

```typescript
// middleware.ts
import { rateLimit } from 'next-rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  tokensPerInterval: 10,
});

export async function middleware(request: NextRequest) {
  await limiter.check(request);
}
```

### 4. CORS Configuration

```typescript
// app/api/integrations/twilio/webhook/route.ts
const allowedOrigins = ['https://api.twilio.com'];

if (!allowedOrigins.includes(origin)) {
  return new Response('Unauthorized', { status: 403 });
}
```

## 📊 Monitoring & Logging

### Vercel Analytics

1. Dashboard → Analytics
2. Monitor:
   - Page performance
   - API response times
   - Error rates

### Sentry Integration

```bash
npm install @sentry/nextjs
```

```typescript
// next.config.mjs
import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  org: "your-org",
  project: "vmc-complaints",
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

### Database Monitoring

```sql
-- Monitor slow queries
CREATE EXTENSION pg_stat_statements;

SELECT query, mean_exec_time 
FROM pg_stat_statements 
WHERE mean_exec_time > 1000 
ORDER BY mean_exec_time DESC;
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
      
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📈 Scaling Strategy

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_status ON complaints(status);
CREATE INDEX idx_category ON complaints(category);
CREATE INDEX idx_created_at ON complaints(created_at DESC);
CREATE INDEX idx_assigned_officer ON complaints(assigned_officer);
```

### Caching

```typescript
// Add Redis caching for complaint list
import { redis } from '@/lib/redis';

const cached = await redis.get(`complaints:${filter}`);
if (cached) return JSON.parse(cached);

const results = await db.query(...);
await redis.setex(`complaints:${filter}`, 3600, JSON.stringify(results));
```

### Load Balancing

For high traffic, use:
- Vercel auto-scaling (recommended)
- AWS Load Balancer
- Nginx load balancing (self-hosted)

## 🚨 Incident Response

### Database Down
1. Check Supabase status: https://status.supabase.io
2. Switch to backup database if available
3. Notify users via status page

### API Under Attack
1. Enable rate limiting
2. Check CloudFlare/WAF logs
3. Block malicious IPs

### Data Breach
1. Revoke API keys immediately
2. Notify affected citizens
3. Audit access logs
4. File incident report

## ✅ Post-Deployment

1. **Test all endpoints** with sample data
2. **Verify webhooks** from Twilio/WhatsApp
3. **Monitor error logs** for 24 hours
4. **Test disaster recovery** process
5. **Document runbook** for operators
6. **Schedule backup strategy**

## 📞 Support Contacts

- Vercel Support: https://vercel.com/support
- Supabase Docs: https://supabase.com/docs
- Twilio Support: https://support.twilio.com
- AWS Support: https://console.aws.amazon.com/support

## 🎉 Congratulations!

Your VMC Complaint System is now live and serving citizens!

Monitor closely for the first week. Adjust resources as needed based on traffic patterns.
