-- Create tasks table to track all AI operations
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  credits_cost INTEGER NOT NULL,
  credits_deducted BOOLEAN NOT NULL DEFAULT false,
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON public.tasks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON public.tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at DESC);

-- Create function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_task_id UUID,
  p_amount INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT amount INTO current_credits
  FROM public.credits
  WHERE user_id = p_user_id;

  -- Check if sufficient credits
  IF current_credits < p_amount THEN
    RETURN false;
  END IF;

  -- Deduct credits
  UPDATE public.credits
  SET amount = amount - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Mark task as credits deducted
  UPDATE public.tasks
  SET credits_deducted = true
  WHERE id = p_task_id;

  RETURN true;
END;
$$;

-- Create function to check if user has enough credits
CREATE OR REPLACE FUNCTION public.has_sufficient_credits(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT amount INTO current_credits
  FROM public.credits
  WHERE user_id = p_user_id;

  RETURN current_credits >= p_amount;
END;
$$;

-- Add trigger to update tasks timestamp
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.update_updated_at_column();