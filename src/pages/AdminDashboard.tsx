import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { toast } from '@/hooks/use-toast';
import { useDatabase } from '@/hooks/useDatabase';
import { AddSubscriberDialog } from '@/components/AddSubscriberDialog';
import { ServiceRequestActions } from '@/components/ServiceRequestActions';
import { PermissionManager } from '@/components/PermissionManager';
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
  TrendingUp,
  Edit,
  UserPlus
} from 'lucide-react';

// Interfaces are now imported from useDatabase hook

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    subscribers,
    serviceRequests,
    payments,
    loading,
    addSubscriber,
    updateServiceRequestStatus,
    refreshData,
  } = useDatabase();

  if (!user || user.role !== 'admin') {
    return null;
  }

  const filteredSubscribers = subscribers.filter(sub => 
    sub.full_name.includes(searchTerm) || sub.phone.includes(searchTerm)
  );

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "شكراً لاستخدام منصة SpeedX الإدارية",
    });
  };

  const handleGenerateInvoice = () => {
    // In a real implementation, this would generate and download an invoice
    const monthlyRevenue = subscribers.reduce((total, sub) => total + sub.monthly_fee, 0);
    
    toast({
      title: "تم إنشاء الفاتورة",
      description: `تم إنشاء فاتورة بإجمالي ₪${monthlyRevenue.toFixed(2)}`,
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
                   <AddSubscriberDialog 
                     onAddSubscriber={addSubscriber}
                     isLoading={loading}
                   />
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
               <AddSubscriberDialog 
                 onAddSubscriber={addSubscriber}
                 isLoading={loading}
               />
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
                           <p className="font-semibold text-foreground">{subscriber.full_name}</p>
                           <p className="text-sm text-muted-foreground">#{subscriber.id}</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         <Phone className="h-4 w-4 text-muted-foreground" />
                         <span className="text-sm text-foreground">{subscriber.phone}</span>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         <MapPin className="h-4 w-4 text-muted-foreground" />
                         <span className="text-sm text-foreground">{subscriber.location}</span>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         <Wifi className="h-4 w-4 text-muted-foreground" />
                         <span className="text-sm text-foreground">{subscriber.package_name} - {subscriber.package_speed}</span>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         <Calendar className="h-4 w-4 text-muted-foreground" />
                         <span className="text-sm text-foreground">{subscriber.end_date}</span>
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
                     <div className="grid md:grid-cols-4 gap-4 items-center">
                       <div>
                         <p className="font-semibold text-foreground">
                           {request.subscriber?.full_name || 'غير محدد'}
                         </p>
                         <p className="text-sm text-muted-foreground">#{request.id}</p>
                       </div>
                       
                       <div>
                         <Badge variant="outline">{getRequestTypeText(request.request_type)}</Badge>
                       </div>
                       
                       <div>
                         <p className="text-sm text-foreground">{request.description}</p>
                         <p className="text-xs text-muted-foreground">
                           {new Date(request.created_at).toLocaleDateString('ar')}
                         </p>
                       </div>
                       
                       <div className="flex items-center justify-end">
                         <ServiceRequestActions
                           request={request}
                           onUpdateStatus={updateServiceRequestStatus}
                           isLoading={loading}
                         />
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
                <CardTitle className="flex items-center justify-between">
                  <span>إدارة المدفوعات</span>
                  <Badge variant="outline">
                    {payments.length} دفعة
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد مدفوعات حتى الآن</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <Card key={payment.id} className="border">
                        <CardContent className="p-4">
                          <div className="grid md:grid-cols-4 gap-4 items-center">
                            <div>
                              <p className="font-semibold text-foreground">
                                {payment.subscriber?.full_name || 'غير محدد'}
                              </p>
                              <p className="text-sm text-muted-foreground">#{payment.id}</p>
                            </div>
                            
                            <div>
                              <p className="text-lg font-bold text-foreground">₪{payment.amount}</p>
                              <p className="text-sm text-muted-foreground">{payment.payment_method}</p>
                            </div>
                            
                            <div>
                              <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                                {payment.status === 'completed' ? 'مكتمل' : 
                                 payment.status === 'pending' ? 'في الانتظار' :
                                 payment.status === 'failed' ? 'فاشل' : 'مسترد'}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              {payment.payment_date ? 
                                new Date(payment.payment_date).toLocaleDateString('ar') :
                                'لم يتم الدفع بعد'
                              }
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Permission Management */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  إدارة الصلاحيات والأذونات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PermissionManager />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;