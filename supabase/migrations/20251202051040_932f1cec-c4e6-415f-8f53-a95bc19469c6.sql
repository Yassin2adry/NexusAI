-- Create daily credit reset system
CREATE TABLE IF NOT EXISTS public.daily_credit_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  credits_awarded INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, reset_date)
);

ALTER TABLE public.daily_credit_resets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resets"
  ON public.daily_credit_resets FOR SELECT
  USING (auth.uid() = user_id);

-- Function to handle daily credit reset
CREATE OR REPLACE FUNCTION public.handle_daily_credit_reset()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    -- Reset credits to 50
    UPDATE credits
    SET amount = 50, updated_at = now()
    WHERE user_id = NEW.user_id;

    -- Log the reset
    INSERT INTO daily_credit_resets (user_id, reset_date, credits_awarded)
    VALUES (NEW.user_id, CURRENT_DATE, 50);

    -- Create transaction record
    INSERT INTO credits_transactions (user_id, amount, type, reason)
    VALUES (NEW.user_id, 50, 'earned', 'Daily credit reset');
  END IF;

  RETURN NEW;
END;
$$;

-- Create collaboration system
CREATE TABLE IF NOT EXISTS public.project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'editor', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collaborators on their projects"
  ON public.project_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_collaborators.project_id
      AND user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Project owners can manage collaborators"
  ON public.project_collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_collaborators.project_id
      AND user_id = auth.uid()
    )
  );

-- Create marketplace uploads table
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('script', 'ui', 'module', 'effects', 'animation')),
  price INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL,
  preview_image TEXT,
  version TEXT NOT NULL DEFAULT '1.0.0',
  downloads INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_ratings INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved marketplace items"
  ON public.marketplace_items FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Users can create marketplace items"
  ON public.marketplace_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON public.marketplace_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Marketplace purchases table
CREATE TABLE IF NOT EXISTS public.marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  credits_spent INTEGER NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON public.marketplace_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Marketplace ratings table
CREATE TABLE IF NOT EXISTS public.marketplace_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.marketplace_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
  ON public.marketplace_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can create ratings"
  ON public.marketplace_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for collaboration
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_collaborators;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_items;