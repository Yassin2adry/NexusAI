-- Create user_progress table for learning tracking
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tutorial_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, tutorial_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Create rooms table for Work Together
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  max_participants INTEGER NOT NULL DEFAULT 10,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create room_members table first without FK constraint to rooms SELECT policy
CREATE TABLE public.room_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_muted BOOLEAN NOT NULL DEFAULT false,
  is_banned BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(room_id, user_id)
);

ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;

-- Now create rooms policies that can reference room_members
CREATE POLICY "View public rooms or member rooms" ON public.rooms
  FOR SELECT USING (
    is_public = true 
    OR created_by = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.room_members rm WHERE rm.room_id = rooms.id AND rm.user_id = auth.uid())
  );

CREATE POLICY "Users can create rooms" ON public.rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update" ON public.rooms
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Room creators can delete" ON public.rooms
  FOR DELETE USING (auth.uid() = created_by);

-- Room members policies
CREATE POLICY "View room members" ON public.room_members
  FOR SELECT USING (true);

CREATE POLICY "Users can join rooms" ON public.room_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Manage room members" ON public.room_members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = room_members.room_id AND r.created_by = auth.uid())
    OR user_id = auth.uid()
  );

CREATE POLICY "Leave or kick from rooms" ON public.room_members
  FOR DELETE USING (
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = room_members.room_id AND r.created_by = auth.uid())
  );

-- Create room_messages table
CREATE TABLE public.room_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View room messages" ON public.room_messages
  FOR SELECT USING (true);

CREATE POLICY "Send room messages" ON public.room_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Create activity_log table
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their activity" ON public.activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- Create user_presence table
CREATE TABLE public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'offline',
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL
);

ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view presence" ON public.user_presence
  FOR SELECT USING (true);

CREATE POLICY "Users manage their presence" ON public.user_presence
  FOR ALL USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create indexes
CREATE INDEX idx_room_messages_room_id ON public.room_messages(room_id);
CREATE INDEX idx_room_members_room_id ON public.room_members(room_id);
CREATE INDEX idx_room_members_user_id ON public.room_members(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);