-- Update all existing users to have 100 credits
UPDATE public.credits SET amount = 100 WHERE amount < 100;

-- Drop existing function and recreate with 100 credits
DROP FUNCTION IF EXISTS public.handle_daily_credit_reset() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_daily_credit_reset()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_is_owner BOOLEAN;
  v_owner_email TEXT := 'yassin.kadry@icloud.com';
BEGIN
  -- Check if user is owner
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = NEW.user_id AND email = v_owner_email
  ) INTO v_is_owner;

  -- Skip reset for owner (they have unlimited)
  IF v_is_owner THEN
    RETURN NEW;
  END IF;

  -- Check if user already got credits today
  IF NOT EXISTS (
    SELECT 1 FROM daily_credit_resets
    WHERE user_id = NEW.user_id AND reset_date = CURRENT_DATE
  ) THEN
    -- Reset credits to 100 (changed from 50)
    UPDATE credits
    SET amount = 100, updated_at = now()
    WHERE user_id = NEW.user_id;

    -- Log the reset
    INSERT INTO daily_credit_resets (user_id, reset_date, credits_awarded)
    VALUES (NEW.user_id, CURRENT_DATE, 100);

    -- Create transaction record
    INSERT INTO credits_transactions (user_id, amount, type, reason)
    VALUES (NEW.user_id, 100, 'earned', 'Daily credit reset');
  END IF;

  RETURN NEW;
END;
$$;

-- Update the handle_new_user_credits function to give 100 credits to new users
DROP FUNCTION IF EXISTS public.handle_new_user_credits() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.credits (user_id, amount)
  VALUES (new.id, 100);
  RETURN new;
END;
$$;

-- Recreate the trigger for new user credits
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- Update handle_daily_login to give more credits (base 10 + streak bonus)
DROP FUNCTION IF EXISTS public.handle_daily_login(uuid) CASCADE;

CREATE OR REPLACE FUNCTION public.handle_daily_login(p_user_id uuid)
RETURNS TABLE(credits_awarded integer, new_streak integer, is_streak_broken boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_last_login_date DATE;
  v_last_streak_reward_date DATE;
  v_current_streak INTEGER;
  v_credits_to_award INTEGER;
  v_is_owner BOOLEAN;
  v_owner_email TEXT := 'yassin.kadry@icloud.com';
  v_owner_roblox TEXT := 'jameslovemm2';
BEGIN
  -- Check if user is owner (by email OR Roblox username)
  SELECT EXISTS (
    SELECT 1 FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE au.id = p_user_id 
    AND (au.email = v_owner_email OR LOWER(p.roblox_username) = LOWER(v_owner_roblox))
  ) INTO v_is_owner;

  -- Get current streak and last login
  SELECT last_login_date, last_streak_reward_date, login_streak
  INTO v_last_login_date, v_last_streak_reward_date, v_current_streak
  FROM public.profiles
  WHERE id = p_user_id;

  -- Check if this is a new day
  IF v_last_streak_reward_date = CURRENT_DATE THEN
    RETURN QUERY SELECT 0, v_current_streak, false;
    RETURN;
  END IF;

  -- Calculate new streak
  IF v_last_login_date IS NULL THEN
    v_current_streak := 1;
    is_streak_broken := false;
  ELSIF v_last_login_date = CURRENT_DATE - INTERVAL '1 day' THEN
    v_current_streak := v_current_streak + 1;
    is_streak_broken := false;
  ELSIF v_last_login_date = CURRENT_DATE THEN
    is_streak_broken := false;
  ELSE
    v_current_streak := 1;
    is_streak_broken := true;
  END IF;

  -- Calculate credits (base 10 + streak bonus up to 20)
  v_credits_to_award := 10 + LEAST(v_current_streak - 1, 20);

  -- Award credits
  UPDATE public.credits
  SET amount = amount + v_credits_to_award,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Log transaction
  INSERT INTO public.credits_transactions (user_id, amount, type, reason)
  VALUES (p_user_id, v_credits_to_award, 'earned', 'Daily login streak: Day ' || v_current_streak);

  -- Update profile
  UPDATE public.profiles
  SET login_streak = v_current_streak,
      last_login_date = CURRENT_DATE,
      last_streak_reward_date = CURRENT_DATE,
      total_logins = total_logins + 1,
      updated_at = now()
  WHERE id = p_user_id;

  RETURN QUERY SELECT v_credits_to_award, v_current_streak, is_streak_broken;
END;
$$;

-- Update referral bonus to 100 credits
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
      
      -- Award signup bonus (100 credits to referrer - increased from 50)
      UPDATE credits
      SET amount = amount + 100
      WHERE user_id = v_referrer_id;
      
      INSERT INTO credits_transactions (user_id, amount, type, reason)
      VALUES (v_referrer_id, 100, 'earned', 'Referral signup bonus');
      
      UPDATE referrals
      SET signup_bonus_awarded = TRUE
      WHERE referrer_id = v_referrer_id AND referred_id = new.id;
    END IF;
  END IF;
  
  RETURN new;
END;
$$;

-- Recreate trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update referral task bonus to 50 credits
DROP FUNCTION IF EXISTS public.award_referral_task_bonus() CASCADE;

CREATE OR REPLACE FUNCTION public.award_referral_task_bonus()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
        -- Award task completion bonus (50 credits to referrer - increased from 25)
        UPDATE credits
        SET amount = amount + 50
        WHERE user_id = v_referrer_id;
        
        INSERT INTO credits_transactions (user_id, amount, type, reason)
        VALUES (v_referrer_id, 50, 'earned', 'Referral task completion bonus');
        
        UPDATE referrals
        SET task_bonus_awarded = TRUE
        WHERE referrer_id = v_referrer_id AND referred_id = NEW.user_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger for referral task bonus
DROP TRIGGER IF EXISTS on_task_completed ON public.tasks;
CREATE TRIGGER on_task_completed
  AFTER UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.award_referral_task_bonus();

-- Update default credits in credits table
ALTER TABLE public.credits ALTER COLUMN amount SET DEFAULT 100;