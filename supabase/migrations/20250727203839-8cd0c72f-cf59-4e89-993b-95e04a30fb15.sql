-- Create a function to send password reset emails
CREATE OR REPLACE FUNCTION public.handle_password_reset_request(email_address text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_record auth.users%ROWTYPE;
  reset_token text;
BEGIN
  -- Check if user exists
  SELECT * INTO user_record FROM auth.users WHERE email = email_address LIMIT 1;
  
  IF user_record.id IS NULL THEN
    -- Don't reveal whether email exists or not for security
    RETURN;
  END IF;
  
  -- Generate a reset token (in a real implementation, this would be more secure)
  reset_token := encode(gen_random_bytes(32), 'hex');
  
  -- Store the reset token with expiration (you would need a password_reset_tokens table)
  -- For now, we'll just create a basic notification
  
  -- In a real implementation, you would:
  -- 1. Store the reset token in a secure table with expiration
  -- 2. Send an email with the reset link
  -- 3. Provide an endpoint to handle the reset
  
  RAISE NOTICE 'Password reset requested for email: %', email_address;
END;
$$;