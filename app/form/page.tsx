'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { ComplaintCategory } from '@/lib/types';

const CATEGORIES: { value: ComplaintCategory; label: string }[] = [
  { value: 'water_supply', label: 'Water Supply' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'roads', label: 'Roads & Potholes' },
  { value: 'streetlights', label: 'Streetlights' },
  { value: 'garbage', label: 'Garbage & Waste' },
  { value: 'traffic', label: 'Traffic & Roads' },
  { value: 'construction', label: 'Construction' },
  { value: 'parks', label: 'Parks & Public Spaces' },
  { value: 'public_facilities', label: 'Public Facilities' },
  { value: 'corruption', label: 'Corruption' },
  { value: 'other', label: 'Other' },
];

export default function ComplaintForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [complaintId, setComplaintId] = useState('');
  const [formData, setFormData] = useState({
    citizen_name: '',
    citizen_email: '',
    citizen_phone: '',
    category: '' as ComplaintCategory,
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: ComplaintCategory) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.citizen_name || !formData.category || !formData.title || 
          !formData.description || !formData.location) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/complaints/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          intake_channel: 'website',
          location_coordinates: formData.latitude && formData.longitude ? {
            lat: parseFloat(formData.latitude),
            lng: parseFloat(formData.longitude),
          } : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      const result = await response.json();
      setComplaintId(result.complaint_id);
      setSubmitted(true);

      setTimeout(() => {
        router.push(`/track/${result.complaint_id}`);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit complaint');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="bg-card/80 border-border/50 p-8 sm:p-12 max-w-md w-full space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Complaint Submitted!</h2>
          <p className="text-muted-foreground">
            Your complaint ID: <span className="font-mono font-semibold text-primary">{complaintId}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Keep this ID to track your complaint status. You'll be redirected shortly.
          </p>
          <Button
            onClick={() => router.push(`/track/${complaintId}`)}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Track Your Complaint
          </Button>
        </Card>
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">File a Complaint</h1>
            <p className="text-lg text-muted-foreground">
              Help us improve city services by reporting issues
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <Card className="bg-card/80 border-border/50 p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Your Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Your Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name *</label>
                    <Input
                      name="citizen_name"
                      value={formData.citizen_name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email *</label>
                    <Input
                      type="email"
                      name="citizen_email"
                      value={formData.citizen_email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="bg-input border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <Input
                    type="tel"
                    name="citizen_phone"
                    value={formData.citizen_phone}
                    onChange={handleChange}
                    placeholder="(+91) 98765 43210"
                    className="bg-input border-border"
                  />
                </div>
              </div>

              {/* Complaint Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Complaint Details</h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category *</label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title *</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief title of your complaint"
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description *</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of the issue"
                    className="bg-input border-border min-h-32"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Location</h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Address *</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Complete address or location description"
                    className="bg-input border-border"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Latitude (Optional)</label>
                    <Input
                      name="latitude"
                      type="number"
                      step="0.0001"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="22.3072"
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Longitude (Optional)</label>
                    <Input
                      name="longitude"
                      type="number"
                      step="0.0001"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="73.1812"
                      className="bg-input border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                * Required fields. Your information will be kept confidential.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
