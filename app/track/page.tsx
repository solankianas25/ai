'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, ArrowLeft, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TrackComplaint() {
  const router = useRouter();
  const [complaintId, setComplaintId] = useState('');
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId.trim()) {
      setError('Please enter a complaint ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/complaints/${complaintId}`);
      if (!response.ok) {
        setError('Complaint not found. Please check your ID.');
        setComplaint(null);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setComplaint(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch complaint');
      setComplaint(null);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'text-primary';
      case 'assigned':
        return 'text-accent';
      case 'in_progress':
        return 'text-accent';
      case 'resolved':
        return 'text-secondary';
      case 'closed':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-5 h-5" />;
      case 'in_progress':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 sticky top-0 z-50 backdrop-blur-md bg-background/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Track Complaint</h1>
            <p className="text-lg text-muted-foreground">
              Enter your complaint ID to check status
            </p>
          </div>

          {/* Search Card */}
          <Card className="bg-card/80 border-border/50 p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Complaint ID</label>
                <Input
                  type="text"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  placeholder="Enter your complaint ID"
                  className="bg-input border-border text-base"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5"
              >
                {loading ? 'Searching...' : 'Track Complaint'}
              </Button>
            </form>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Complaint Details */}
          {complaint && (
            <Card className="bg-card/80 border-border/50 p-8 space-y-8">
              {/* Header */}
              <div className="space-y-4 border-b border-border/40 pb-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">{complaint.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      ID: <span className="font-mono text-primary">{complaint.id}</span>
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    <span className="font-semibold capitalize">{complaint.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-base font-semibold text-foreground capitalize">
                    {complaint.category.replace('_', ' ')}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <p className="text-base font-semibold text-foreground capitalize">
                    {complaint.priority}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Filed On</p>
                  <p className="text-base font-semibold text-foreground">
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Channel</p>
                  <p className="text-base font-semibold text-foreground capitalize">
                    {complaint.intake_channel}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 border-t border-border/40 pt-6">
                <h3 className="font-semibold text-foreground">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              {/* Location */}
              {complaint.location && (
                <div className="space-y-4 border-t border-border/40 pt-6">
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="text-muted-foreground">{complaint.location}</p>
                  {complaint.location_coordinates && (
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {complaint.location_coordinates.lat.toFixed(4)}, {complaint.location_coordinates.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              )}

              {/* Updates Timeline */}
              {complaint.updates && complaint.updates.length > 0 && (
                <div className="space-y-4 border-t border-border/40 pt-6">
                  <h3 className="font-semibold text-foreground">Status Updates</h3>
                  <div className="space-y-4">
                    {complaint.updates.map((update: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-primary mt-2" />
                          {idx < complaint.updates.length - 1 && (
                            <div className="w-0.5 h-12 bg-border/40 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm text-muted-foreground">
                            {new Date(update.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-foreground font-medium mt-1">{update.status}</p>
                          {update.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{update.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Officer Info */}
              {complaint.assigned_officer && (
                <div className="space-y-4 border-t border-border/40 pt-6 bg-card/40 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground">Assigned Officer</h3>
                  <p className="text-foreground font-medium">{complaint.assigned_officer}</p>
                  {complaint.officer_department && (
                    <p className="text-sm text-muted-foreground">{complaint.officer_department}</p>
                  )}
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => router.push('/form')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5"
              >
                File Another Complaint
              </Button>
            </Card>
          )}

          {/* Empty State */}
          {!complaint && !error && complaintId && (
            <Card className="bg-card/80 border-border/50 p-12 text-center space-y-4">
              <p className="text-lg text-muted-foreground">Enter a complaint ID and click search</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
