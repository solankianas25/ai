// User & Auth Types
export type UserRole = 'citizen' | 'officer' | 'admin' | 'supervisor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  phone_number: string | null;
  department: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Complaint Types
export type ComplaintCategory =
  | 'water_supply'
  | 'sanitation'
  | 'roads'
  | 'streetlights'
  | 'garbage'
  | 'traffic'
  | 'construction'
  | 'parks'
  | 'public_facilities'
  | 'corruption'
  | 'other';

export type ComplaintStatus =
  | 'registered'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'escalated'
  | 'on_hold';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export type IntakeChannel =
  | 'website'
  | 'twilio_ivr'
  | 'twilio_sms'
  | 'whatsapp'
  | 'social_media'
  | 'email'
  | 'phone';

export interface Complaint {
  id: string;
  complaint_id: string; // Human-readable ID like VHB-2024-00123
  citizen_id: string | null;
  citizen_name: string;
  citizen_email: string | null;
  citizen_phone: string | null;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  location_coordinates: { lat: number; lng: number } | null;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  ai_category: ComplaintCategory | null;
  ai_priority: ComplaintPriority | null;
  ai_confidence: number;
  is_duplicate: boolean;
  duplicate_of: string | null;
  assigned_to: string | null;
  assigned_at: string | null;
  intake_channel: IntakeChannel;
  intake_timestamp: string;
  registered_at: string;
  resolved_at: string | null;
  external_ref_id: string | null;
  attachments_count: number;
  is_escalated: boolean;
  escalation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  complaint_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_path: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface ComplaintUpdate {
  id: string;
  complaint_id: string;
  updated_by: string | null;
  old_status: ComplaintStatus | null;
  new_status: ComplaintStatus | null;
  old_priority: ComplaintPriority | null;
  new_priority: ComplaintPriority | null;
  update_notes: string | null;
  update_type: string;
  created_at: string;
}

// AI Processing Types
export interface AIProcessingLog {
  id: string;
  complaint_id: string;
  ai_model: string;
  processing_type: 'classification' | 'duplicate_detection' | 'priority_assessment';
  input_data: Record<string, unknown> | null;
  output_data: Record<string, unknown> | null;
  confidence_score: number | null;
  processing_time_ms: number | null;
  tokens_used: number | null;
  cost_estimate: number | null;
  is_mock: boolean;
  error_message: string | null;
  created_at: string;
}

// Integration Types
export type IntegrationType = 'twilio_ivr' | 'twilio_sms' | 'whatsapp' | 'social';
export type IntegrationEventType =
  | 'inbound_call'
  | 'sms_received'
  | 'message_received'
  | 'callback'
  | 'error';

export interface IntegrationLog {
  id: string;
  complaint_id: string | null;
  integration_type: IntegrationType;
  event_type: IntegrationEventType;
  external_id: string | null;
  phone_number: string | null;
  message_body: string | null;
  request_data: Record<string, unknown> | null;
  response_data: Record<string, unknown> | null;
  status: 'success' | 'failed' | 'pending';
  error_message: string | null;
  created_at: string;
}

// Notification Types
export type NotificationType =
  | 'complaint_registered'
  | 'complaint_assigned'
  | 'status_update'
  | 'resolution'
  | 'escalation';

export interface Notification {
  id: string;
  user_id: string;
  complaint_id: string | null;
  notification_type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  send_email: boolean;
  send_sms: boolean;
  created_at: string;
}

// API Request/Response Types
export interface CreateComplaintRequest {
  citizen_name: string;
  citizen_email?: string;
  citizen_phone?: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  location_coordinates?: { lat: number; lng: number };
  intake_channel: IntakeChannel;
  attachments?: File[];
}

export interface UpdateComplaintRequest {
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  assigned_to?: string | null;
  update_notes?: string;
}

// Dashboard Types
export interface OfficerDashboardComplaint extends Complaint {
  assigned_officer_name?: string;
  latest_status?: ComplaintStatus;
}

export interface ComplaintAnalytics {
  date: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  count: number;
  avg_resolution_hours: number | null;
}

// Form Types
export interface ComplaintFormData {
  citizen_name: string;
  citizen_email: string;
  citizen_phone: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  attachments: File[];
}
