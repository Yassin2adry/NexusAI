-- Add Roblox user ID and avatar URL to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS roblox_user_id text,
ADD COLUMN IF NOT EXISTS roblox_avatar_url text;