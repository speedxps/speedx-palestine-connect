import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { toast } from '@/hooks/use-toast';
import { useDatabase } from '@/hooks/useDatabase';
import { 
  User, 
  Phone, 
  MapPin, 
  Wifi, 
  Calendar, 
  Clock,
  Settings,
  TrendingUp,
  Truck,
  Router,
  LogOut,
  Bell
} from 'lucide-react';

const SubscriberDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { createServiceRequest, loading } = useDatabase();

  if (!user || user.role !== 'subscriber') {
    return null;
  }

  // Calculate days remaining
  const endDate = new Date(user.endDate || '');
  const today = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleServiceRequest = async (type: string) => {
    const requestTypes = {
      'technical': 'طلب الدعم الفني',
      'upgrade': 'طلب ترقية السرعة',
      'relocation': 'طلب تغيير الموقع',
      'router': 'طلب راوتر جديد'
    };

    try {
      // For now, we'll use a mock subscriber ID since we don't have real auth integration yet
      // In a real implementation, this would come from the authenticated user's subscriber record
      await createServiceRequest({
        subscriber_id: 'mock-subscriber-id', // This should be replaced with actual subscriber ID
        request_type: type as any,
        description: `طلب ${requestTypes[type as keyof typeof requestTypes]} من المشترك ${user?.name}`,
        priority: 'medium'
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لاستخدام منصة SpeedX",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/df62361b-f751-475c-b333-cd3241595238.png" 
              alt="SpeedX Logo" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-bold text-primary">SpeedX Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-card border-0">
              <CardHeader className="text-center bg-gradient-primary text-primary-foreground rounded-t-lg">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10" />
                </div>
                <CardTitle className="text-lg">{user.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 mt-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-primary" />
                  <span>{user.package}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  الباقة الحالية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">اسم الباقة</p>
                    <p className="font-semibold">{user.package}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">السرعة</p>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {user.speed}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">تاريخ البداية</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{user.startDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">تاريخ انتهاء الاشتراك</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{user.endDate}</span>
                    </div>
                  </div>
                </div>
                
                {/* Days Remaining */}
                <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">الأيام المتبقية:</span>
                    <Badge 
                      variant={daysRemaining > 30 ? "default" : daysRemaining > 7 ? "secondary" : "destructive"}
                      className="text-lg px-4 py-2"
                    >
                      {daysRemaining} يوم
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Requests */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  طلبات الخدمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleServiceRequest('technical')}
                    disabled={loading}
                  >
                    <Settings className="h-6 w-6" />
                    <span>الدعم الفني</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleServiceRequest('upgrade')}
                    disabled={loading}
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span>ترقية السرعة</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleServiceRequest('relocation')}
                    disabled={loading}
                  >
                    <Truck className="h-6 w-6" />
                    <span>تغيير الموقع</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleServiceRequest('router')}
                    disabled={loading}
                  >
                    <Router className="h-6 w-6" />
                    <span>راوتر جديد</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  معلومات الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent/50 rounded-lg">
                    <h3 className="font-semibold mb-2">طرق الدفع المتاحة:</h3>
                    <div className="space-y-2 text-sm">
                      <p>• حساب Reflect: 0599123456</p>
                      <p>• الدفع الإلكتروني عبر الرابط الآمن</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                    <span>حالة الاشتراك:</span>
                    <Badge className="bg-success text-success-foreground">
                      نشط
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberDashboard;