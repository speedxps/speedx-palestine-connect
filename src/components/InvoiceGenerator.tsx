import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Printer } from "lucide-react";
import { Subscriber } from '@/hooks/useDatabase';
import { toast } from '@/hooks/use-toast';

interface InvoiceGeneratorProps {
  subscribers: Subscriber[];
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ subscribers }) => {
  const [selectedSubscriber, setSelectedSubscriber] = React.useState<string>('');
  const [open, setOpen] = React.useState(false);

  const generateInvoiceForAll = () => {
    const totalRevenue = subscribers.reduce((sum, sub) => sum + sub.monthly_fee, 0);
    const activeSubscribers = subscribers.filter(sub => sub.status === 'active');
    
    // Create invoice content
    const invoiceContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة جماعية - SpeedX</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #0066cc; margin-bottom: 10px; }
        .invoice-info { margin-bottom: 30px; }
        .subscribers-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .subscribers-table th, .subscribers-table td { border: 1px solid #ddd; padding: 12px; text-align: right; }
        .subscribers-table th { background-color: #f5f5f5; font-weight: bold; }
        .total { font-size: 18px; font-weight: bold; text-align: center; background-color: #f0f8ff; padding: 15px; border: 2px solid #0066cc; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">SpeedX - الإنترنت الفضائي</div>
        <div>فاتورة جماعية للمشتركين النشطين</div>
        <div>تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</div>
    </div>
    
    <div class="invoice-info">
        <p><strong>عدد المشتركين النشطين:</strong> ${activeSubscribers.length}</p>
        <p><strong>إجمالي عدد المشتركين:</strong> ${subscribers.length}</p>
    </div>
    
    <table class="subscribers-table">
        <thead>
            <tr>
                <th>الاسم الكامل</th>
                <th>رقم الهاتف</th>
                <th>الموقع</th>
                <th>الباقة</th>
                <th>الرسوم الشهرية</th>
                <th>تاريخ الانتهاء</th>
                <th>الحالة</th>
            </tr>
        </thead>
        <tbody>
            ${activeSubscribers.map(sub => `
                <tr>
                    <td>${sub.full_name}</td>
                    <td>${sub.phone}</td>
                    <td>${sub.location}</td>
                    <td>${sub.package_name} - ${sub.package_speed}</td>
                    <td>₪${sub.monthly_fee}</td>
                    <td>${new Date(sub.end_date).toLocaleDateString('ar-SA')}</td>
                    <td>${sub.status === 'active' ? 'نشط' : sub.status === 'expired' ? 'منتهي' : 'موقوف'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="total">
        إجمالي الإيرادات المتوقعة: ₪${totalRevenue.toFixed(2)}
    </div>
    
    <div class="footer">
        <p>شركة SpeedX للإنترنت الفضائي</p>
        <p>للاستفسارات: info.speedx.ps@gmail.com</p>
    </div>
</body>
</html>
    `;

    // Create and download the invoice
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `فاتورة_جماعية_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "تم إنشاء الفاتورة الجماعية",
      description: `تم إنشاء فاتورة لـ ${activeSubscribers.length} مشترك نشط`,
    });
  };

  const generateInvoiceForSubscriber = () => {
    const subscriber = subscribers.find(sub => sub.id === selectedSubscriber);
    if (!subscriber) return;

    const invoiceContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة - ${subscriber.full_name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #0066cc; margin-bottom: 10px; }
        .invoice-details { margin-bottom: 30px; }
        .subscriber-info { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .package-info { background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .payment-info { background-color: #f0fff0; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .total { font-size: 20px; font-weight: bold; text-align: center; background-color: #ffe6e6; padding: 20px; border: 2px solid #ff6666; border-radius: 8px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">SpeedX - الإنترنت الفضائي</div>
        <div>فاتورة اشتراك شهري</div>
        <div>تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</div>
        <div>رقم الفاتورة: INV-${Date.now()}</div>
    </div>
    
    <div class="subscriber-info">
        <h3>معلومات المشترك</h3>
        <div class="row">
            <span class="label">الاسم الكامل:</span>
            <span>${subscriber.full_name}</span>
        </div>
        <div class="row">
            <span class="label">رقم الهاتف:</span>
            <span>${subscriber.phone}</span>
        </div>
        <div class="row">
            <span class="label">الموقع:</span>
            <span>${subscriber.location}</span>
        </div>
        <div class="row">
            <span class="label">رقم المشترك:</span>
            <span>${subscriber.id}</span>
        </div>
    </div>
    
    <div class="package-info">
        <h3>تفاصيل الباقة</h3>
        <div class="row">
            <span class="label">اسم الباقة:</span>
            <span>${subscriber.package_name}</span>
        </div>
        <div class="row">
            <span class="label">السرعة:</span>
            <span>${subscriber.package_speed}</span>
        </div>
        <div class="row">
            <span class="label">تاريخ البداية:</span>
            <span>${new Date(subscriber.start_date).toLocaleDateString('ar-SA')}</span>
        </div>
        <div class="row">
            <span class="label">تاريخ الانتهاء:</span>
            <span>${new Date(subscriber.end_date).toLocaleDateString('ar-SA')}</span>
        </div>
        <div class="row">
            <span class="label">الحالة:</span>
            <span>${subscriber.status === 'active' ? 'نشط' : subscriber.status === 'expired' ? 'منتهي' : 'موقوف'}</span>
        </div>
    </div>
    
    <div class="payment-info">
        <h3>معلومات الدفع</h3>
        <div class="row">
            <span class="label">طرق الدفع المتاحة:</span>
            <span>حساب Reflect: 0599123456</span>
        </div>
        <div class="row">
            <span class="label">البريد الإلكتروني:</span>
            <span>info.speedx.ps@gmail.com</span>
        </div>
    </div>
    
    <div class="total">
        المبلغ المستحق: ₪${subscriber.monthly_fee}
    </div>
    
    <div class="footer">
        <p>شركة SpeedX للإنترنت الفضائي</p>
        <p>للاستفسارات: info.speedx.ps@gmail.com</p>
        <p>شكراً لاختياركم خدماتنا</p>
    </div>
</body>
</html>
    `;

    // Create and download the invoice
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `فاتورة_${subscriber.full_name}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "تم إنشاء فاتورة المشترك",
      description: `تم إنشاء فاتورة للمشترك ${subscriber.full_name}`,
    });

    setOpen(false);
    setSelectedSubscriber('');
  };

  return (
    <div className="flex gap-3">
      {/* Generate Invoice for All Subscribers */}
      <Button
        variant="outline"
        onClick={generateInvoiceForAll}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        فاتورة جماعية
      </Button>

      {/* Generate Invoice for Specific Subscriber */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            فاتورة مشترك محدد
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>إنشاء فاتورة لمشترك محدد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">اختر المشترك</label>
              <Select value={selectedSubscriber} onValueChange={setSelectedSubscriber}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المشترك" />
                </SelectTrigger>
                <SelectContent>
                  {subscribers.map((subscriber) => (
                    <SelectItem key={subscriber.id} value={subscriber.id}>
                      {subscriber.full_name} - {subscriber.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                onClick={generateInvoiceForSubscriber}
                disabled={!selectedSubscriber}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                إنشاء الفاتورة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};