import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceRequest } from '@/hooks/useDatabase';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ServiceRequestActionsProps {
  request: ServiceRequest;
  onUpdateStatus: (id: string, status: ServiceRequest['status']) => Promise<any>;
  isLoading?: boolean;
}

export const ServiceRequestActions: React.FC<ServiceRequestActionsProps> = ({
  request,
  onUpdateStatus,
  isLoading = false
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'in-progress':
        return 'قيد المعالجة';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in-progress':
        return 'default';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-destructive';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'عاجل';
      case 'high':
        return 'عالي';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return priority;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={getStatusVariant(request.status) as any}
        className="flex items-center gap-1"
      >
        {getStatusIcon(request.status)}
        {getStatusText(request.status)}
      </Badge>
      
      <span className={`text-xs font-medium ${getPriorityColor(request.priority)}`}>
        {getPriorityText(request.priority)}
      </span>

      {request.status !== 'completed' && request.status !== 'cancelled' && (
        <Select
          value={request.status}
          onValueChange={(status) => onUpdateStatus(request.id, status as ServiceRequest['status'])}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">في الانتظار</SelectItem>
            <SelectItem value="in-progress">قيد المعالجة</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};