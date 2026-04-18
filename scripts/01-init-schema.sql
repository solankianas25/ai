-- VMC Complaint Management System Database Schema
-- Phase 1: Core Tables and Auth Integration

-- Enable UUID and JSONB support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS & ROLES
-- ============================================================================

-- Create custom user type enum
CREATE TYPE user_role AS ENUM ('citizen', 'officer', 'admin', 'supervisor');

-- Auth users table (links to Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'citizen',
  full_name TEXT,
  phone_number TEXT,
  department TEXT, -- For officers
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- COMPLAINT CATEGORIES & PRIORITY
-- ============================================================================

CREATE TYPE complaint_category AS ENUM (
  'water_supply',
  'sanitation',
  'roads',
  'streetlights',
  'garbage',
  'traffic',
  'construction',
  'parks',
  'public_facilities',
  'corruption',
  'other'
);

CREATE TYPE complaint_status AS ENUM (
  'registered',
  'assigned',
  'in_progress',
  'resolved',
  'rejected',
  'escalated',
  'on_hold'
);

CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TYPE intake_channel AS ENUM (
  'website',
  'twilio_ivr',
  'twilio_sms',
  'whatsapp',
  'social_media',
  'email',
  'phone'
);

-- ============================================================================
-- COMPLAINTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id TEXT UNIQUE NOT NULL, -- Human-readable ID like VHB-2024-00123
  
  -- Citizen Info
  citizen_id UUID REFERENCES users(id) ON DELETE SET NULL,
  citizen_name TEXT NOT NULL,
  citizen_email TEXT,
  citizen_phone TEXT,
  
  -- Complaint Details
  category complaint_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  location_coordinates JSONB, -- {lat, lng}
  
  -- Status & Priority
  status complaint_status DEFAULT 'registered',
  priority complaint_priority DEFAULT 'medium',
  
  -- AI Classification
  ai_category complaint_category, -- AI-detected category
  ai_priority complaint_priority, -- AI-assessed priority
  ai_confidence FLOAT DEFAULT 0, -- 0-1 confidence score
  is_duplicate BOOLEAN DEFAULT false,
  duplicate_of UUID REFERENCES complaints(id) ON DELETE SET NULL,
  
  -- Assignment
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  
  -- Tracking
  intake_channel intake_channel DEFAULT 'website',
  intake_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  external_ref_id TEXT, -- For integration refs (Twilio SID, WhatsApp msg ID, etc.)
  attachments_count INT DEFAULT 0,
  is_escalated BOOLEAN DEFAULT false,
  escalation_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for lookups
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_assigned_to ON complaints(assigned_to);
CREATE INDEX idx_complaints_citizen_id ON complaints(citizen_id);
CREATE INDEX idx_complaints_complaint_id ON complaints(complaint_id);
CREATE INDEX idx_complaints_created_at ON complaints(created_at DESC);

-- ============================================================================
-- ATTACHMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INT NOT NULL,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in Vercel Blob storage
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_complaint_id ON attachments(complaint_id);

-- ============================================================================
-- STATUS UPDATES & AUDIT TRAIL
-- ============================================================================

CREATE TABLE IF NOT EXISTS complaint_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  old_status complaint_status,
  new_status complaint_status,
  old_priority complaint_priority,
  new_priority complaint_priority,
  
  update_notes TEXT,
  update_type TEXT, -- 'status_change', 'priority_update', 'assignment', 'resolution', 'note'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_complaint_updates_complaint_id ON complaint_updates(complaint_id);
CREATE INDEX idx_complaint_updates_created_at ON complaint_updates(created_at DESC);

-- ============================================================================
-- AI PROCESSING LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_processing_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  
  ai_model TEXT NOT NULL, -- 'groq_mixtral', 'groq_llama', 'openai_gpt4', etc.
  processing_type TEXT NOT NULL, -- 'classification', 'duplicate_detection', 'priority_assessment'
  
  input_data JSONB, -- Original complaint text
  output_data JSONB, -- AI response
  confidence_score FLOAT,
  processing_time_ms INT,
  
  tokens_used INT,
  cost_estimate FLOAT,
  
  is_mock BOOLEAN DEFAULT false,
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_processing_complaint_id ON ai_processing_log(complaint_id);
CREATE INDEX idx_ai_processing_type ON ai_processing_log(processing_type);

-- ============================================================================
-- INTEGRATION LOGS (Twilio, WhatsApp, etc.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS integration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL,
  
  integration_type TEXT NOT NULL, -- 'twilio_ivr', 'twilio_sms', 'whatsapp', 'social'
  event_type TEXT NOT NULL, -- 'inbound_call', 'sms_received', 'message_received', 'callback', 'error'
  
  external_id TEXT, -- Twilio SID, WhatsApp msg ID, etc.
  phone_number TEXT,
  message_body TEXT,
  
  request_data JSONB,
  response_data JSONB,
  
  status TEXT DEFAULT 'success', -- 'success', 'failed', 'pending'
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integration_logs_type ON integration_logs(integration_type);
CREATE INDEX idx_integration_logs_complaint_id ON integration_logs(complaint_id);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TYPE notification_type AS ENUM (
  'complaint_registered',
  'complaint_assigned',
  'status_update',
  'resolution',
  'escalation'
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  
  notification_type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Channel preferences
  send_email BOOLEAN DEFAULT true,
  send_sms BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ===== USERS TABLE RLS =====
-- Admins can see all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ===== COMPLAINTS TABLE RLS =====
-- Citizens can see their own complaints
CREATE POLICY "Citizens see own complaints"
  ON complaints FOR SELECT
  USING (
    auth.uid() = citizen_id 
    OR auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'supervisor'))
  );

-- Officers can see complaints assigned to them
CREATE POLICY "Officers see assigned complaints"
  ON complaints FOR SELECT
  USING (
    assigned_to = auth.uid()
    OR auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'supervisor'))
  );

-- Anyone authenticated can insert (file a complaint)
CREATE POLICY "Authenticated users can file complaints"
  ON complaints FOR INSERT
  WITH CHECK (true);

-- Assigned officers can update complaints
CREATE POLICY "Assigned officers can update complaints"
  ON complaints FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'supervisor'))
  );

-- ===== ATTACHMENTS TABLE RLS =====
-- Users can see attachments for complaints they can see
CREATE POLICY "Users can view complaint attachments"
  ON attachments FOR SELECT
  USING (
    complaint_id IN (
      SELECT id FROM complaints 
      WHERE citizen_id = auth.uid() 
         OR assigned_to = auth.uid()
         OR auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'supervisor'))
    )
  );

-- Users can upload attachments to their complaints
CREATE POLICY "Users can upload attachments"
  ON attachments FOR INSERT
  WITH CHECK (
    complaint_id IN (
      SELECT id FROM complaints 
      WHERE citizen_id = auth.uid() 
         OR assigned_to = auth.uid()
    )
  );

-- ===== NOTIFICATIONS TABLE RLS =====
-- Users can only see their own notifications
CREATE POLICY "Users see own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert a test admin user (use actual Supabase user IDs)
-- Note: This would be done via Supabase dashboard or after creating auth users

-- Create complaint ID sequence function
CREATE OR REPLACE FUNCTION generate_complaint_id()
RETURNS TEXT AS $$
DECLARE
  complaint_number TEXT;
  year TEXT;
BEGIN
  year := TO_CHAR(CURRENT_DATE, 'YYYY');
  complaint_number := LPAD(
    CAST(NEXTVAL('complaint_id_sequence') AS TEXT),
    5,
    '0'
  );
  RETURN 'VHB-' || year || '-' || complaint_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for complaint IDs
CREATE SEQUENCE IF NOT EXISTS complaint_id_sequence START 1 INCREMENT 1;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Dashboard view for officers
CREATE OR REPLACE VIEW officer_dashboard AS
SELECT 
  c.id,
  c.complaint_id,
  c.title,
  c.description,
  c.category,
  c.status,
  c.priority,
  c.citizen_name,
  c.citizen_phone,
  c.location,
  c.intake_channel,
  c.created_at,
  c.assigned_to,
  u.full_name as assigned_officer_name,
  cu.new_status as latest_status
FROM complaints c
LEFT JOIN users u ON c.assigned_to = u.id
LEFT JOIN LATERAL (
  SELECT new_status FROM complaint_updates 
  WHERE complaint_id = c.id 
  ORDER BY created_at DESC 
  LIMIT 1
) cu ON true
ORDER BY c.created_at DESC;

-- Analytics view for supervisors
CREATE OR REPLACE VIEW complaint_analytics AS
SELECT 
  DATE_TRUNC('day', c.created_at) as date,
  c.category,
  c.priority,
  c.status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/3600) as avg_resolution_hours
FROM complaints c
WHERE c.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', c.created_at), c.category, c.priority, c.status;
