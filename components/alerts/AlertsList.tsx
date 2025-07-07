'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  AlertTriangle,
  Clock,
  Package,
  Truck,
  X,
  CheckCircle
} from 'lucide-react';

export function AlertsList() {
  const { user } = useAuth();
  const { alerts, markAlertAsRead } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;

    // Branch managers can only see their branch alerts
    if (user?.role === 'branch_manager' && user.branch) {
      return matchesSearch && matchesType && matchesSeverity && alert.location === user.branch;
    }

    return matchesSearch && matchesType && matchesSeverity;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <Package className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      case 'expiring_soon': return <Clock className="w-4 h-4" />;
      case 'delivery_delay': return <Truck className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alerts & Notifications
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alerts.forEach(alert => markAlertAsRead(alert.id))}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                <SelectItem value="missing_product">Missing Product</SelectItem>
                <SelectItem value="delivery_delay">Delivery Delay</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No alerts found matching your criteria
              </p>
            ) : (
              filteredAlerts.map((alert) => (
                <Alert key={alert.id} className={`relative ${alert.isRead ? 'opacity-60' : ''}`}>
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {!alert.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAlertAsRead(alert.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <AlertDescription className="text-xs mb-2">
                        {alert.message}
                      </AlertDescription>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {alert.location}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(alert.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}