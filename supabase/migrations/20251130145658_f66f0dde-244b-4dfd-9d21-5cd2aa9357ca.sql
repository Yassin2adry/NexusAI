-- Update handle_daily_login to recognize Roblox username owner
CREATE OR REPLACE FUNCTION public.handle_daily_login(p_user_id uuid)
RETURNS TABLE(credits_awarded integer, new_streak integer, is_streak_broken boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
    -- Already rewarded today
    RETURN QUERY SELECT 0, v_current_streak, false;
    RETURN;
  END IF;

  -- Calculate new streak
  IF v_last_login_date IS NULL THEN
    -- First login ever
    v_current_streak := 1;
    is_streak_broken := false;
  ELSIF v_last_login_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day
    v_current_streak := v_current_streak + 1;
    is_streak_broken := false;
  ELSIF v_last_login_date = CURRENT_DATE THEN
    -- Same day (shouldn't happen with the check above)
    is_streak_broken := false;
  ELSE
    -- Streak broken
    v_current_streak := 1;
    is_streak_broken := true;
  END IF;

  -- Calculate credits (base 5 + streak bonus)
  v_credits_to_award := 5 + LEAST(v_current_streak - 1, 10);

  -- Award credits
  UPDATE public.credits
  SET amount = amount + v_credits_to_award,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Update profile
  UPDATE public.profiles
  SET login_streak = v_current_streak,
      last_login_date = CURRENT_DATE,
      last_streak_reward_date = CURRENT_DATE,
      total_logins = total_logins + 1,
      updated_at = now()
  WHERE id = p_user_id;

  -- Return results
  RETURN QUERY SELECT v_credits_to_award, v_current_streak, is_streak_broken;
END;
$function$;