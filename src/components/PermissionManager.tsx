import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Shield, Settings, DollarSign, BarChart, Cog } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface UserPermission {
  userId: string;
  userName: string;
  permissions: string[];
}

const availablePermissions: Permission[] = [
  {
    id: 'manage_subscribers',
    name: 'إدارة المشتركين',
    description: 'إضافة وتعديل وحذف المشتركين',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'manage_requests',
    name: 'إدارة الطلبات',
    description: 'معالجة طلبات الخدمة والدعم الفني',
    icon: <Settings className="h-4 w-4" />
  },
  {
    id: 'manage_payments',
    name: 'إدارة المدفوعات',
    description: 'معالجة وتتبع المدفوعات والفواتير',
    icon: <DollarSign className="h-4 w-4" />
  },
  {
    id: 'manage_admins',
    name: 'إدارة المسؤولين',
    description: 'إضافة وإدارة المسؤولين والمشرفين',
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: 'view_analytics',
    name: 'عرض التحليلات',
    description: 'الوصول إلى التقارير والإحصائيات',
    icon: <BarChart className="h-4 w-4" />
  },
  {
    id: 'system_settings',
    name: 'إعدادات النظام',
    description: 'إدارة إعدادات النظام العامة',
    icon: <Cog className="h-4 w-4" />
  }
];

export const PermissionManager: React.FC = () => {
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([
    {
      userId: '1',
      userName: 'مدير النظام',
      permissions: ['manage_subscribers', 'manage_requests', 'manage_payments', 'manage_admins', 'view_analytics', 'system_settings']
    },
    {
      userId: '2',
      userName: 'مشرف المشتركين',
      permissions: ['manage_subscribers', 'manage_requests', 'view_analytics']
    }
  ]);

  const [newUserDialog, setNewUserDialog] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPermissions, setNewUserPermissions] = useState<string[]>([]);

  const updateUserPermissions = (userId: string, permissionId: string, checked: boolean) => {
    setUserPermissions(prev => prev.map(user => {
      if (user.userId === userId) {
        const updatedPermissions = checked
          ? [...user.permissions, permissionId]
          : user.permissions.filter(p => p !== permissionId);
        
        return { ...user, permissions: updatedPermissions };
      }
      return user;
    }));

    toast({
      title: "تم تحديث الصلاحيات",
      description: "تم تحديث صلاحيات المستخدم بنجاح",
    });
  };

  const handleNewUserPermissionChange = (permissionId: string, checked: boolean) => {
    setNewUserPermissions(prev => {
      if (checked) {
        return [...prev, permissionId];
      } else {
        return prev.filter(p => p !== permissionId);
      }
    });
  };

  const addNewUser = () => {
    if (!newUserName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم",
        variant: "destructive",
      });
      return;
    }

    const newUser: UserPermission = {
      userId: Date.now().toString(),
      userName: newUserName,
      permissions: newUserPermissions
    };

    setUserPermissions(prev => [...prev, newUser]);
    setNewUserName('');
    setNewUserPermissions([]);
    setNewUserDialog(false);

    toast({
      title: "تم إضافة المستخدم",
      description: "تم إضافة المستخدم الجديد بصلاحياته",
    });
  };

  const removeUser = (userId: string) => {
    setUserPermissions(prev => prev.filter(user => user.userId !== userId));
    toast({
      title: "تم حذف المستخدم",
      description: "تم حذف المستخدم وجميع صلاحياته",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">إدارة الصلاحيات</h3>
        <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
          <DialogTrigger asChild>
            <Button>
              <Shield className="h-4 w-4 mr-2" />
              إضافة مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">اسم المستخدم</Label>
                <Input
                  id="userName"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                />
              </div>
              
              <div className="space-y-3">
                <Label>الصلاحيات</Label>
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`new-${permission.id}`}
                      checked={newUserPermissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        handleNewUserPermissionChange(permission.id, !!checked)
                      }
                    />
                    <div className="flex items-center gap-2">
                      {permission.icon}
                      <div>
                        <Label htmlFor={`new-${permission.id}`} className="text-sm font-medium">
                          {permission.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setNewUserDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={addNewUser}>
                  إضافة المستخدم
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {userPermissions.map((user) => (
          <Card key={user.userId}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{user.userName}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {user.permissions.length} صلاحية
                  </Badge>
                  {user.userId !== '1' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeUser(user.userId)}
                      className="text-destructive hover:text-destructive"
                    >
                      حذف
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`${user.userId}-${permission.id}`}
                      checked={user.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        updateUserPermissions(user.userId, permission.id, !!checked)
                      }
                      disabled={user.userId === '1'} // Prevent modifying super admin
                    />
                    <div className="flex items-center gap-2">
                      {permission.icon}
                      <div>
                        <Label 
                          htmlFor={`${user.userId}-${permission.id}`} 
                          className="text-sm font-medium cursor-pointer"
                        >
                          {permission.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};