-- Add login streak tracking to profiles
ALTER TABLE public.profiles
ADD COLUMN login_streak INTEGER DEFAULT 0,
ADD COLUMN last_login_date DATE,
ADD COLUMN last_streak_reward_date DATE,
ADD COLUMN total_logins INTEGER DEFAULT 0;

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  credit_reward INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements junction table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Achievements are viewable by everyone
CREATE POLICY "Achievements are viewable by everyone"
ON public.achievements
FOR SELECT
USING (true);

-- Users can view their own earned achievements
CREATE POLICY "Users can view their own achievements"
ON public.user_achievements
FOR SELECT
USING (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, credit_reward, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first chat session', 'MessageSquare', 10, 'chat_messages', 1),
('Conversationalist', 'Send 10 chat messages', 'MessageCircle', 25, 'chat_messages', 10),
('Chat Master', 'Send 50 chat messages', 'MessagesSquare', 100, 'chat_messages', 50),
('Project Pioneer', 'Create your first project', 'FolderPlus', 50, 'projects', 1),
('Project Creator', 'Create 5 projects', 'Folder', 100, 'projects', 5),
('Streak Starter', 'Login for 3 consecutive days', 'Flame', 30, 'login_streak', 3),
('Streak Warrior', 'Login for 7 consecutive days', 'Zap', 75, 'login_streak', 7),
('Streak Legend', 'Login for 30 consecutive days', 'Award', 300, 'login_streak', 30),
('Early Adopter', 'Be one of the first 100 users', 'Star', 500, 'total_logins', 1),
('Task Completionist', 'Complete 25 tasks successfully', 'CheckCircle', 150, 'tasks_completed', 25);

-- Create function to handle daily login bonus
CREATE OR REPLACE FUNCTION public.handle_daily_login(p_user_id UUID)
RETURNS TABLE(
  credits_awarded INTEGER,
  new_streak INTEGER,
  is_streak_broken BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_last_login_date DATE;
  v_last_streak_reward_date DATE;
  v_current_streak INTEGER;
  v_credits_to_award INTEGER;
  v_is_owner BOOLEAN;
  v_owner_email TEXT := 'yassin.kadry@icloud.com';
BEGIN
  -- Check if user is owner
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE id = p_user_id AND email = v_owner_email
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
$$;

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION public.check_achievements(p_user_id UUID)
RETURNS SETOF public.achievements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_achievement RECORD;
  v_current_value INTEGER;
  v_already_earned BOOLEAN;
BEGIN
  FOR v_achievement IN SELECT * FROM public.achievements LOOP
    -- Check if already earned
    SELECT EXISTS (
      SELECT 1 FROM public.user_achievements 
      WHERE user_id = p_user_id AND achievement_id = v_achievement.id
    ) INTO v_already_earned;

    IF v_already_earned THEN
      CONTINUE;
    END IF;

    -- Check requirement based on type
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

    -- Award achievement if requirement met
    IF v_current_value >= v_achievement.requirement_value THEN
      INSERT INTO public.user_achievements (user_id, achievement_id)
      VALUES (p_user_id, v_achievement.id);
      
      -- Award credits
      IF v_achievement.credit_reward > 0 THEN
        UPDATE public.credits
        SET amount = amount + v_achievement.credit_reward,
            updated_at = now()
        WHERE user_id = p_user_id;
      END IF;
      
      RETURN NEXT v_achievement;
    END IF;
  END LOOP;
END;
$$;