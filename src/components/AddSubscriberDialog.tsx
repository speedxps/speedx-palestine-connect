import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Subscriber } from '@/hooks/useDatabase';

interface AddSubscriberDialogProps {
  onAddSubscriber: (subscriber: Omit<Subscriber, 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
  isLoading?: boolean;
}

export const AddSubscriberDialog: React.FC<AddSubscriberDialogProps> = ({ 
  onAddSubscriber, 
  isLoading = false 
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{
    full_name: string;
    phone: string;
    location: string;
    package_name: string;
    package_speed: string;
    status: 'active' | 'expired' | 'suspended';
    end_date: string;
    monthly_fee: number;
    start_date: string;
  }>({
    full_name: '',
    phone: '',
    location: '',
    package_name: '',
    package_speed: '',
    status: 'active',
    end_date: '',
    monthly_fee: 0,
    start_date: new Date().toISOString().split('T')[0],
  });

  const packages = [
    { name: 'باقة الأساسي', speed: '30 ميجا', fee: 80 },
    { name: 'باقة المتميز', speed: '60 ميجا', fee: 120 },
    { name: 'باقة الفائق', speed: '100 ميجا', fee: 180 },
    { name: 'باقة الاحترافي', speed: '200 ميجا', fee: 250 },
  ];

  const handlePackageChange = (packageName: string) => {
    const selectedPackage = packages.find(pkg => pkg.name === packageName);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        package_name: selectedPackage.name,
        package_speed: selectedPackage.speed,
        monthly_fee: selectedPackage.fee,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddSubscriber(formData);
      setOpen(false);
      setFormData({
        full_name: '',
        phone: '',
        location: '',
        package_name: '',
        package_speed: '',
        status: 'active',
        end_date: '',
        monthly_fee: 0,
        start_date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة مشترك
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة مشترك جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">الاسم الكامل</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="أدخل الاسم الكامل"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="0599123456"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">الموقع</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="المدينة أو المنطقة"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="package">الباقة</Label>
            <Select onValueChange={handlePackageChange} required>
              <SelectTrigger>
                <SelectValue placeholder="اختر الباقة" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.name} value={pkg.name}>
                    {pkg.name} - {pkg.speed} - ₪{pkg.fee}/شهر
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">تاريخ البداية</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">تاريخ الانتهاء</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">الحالة</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'expired' | 'suspended' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="expired">منتهي</SelectItem>
                <SelectItem value="suspended">موقوف</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الإضافة..." : "إضافة المشترك"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};