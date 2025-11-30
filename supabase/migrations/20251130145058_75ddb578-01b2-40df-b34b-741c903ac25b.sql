-- Add plugin authentication tokens table
CREATE TABLE public.plugin_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.plugin_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for plugin tokens
CREATE POLICY "Users can view their own tokens"
ON public.plugin_tokens
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tokens"
ON public.plugin_tokens
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens"
ON public.plugin_tokens
FOR DELETE
USING (auth.uid() = user_id);

-- Add index for faster token lookup
CREATE INDEX idx_plugin_tokens_token ON public.plugin_tokens(token);
CREATE INDEX idx_plugin_tokens_user_id ON public.plugin_tokens(user_id);

-- Function to validate plugin token
CREATE OR REPLACE FUNCTION public.validate_plugin_token(p_token TEXT)
RETURNS TABLE(user_id UUID, is_valid BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT pt.user_id, pt.expires_at
  INTO v_user_id, v_expires_at
  FROM public.plugin_tokens pt
  WHERE pt.token = p_token;

  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, false;
    RETURN;
  END IF;

  IF v_expires_at < now() THEN
    -- Token expired
    DELETE FROM public.plugin_tokens WHERE token = p_token;
    RETURN QUERY SELECT NULL::UUID, false;
    RETURN;
  END IF;

  -- Update last used timestamp
  UPDATE public.plugin_tokens
  SET last_used_at = now()
  WHERE token = p_token;

  RETURN QUERY SELECT v_user_id, true;
END;
$$;

-- Improve projects table structure for better organization
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS server_scripts JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS client_scripts JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS replicated_scripts JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS export_url TEXT,
ADD COLUMN IF NOT EXISTS export_status TEXT DEFAULT 'not_started';

-- Create project exports table for tracking
CREATE TABLE public.project_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  format TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  download_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on exports
ALTER TABLE public.project_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exports"
ON public.project_exports
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exports"
ON public.project_exports
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for exports
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_exports;