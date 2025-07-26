-- Create database tables for the functional admin system (without sample data)

-- User profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  role TEXT DEFAULT 'subscriber' CHECK (role IN ('admin', 'subscriber', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Subscribers table
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  package_name TEXT NOT NULL,
  package_speed TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  monthly_fee DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Service requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('technical', 'upgrade', 'relocation', 'router')),
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin permissions table
CREATE TABLE public.admin_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission TEXT NOT NULL CHECK (permission IN (
    'manage_subscribers', 'manage_requests', 'manage_payments', 
    'manage_admins', 'view_analytics', 'system_settings'
  )),
  granted_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() IN ('admin', 'moderator'));

-- Subscribers policies
CREATE POLICY "Admins can manage all subscribers" ON public.subscribers
  FOR ALL USING (public.get_current_user_role() IN ('admin', 'moderator'));

CREATE POLICY "Users can view their own subscriber data" ON public.subscribers
  FOR SELECT USING (auth.uid() = user_id);

-- Service requests policies
CREATE POLICY "Users can view their own requests" ON public.service_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.subscribers s 
      WHERE s.id = service_requests.subscriber_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create requests for themselves" ON public.service_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subscribers s 
      WHERE s.id = service_requests.subscriber_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all requests" ON public.service_requests
  FOR ALL USING (public.get_current_user_role() IN ('admin', 'moderator'));

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.subscribers s 
      WHERE s.id = payments.subscriber_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (public.get_current_user_role() IN ('admin', 'moderator'));

-- Admin permissions policies
CREATE POLICY "Admins can view permissions" ON public.admin_permissions
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage permissions" ON public.admin_permissions
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample subscriber data (not linked to auth users)
INSERT INTO public.subscribers (user_id, full_name, phone, location, package_name, package_speed, status, end_date, monthly_fee) VALUES
  (null, 'نور محمد', '0599123457', 'رام الله', 'باقة المتميز', '60 ميجا', 'active', '2024-08-15', 120.00),
  (null, 'أحمد علي', '0598765432', 'نابلس', 'باقة الأساسي', '30 ميجا', 'active', '2024-07-30', 80.00),
  (null, 'سارة حسن', '0597654321', 'الخليل', 'باقة الفائق', '100 ميجا', 'expired', '2024-06-15', 180.00);

-- Insert sample service requests
INSERT INTO public.service_requests (subscriber_id, request_type, description, status, priority) 
SELECT s.id, 'technical', 'انقطاع في الاتصال', 'pending', 'high'
FROM public.subscribers s WHERE s.full_name = 'نور محمد' LIMIT 1;

INSERT INTO public.service_requests (subscriber_id, request_type, description, status, priority)
SELECT s.id, 'upgrade', 'طلب ترقية إلى 60 ميجا', 'in-progress', 'medium' 
FROM public.subscribers s WHERE s.full_name = 'أحمد علي' LIMIT 1;