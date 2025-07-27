import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (login(username, password)) {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في منصة SpeedX",
      });
      
      // Navigate based on user role
      if (username === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    const email = prompt('أدخل عنوان البريد الإلكتروني لاستعادة كلمة المرور:');
    
    if (!email) {
      return;
    }

    if (!email.includes('@')) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال عنوان بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Call the password reset edge function
      const response = await fetch(`https://bhduqvxuhdrhwatryscc.supabase.co/functions/v1/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZHVxdnh1aGRyaHdhdHJ5c2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0ODI1NDEsImV4cCI6MjA2OTA1ODU0MX0.AePyKJhQ3mDupo9L-f0pPS0QEl8-YJfIxG_WnLSAGrU`,
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم إرسال البريد الإلكتروني",
          description: "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني",
        });
      } else {
        toast({
          title: "خطأ في استعادة كلمة المرور",
          description: result.error || "حدث خطأ أثناء إرسال بريد استعادة كلمة المرور",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "خطأ في الاتصال",
        description: "حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md shadow-card border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <img 
              src="/lovable-uploads/df62361b-f751-475c-b333-cd3241595238.png" 
              alt="SpeedX Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-primary mb-2">
            تسجيل الدخول
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            منصة إدارة الإنترنت الفضائي SpeedX
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-right block">
                اسم المستخدم
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-right"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right pr-10"
                  dir="ltr"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember" className="text-sm">
                  تذكرني
                </Label>
              </div>
              
              <Button
                type="button"
                variant="link"
                className="text-sm p-0 h-auto"
                onClick={handleForgotPassword}
              >
                نسيت كلمة المرور؟
              </Button>
            </div>
            
            <Button
              type="submit"
              className="w-full gradient-primary shadow-primary"
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
          
          <div className="text-center text-xs text-muted-foreground mt-6">
            <p>أمثلة للاختبار:</p>
            <p>المدير: admin / 123</p>
            <p>المشترك: noor / 123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;