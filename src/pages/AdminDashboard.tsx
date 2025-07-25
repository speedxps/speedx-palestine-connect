import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  Settings, 
  DollarSign, 
  FileText,
  Search,
  Plus,
  LogOut,
  Shield,
  Wifi,
  Phone,
  MapPin,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  phone: string;
  location: string;
  package: string;
  status: 'active' | 'expired' | 'suspended';
  endDate: string;
}

interface ServiceRequest {
  id: string;
  subscriberName: string;
  type: 'technical' | 'upgrade' | 'relocation' | 'router';
  description: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Mock data
  const subscribers: Subscriber[] = [
    {
      id: '1',
      name: 'نور محمد',
      phone: '0599123456',
      location: 'رام الله',
      package: 'باقة المتميز - 60 ميجا',
      status: 'active',
      endDate: '2024-08-15'
    },
    {
      id: '2',
      name: 'أحمد علي',
      phone: '0598765432',
      location: 'نابلس',
      package: 'باقة الأساسي - 30 ميجا',
      status: 'active',
      endDate: '2024-07-30'
    },
    {
      id: '3',
      name: 'سارة حسن',
      phone: '0597654321',
      location: 'الخليل',
      package: 'باقة الفائق - 100 ميجا',
      status: 'expired',
      endDate: '2024-06-15'
    }
  ];

  const serviceRequests: ServiceRequest[] = [
    {
      id: '1',
      subscriberName: 'نور محمد',
      type: 'technical',
      description: 'انقطاع في الاتصال',
      date: '2024-07-20',
      status: 'pending'
    },
    {
      id: '2',
      subscriberName: 'أحمد علي',
      type: 'upgrade',
      description: 'طلب ترقية إلى 60 ميجا',
      date: '2024-07-19',
      status: 'in-progress'
    }
  ];

  const filteredSubscribers = subscribers.filter(sub => 
    sub.name.includes(searchTerm) || sub.phone.includes(searchTerm)
  );

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لاستخدام منصة SpeedX الإدارية",
    });
  };

  const handleAddSubscriber = () => {
    toast({
      title: "إضافة مشترك جديد",
      description: "سيتم فتح نموذج إضافة مشترك جديد",
    });
  };

  const handleGenerateInvoice = () => {
    toast({
      title: "إنشاء فاتورة",
      description: "سيتم إنشاء فاتورة جديدة",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">نشط</Badge>;
      case 'expired':
        return <Badge variant="destructive">منتهي</Badge>;
      case 'suspended':
        return <Badge variant="secondary">موقوف</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">في الانتظار</Badge>;
      case 'in-progress':
        return <Badge className="bg-warning text-warning-foreground">قيد المعالجة</Badge>;
      case 'completed':
        return <Badge className="bg-success text-success-foreground">مكتمل</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequestTypeText = (type: string) => {
    switch (type) {
      case 'technical': return 'دعم فني';
      case 'upgrade': return 'ترقية السرعة';
      case 'relocation': return 'تغيير موقع';
      case 'router': return 'راوتر جديد';
      default: return type;
    }
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
            <div>
              <h1 className="text-xl font-bold text-primary">لوحة التحكم الإدارية</h1>
              <p className="text-sm text-muted-foreground">مرحباً {user.name}</p>
            </div>
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
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-card p-1 rounded-lg shadow-card">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            نظرة عامة
          </Button>
          <Button
            variant={activeTab === 'subscribers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('subscribers')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            المشتركين
          </Button>
          <Button
            variant={activeTab === 'requests' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('requests')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            الطلبات
          </Button>
          <Button
            variant={activeTab === 'payments' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('payments')}
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            المدفوعات
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{subscribers.length}</p>
                      <p className="text-sm text-muted-foreground">إجمالي المشتركين</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <Wifi className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {subscribers.filter(s => s.status === 'active').length}
                      </p>
                      <p className="text-sm text-muted-foreground">مشتركين نشطين</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <FileText className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {serviceRequests.filter(r => r.status === 'pending').length}
                      </p>
                      <p className="text-sm text-muted-foreground">طلبات معلقة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">₪15,420</p>
                      <p className="text-sm text-muted-foreground">إيرادات الشهر</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleAddSubscriber}
                    className="h-16 flex items-center gap-3 gradient-primary shadow-primary"
                  >
                    <Plus className="h-5 w-5" />
                    إضافة مشترك جديد
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGenerateInvoice}
                    className="h-16 flex items-center gap-3"
                  >
                    <FileText className="h-5 w-5" />
                    إنشاء فاتورة يدوية
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث بالاسم أو رقم الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Button onClick={handleAddSubscriber} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                إضافة مشترك
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredSubscribers.map((subscriber) => (
                <Card key={subscriber.id} className="shadow-card border-0">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-6 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{subscriber.name}</p>
                          <p className="text-sm text-muted-foreground">#{subscriber.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{subscriber.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{subscriber.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{subscriber.package}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{subscriber.endDate}</span>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        {getStatusBadge(subscriber.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Service Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {serviceRequests.map((request) => (
                <Card key={request.id} className="shadow-card border-0">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="font-semibold">{request.subscriberName}</p>
                        <p className="text-sm text-muted-foreground">#{request.id}</p>
                      </div>
                      
                      <div>
                        <Badge variant="outline">{getRequestTypeText(request.type)}</Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm">{request.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.date}</span>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        {getRequestStatusBadge(request.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>إدارة المدفوعات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>ستتم إضافة إدارة المدفوعات قريباً</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;