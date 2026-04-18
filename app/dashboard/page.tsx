'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, LogOut, Search, Filter, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ComplaintStatus = 'registered' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

interface Complaint {
  id: string;
  title: string;
  category: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  citizen_name: string;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | 'all'>('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, searchQuery, statusFilter, priorityFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/complaints/list');
      if (!response.ok) throw new Error('Failed to fetch complaints');
      const data = await response.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = complaints;

    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }

    setFilteredComplaints(filtered);
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
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

  const getPriorityColor = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'critical':
        return 'bg-destructive/20 text-destructive';
      case 'high':
        return 'bg-primary/20 text-primary';
      case 'medium':
        return 'bg-accent/20 text-accent';
      case 'low':
        return 'bg-secondary/20 text-secondary';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 sticky top-0 z-50 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Officer Dashboard</h1>
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem('officer_token');
              router.push('/');
            }}
            className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/60 border-border/50 p-6">
            <p className="text-sm text-muted-foreground mb-2">Total</p>
            <p className="text-3xl font-bold text-foreground">{complaints.length}</p>
          </Card>
          <Card className="bg-card/60 border-border/50 p-6">
            <p className="text-sm text-muted-foreground mb-2">In Progress</p>
            <p className="text-3xl font-bold text-accent">
              {complaints.filter(c => c.status === 'in_progress').length}
            </p>
          </Card>
          <Card className="bg-card/60 border-border/50 p-6">
            <p className="text-sm text-muted-foreground mb-2">Resolved</p>
            <p className="text-3xl font-bold text-secondary">
              {complaints.filter(c => c.status === 'resolved').length}
            </p>
          </Card>
          <Card className="bg-card/60 border-border/50 p-6">
            <p className="text-sm text-muted-foreground mb-2">Critical</p>
            <p className="text-3xl font-bold text-destructive">
              {complaints.filter(c => c.priority === 'critical').length}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="w-40 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(v: any) => setPriorityFilter(v)}>
                <SelectTrigger className="w-40 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="bg-destructive/10 border-destructive/20 text-destructive mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Complaints List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="bg-card/80 border-border/50 p-12 text-center">
              <p className="text-muted-foreground">Loading complaints...</p>
            </Card>
          ) : filteredComplaints.length === 0 ? (
            <Card className="bg-card/80 border-border/50 p-12 text-center">
              <p className="text-muted-foreground">
                {complaints.length === 0 ? 'No complaints yet' : 'No complaints match your filters'}
              </p>
            </Card>
          ) : (
            filteredComplaints.map(complaint => (
              <Card
                key={complaint.id}
                onClick={() => router.push(`/dashboard/complaints/${complaint.id}`)}
                className="bg-card/80 border-border/50 p-6 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 mt-1 ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {complaint.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {complaint.citizen_name} • {new Date(complaint.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-muted/40 text-muted-foreground">
                        {complaint.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </div>
                    <p className="text-sm text-primary font-mono flex-shrink-0">
                      {complaint.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
