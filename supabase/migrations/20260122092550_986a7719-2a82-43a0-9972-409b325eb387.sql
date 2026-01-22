-- Delete all user-related data (preserving table structures)
-- Order matters due to foreign key constraints

-- Delete marketplace data
DELETE FROM public.marketplace_ratings;
DELETE FROM public.marketplace_purchases;
DELETE FROM public.marketplace_items;

-- Delete project data
DELETE FROM public.project_exports;
DELETE FROM public.project_collaborators;
DELETE FROM public.projects;

-- Delete chat data
DELETE FROM public.chat_messages;
DELETE FROM public.chat_sessions;

-- Delete task and credit data
DELETE FROM public.credits_transactions;
DELETE FROM public.tasks;
DELETE FROM public.credits;
DELETE FROM public.daily_credit_resets;

-- Delete achievement data
DELETE FROM public.user_achievements;

-- Delete referral data
DELETE FROM public.referrals;

-- Delete plugin tokens
DELETE FROM public.plugin_tokens;

-- Delete profiles (this will cascade to auth.users due to trigger)
DELETE FROM public.profiles;

-- Note: auth.users cannot be deleted directly via SQL, 
-- but profiles are now cleared and new users will start fresh