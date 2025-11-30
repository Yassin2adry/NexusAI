-- Enable realtime for credits table
ALTER TABLE public.credits REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credits;

-- Enable realtime for tasks table
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;