-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  credits_awarded BOOLEAN DEFAULT FALSE,
  signup_bonus_awarded BOOLEAN DEFAULT FALSE,
  task_bonus_awarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(referred_id)
);

-- Create index for faster lookups
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- Add referral_code to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);

-- Create function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character code
    code := UPPER(SUBSTRING(MD5(user_id::TEXT || NOW()::TEXT || RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Update handle_new_user to generate referral code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_referral_code TEXT;
  v_referrer_id UUID;
BEGIN
  -- Generate referral code
  v_referral_code := generate_referral_code(new.id);
  
  -- Insert profile with referral code
  INSERT INTO public.profiles (id, full_name, referral_code)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', v_referral_code);
  
  -- Check if user signed up with a referral code
  IF new.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    -- Find referrer
    SELECT id INTO v_referrer_id
    FROM profiles
    WHERE referral_code = new.raw_user_meta_data->>'referral_code'
    LIMIT 1;
    
    IF v_referrer_id IS NOT NULL THEN
      -- Update referred_by
      UPDATE profiles
      SET referred_by = v_referrer_id
      WHERE id = new.id;
      
      -- Create referral record
      INSERT INTO referrals (referrer_id, referred_id, referral_code)
      VALUES (v_referrer_id, new.id, new.raw_user_meta_data->>'referral_code');
      
      -- Award signup bonus (50 credits to referrer)
      UPDATE credits
      SET amount = amount + 50
      WHERE user_id = v_referrer_id;
      
      INSERT INTO credits_transactions (user_id, amount, type, reason)
      VALUES (v_referrer_id, 50, 'earned', 'Referral signup bonus');
      
      UPDATE referrals
      SET signup_bonus_awarded = TRUE
      WHERE referrer_id = v_referrer_id AND referred_id = new.id;
    END IF;
  END IF;
  
  RETURN new;
END;
$$;

-- Function to award referral task bonus
CREATE OR REPLACE FUNCTION award_referral_task_bonus()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_referrer_id UUID;
  v_bonus_awarded BOOLEAN;
BEGIN
  -- Only award for completed tasks
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Check if this user was referred
    SELECT referred_by INTO v_referrer_id
    FROM profiles
    WHERE id = NEW.user_id;
    
    IF v_referrer_id IS NOT NULL THEN
      -- Check if bonus already awarded
      SELECT task_bonus_awarded INTO v_bonus_awarded
      FROM referrals
      WHERE referrer_id = v_referrer_id AND referred_id = NEW.user_id;
      
      IF NOT COALESCE(v_bonus_awarded, FALSE) THEN
        -- Award task completion bonus (25 credits to referrer)
        UPDATE credits
        SET amount = amount + 25
        WHERE user_id = v_referrer_id;
        
        INSERT INTO credits_transactions (user_id, amount, type, reason)
        VALUES (v_referrer_id, 25, 'earned', 'Referral task completion bonus');
        
        UPDATE referrals
        SET task_bonus_awarded = TRUE
        WHERE referrer_id = v_referrer_id AND referred_id = NEW.user_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for referral task bonus
DROP TRIGGER IF EXISTS trigger_award_referral_bonus ON tasks;
CREATE TRIGGER trigger_award_referral_bonus
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION award_referral_task_bonus();