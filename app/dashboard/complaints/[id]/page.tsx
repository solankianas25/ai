'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ComplaintStatus = 'registered' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: string;
  citizen_name: string;
  citizen_email: string;
  citizen_phone: string;
  location: string;
  location_coordinates?: { lat: number; lng: number };
  created_at: string;
  assigned_officer?: string;
  officer_department?: string;
  updates?: Array<{ status: string; notes: string; created_at: string }>;
}

export default function ComplaintDetail() {
  const router = useRouter();
  const params = useParams();
  const complaintId = params.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('registered');
  const [updateNotes, setUpdateNotes] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/complaints/${complaintId}`);
      if (!response.ok) throw new Error('Complaint not found');
      const data = await response.json();
      setComplaint(data);
      setNewStatus(data.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!updateNotes.trim()) {
      setError('Please add notes to the update');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          update_notes: updateNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to update complaint');
      setUpdateNotes('');
      await fetchComplaint();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update complaint');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading complaint...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button onClick={() => router.back()} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Alert className="bg-destructive/10 border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Complaint not found'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 sticky top-0 z-50 backdrop-blur-md bg-background/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert */}
        {error && (
          <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Complaint Header */}
        <Card className="bg-card/80 border-border/50 p-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">{complaint.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  ID: <span className="font-mono text-primary">{complaint.id}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Filed: {new Date(complaint.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded bg-muted/40 text-muted-foreground text-sm font-medium">
                  {complaint.category}
                </span>
                <span className="px-3 py-1 rounded bg-primary/20 text-primary text-sm font-medium capitalize">
                  {complaint.priority}
                </span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 border-t border-border/40 pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Status</p>
              <p className="text-lg font-semibold text-foreground capitalize">{complaint.status.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Assigned Officer</p>
              <p className="text-lg font-semibold text-foreground">
                {complaint.assigned_officer || 'Not assigned'}
              </p>
            </div>
          </div>
        </Card>

        {/* Citizen Information */}
        <Card className="bg-card/80 border-border/50 p-8 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Citizen Information</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-foreground font-medium">{complaint.citizen_name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium">{complaint.citizen_email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-foreground font-medium">{complaint.citizen_phone || 'Not provided'}</p>
            </div>
          </div>
        </Card>

        {/* Complaint Details */}
        <Card className="bg-card/80 border-border/50 p-8 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Complaint Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Location</p>
              <p className="text-foreground">{complaint.location}</p>
              {complaint.location_coordinates && (
                <p className="text-xs text-muted-foreground mt-1">
                  {complaint.location_coordinates.lat.toFixed(4)}, {complaint.location_coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Status Updates */}
        {complaint.updates && complaint.updates.length > 0 && (
          <Card className="bg-card/80 border-border/50 p-8 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Update History</h2>
            <div className="space-y-4">
              {complaint.updates.map((update, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mt-2" />
                    {idx < complaint.updates!.length - 1 && (
                      <div className="w-0.5 h-12 bg-border/40 mt-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(update.created_at).toLocaleString()}
                    </p>
                    <p className="text-foreground font-medium mt-1 capitalize">{update.status.replace('_', ' ')}</p>
                    {update.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{update.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Update Complaint */}
        <Card className="bg-card/80 border-border/50 p-8 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Update Complaint Status</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Status</label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ComplaintStatus)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Update Notes</label>
              <Textarea
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                placeholder="Add notes about this status update..."
                className="bg-input border-border min-h-24"
              />
            </div>

            <Button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update Status
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
