-- Create credits_transactions table to track all credit movements
CREATE TABLE IF NOT EXISTS public.credits_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'awarded', 'refunded')),
  reason TEXT NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own transactions
CREATE POLICY "Users can view their own credit transactions"
ON public.credits_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_credits_transactions_user_id ON public.credits_transactions(user_id);
CREATE INDEX idx_credits_transactions_created_at ON public.credits_transactions(created_at DESC);

-- Update deduct_credits function to log transactions
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id uuid, p_task_id uuid, p_amount integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  current_credits INTEGER;
  v_task_type TEXT;
BEGIN
  -- Get current credits
  SELECT amount INTO current_credits
  FROM public.credits
  WHERE user_id = p_user_id;

  -- Check if sufficient credits
  IF current_credits < p_amount THEN
    RETURN false;
  END IF;

  -- Get task type for transaction reason
  SELECT type INTO v_task_type
  FROM public.tasks
  WHERE id = p_task_id;

  -- Deduct credits
  UPDATE public.credits
  SET amount = amount - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Mark task as credits deducted
  UPDATE public.tasks
  SET credits_deducted = true
  WHERE id = p_task_id;

  -- Log transaction
  INSERT INTO public.credits_transactions (user_id, amount, type, reason, task_id)
  VALUES (p_user_id, -p_amount, 'spent', 'Task: ' || v_task_type, p_task_id);

  RETURN true;
END;
$function$;

-- Update handle_daily_login to log transactions
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

  -- Calculate credits (base 5 + streak bonus)
  v_credits_to_award := 5 + LEAST(v_current_streak - 1, 10);

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
$function$;

-- Update check_achievements function to log credit awards
CREATE OR REPLACE FUNCTION public.check_achievements(p_user_id uuid)
RETURNS SETOF achievements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_achievement RECORD;
  v_current_value INTEGER;
  v_already_earned BOOLEAN;
BEGIN
  FOR v_achievement IN SELECT * FROM public.achievements LOOP
    SELECT EXISTS (
      SELECT 1 FROM public.user_achievements 
      WHERE user_id = p_user_id AND achievement_id = v_achievement.id
    ) INTO v_already_earned;

    IF v_already_earned THEN
      CONTINUE;
    END IF;

    CASE v_achievement.requirement_type
      WHEN 'chat_messages' THEN
        SELECT COUNT(*) INTO v_current_value
        FROM public.chat_messages cm
        JOIN public.chat_sessions cs ON cm.chat_session_id = cs.id
        WHERE cs.user_id = p_user_id AND cm.role = 'user';
        
      WHEN 'projects' THEN
        SELECT COUNT(*) INTO v_current_value
        FROM public.projects
        WHERE user_id = p_user_id;
        
      WHEN 'login_streak' THEN
        SELECT login_streak INTO v_current_value
        FROM public.profiles
        WHERE id = p_user_id;
        
      WHEN 'tasks_completed' THEN
        SELECT COUNT(*) INTO v_current_value
        FROM public.tasks
        WHERE user_id = p_user_id AND status = 'completed';
        
      WHEN 'total_logins' THEN
        SELECT total_logins INTO v_current_value
        FROM public.profiles
        WHERE id = p_user_id;
        
      ELSE
        CONTINUE;
    END CASE;

    IF v_current_value >= v_achievement.requirement_value THEN
      INSERT INTO public.user_achievements (user_id, achievement_id)
      VALUES (p_user_id, v_achievement.id);
      
      IF v_achievement.credit_reward > 0 THEN
        UPDATE public.credits
        SET amount = amount + v_achievement.credit_reward,
            updated_at = now()
        WHERE user_id = p_user_id;
        
        -- Log transaction
        INSERT INTO public.credits_transactions (user_id, amount, type, reason)
        VALUES (p_user_id, v_achievement.credit_reward, 'awarded', 'Achievement: ' || v_achievement.name);
      END IF;
      
      RETURN NEXT v_achievement;
    END IF;
  END LOOP;
END;
$function$;