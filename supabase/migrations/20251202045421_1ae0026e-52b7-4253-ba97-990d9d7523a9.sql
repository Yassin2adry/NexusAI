-- Update deduct_credits function to never deduct credits from owner accounts
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id uuid, p_task_id uuid, p_amount integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_credits INTEGER;
  v_task_type TEXT;
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

  -- If owner, skip credit deduction but still mark task as completed
  IF v_is_owner THEN
    UPDATE public.tasks
    SET credits_deducted = true
    WHERE id = p_task_id;
    
    RETURN true;
  END IF;

  -- Get current credits for non-owner users
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