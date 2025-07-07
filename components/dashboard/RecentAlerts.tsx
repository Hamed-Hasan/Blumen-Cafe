'use client';

import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, X } from 'lucide-react';

export function RecentAlerts() {
  const { alerts, markAlertAsRead } = useData();

  const recentAlerts = alerts
    .filter(alert => !alert.isRead)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'expired':
      case 'expiring_soon':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAlerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No unread alerts
          </p>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <Alert key={alert.id} className="relative">
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAlertAsRead(alert.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <AlertDescription className="text-xs">
                      {alert.message}
                    </AlertDescription>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {alert.location}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(alert.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}