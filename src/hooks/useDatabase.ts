import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Subscriber {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  location: string;
  package_name: string;
  package_speed: string;
  status: 'active' | 'expired' | 'suspended';
  start_date: string;
  end_date: string;
  monthly_fee: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  subscriber_id: string;
  request_type: 'technical' | 'upgrade' | 'relocation' | 'router';
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  subscriber?: {
    full_name: string;
  };
}

export interface Payment {
  id: string;
  subscriber_id: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_date?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  subscriber?: {
    full_name: string;
  };
}

export const useDatabase = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscribers
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (subscribersError) throw subscribersError;

      // Fetch service requests with subscriber info
      const { data: requestsData, error: requestsError } = await supabase
        .from('service_requests')
        .select(`
          *,
          subscriber:subscribers(full_name)
        `)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch payments with subscriber info
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          subscriber:subscribers(full_name)
        `)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      setSubscribers(subscribersData as Subscriber[] || []);
      setServiceRequests(requestsData as ServiceRequest[] || []);
      setPayments(paymentsData as Payment[] || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل البيانات من قاعدة البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new subscriber
  const addSubscriber = async (subscriberData: Omit<Subscriber, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .insert([subscriberData])
        .select()
        .single();

      if (error) throw error;

      setSubscribers(prev => [data as Subscriber, ...prev]);
      toast({
        title: "تم إضافة المشترك",
        description: "تم إضافة المشترك الجديد بنجاح",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding subscriber:', error);
      toast({
        title: "خطأ في إضافة المشترك",
        description: "حدث خطأ أثناء إضافة المشترك الجديد",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update subscriber
  const updateSubscriber = async (id: string, updates: Partial<Subscriber>) => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSubscribers(prev => prev.map(sub => sub.id === id ? data as Subscriber : sub));
      toast({
        title: "تم تحديث المشترك",
        description: "تم تحديث بيانات المشترك بنجاح",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast({
        title: "خطأ في تحديث المشترك",
        description: "حدث خطأ أثناء تحديث بيانات المشترك",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update service request status
  const updateServiceRequestStatus = async (id: string, status: ServiceRequest['status']) => {
    try {
      const updates: any = { status };
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('service_requests')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          subscriber:subscribers(full_name)
        `)
        .single();

      if (error) throw error;

      setServiceRequests(prev => prev.map(req => req.id === id ? data as ServiceRequest : req));
      toast({
        title: "تم تحديث الطلب",
        description: "تم تحديث حالة الطلب بنجاح",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating service request:', error);
      toast({
        title: "خطأ في تحديث الطلب",
        description: "حدث خطأ أثناء تحديث حالة الطلب",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create service request
  const createServiceRequest = async (requestData: {
    subscriber_id: string;
    request_type: ServiceRequest['request_type'];
    description: string;
    priority?: ServiceRequest['priority'];
  }) => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .insert([requestData])
        .select(`
          *,
          subscriber:subscribers(full_name)
        `)
        .single();

      if (error) throw error;

      setServiceRequests(prev => [data as ServiceRequest, ...prev]);
      toast({
        title: "تم إرسال الطلب",
        description: "تم إرسال طلب الخدمة بنجاح",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال طلب الخدمة",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add payment
  const addPayment = async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select(`
          *,
          subscriber:subscribers(full_name)
        `)
        .single();

      if (error) throw error;

      setPayments(prev => [data as Payment, ...prev]);
      toast({
        title: "تم إضافة الدفعة",
        description: "تم تسجيل الدفعة بنجاح",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding payment:', error);
      toast({
        title: "خطأ في إضافة الدفعة",
        description: "حدث خطأ أثناء تسجيل الدفعة",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    subscribers,
    serviceRequests,
    payments,
    loading,
    refreshData: fetchData,
    addSubscriber,
    updateSubscriber,
    updateServiceRequestStatus,
    createServiceRequest,
    addPayment,
  };
};