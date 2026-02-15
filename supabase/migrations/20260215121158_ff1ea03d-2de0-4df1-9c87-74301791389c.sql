
-- ============================================
-- CONNECTIONS: Friendships & Direct Messages
-- ============================================

CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL,
  addressee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (requester_id, addressee_id)
);
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their friendships" ON public.friendships FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can create friend requests" ON public.friendships FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update their friendships" ON public.friendships FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can delete their friendships" ON public.friendships FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE TABLE public.dm_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user1_id, user2_id)
);
ALTER TABLE public.dm_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their DMs" ON public.dm_conversations FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create DMs" ON public.dm_conversations FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE TABLE public.dm_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.dm_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  edited BOOLEAN NOT NULL DEFAULT false,
  deleted BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View DM messages" ON public.dm_messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.dm_conversations dc WHERE dc.id = dm_messages.conversation_id AND (dc.user1_id = auth.uid() OR dc.user2_id = auth.uid())));
CREATE POLICY "Send DM messages" ON public.dm_messages FOR INSERT WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.dm_conversations dc WHERE dc.id = conversation_id AND (dc.user1_id = auth.uid() OR dc.user2_id = auth.uid())));
CREATE POLICY "Edit own DMs" ON public.dm_messages FOR UPDATE USING (auth.uid() = sender_id);

CREATE TABLE public.linked_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  provider_user_id TEXT,
  provider_username TEXT,
  provider_avatar_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);
ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View linked accounts" ON public.linked_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Link accounts" ON public.linked_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update linked accounts" ON public.linked_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Unlink accounts" ON public.linked_accounts FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- CHANNELS within Rooms
-- ============================================

CREATE TABLE public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'voice', 'stage', 'announcement')),
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View channels" ON public.channels FOR SELECT USING (EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = channels.room_id AND (r.is_public = true OR r.created_by = auth.uid() OR EXISTS (SELECT 1 FROM public.room_members rm WHERE rm.room_id = r.id AND rm.user_id = auth.uid()))));
CREATE POLICY "Manage channels" ON public.channels FOR ALL USING (EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = channels.room_id AND r.created_by = auth.uid()));

CREATE TABLE public.channel_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  thread_id UUID,
  pinned BOOLEAN NOT NULL DEFAULT false,
  edited BOOLEAN NOT NULL DEFAULT false,
  deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.channel_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View channel messages" ON public.channel_messages FOR SELECT USING (true);
CREATE POLICY "Send channel messages" ON public.channel_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Edit own messages" ON public.channel_messages FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.channel_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View reactions" ON public.message_reactions FOR SELECT USING (true);
CREATE POLICY "Add reactions" ON public.message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Remove reactions" ON public.message_reactions FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.room_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  max_uses INTEGER,
  uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  role_on_join TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.room_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View invites" ON public.room_invites FOR SELECT USING (true);
CREATE POLICY "Create invites" ON public.room_invites FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = room_id AND r.created_by = auth.uid()));
CREATE POLICY "Delete invites" ON public.room_invites FOR DELETE USING (EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = room_id AND r.created_by = auth.uid()));

CREATE TABLE public.room_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#8b5cf6',
  position INTEGER NOT NULL DEFAULT 0,
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.room_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View roles" ON public.room_roles FOR SELECT USING (true);
CREATE POLICY "Manage roles" ON public.room_roles FOR ALL USING (EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = room_id AND r.created_by = auth.uid()));

CREATE TABLE public.room_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.room_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners view audit" ON public.room_audit_log FOR SELECT USING (EXISTS (SELECT 1 FROM public.rooms r WHERE r.id = room_id AND r.created_by = auth.uid()));
CREATE POLICY "Insert audit" ON public.room_audit_log FOR INSERT WITH CHECK (auth.uid() = actor_id);

-- ============================================
-- LEARN
-- ============================================

CREATE TABLE public.learn_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'scripting',
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours NUMERIC(4,1) DEFAULT 1.0,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  lesson_count INTEGER NOT NULL DEFAULT 0,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.learn_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View published courses" ON public.learn_courses FOR SELECT USING (published = true);

CREATE TABLE public.learn_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.learn_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  lesson_type TEXT NOT NULL DEFAULT 'article' CHECK (lesson_type IN ('article', 'video', 'quiz', 'lab', 'interactive')),
  position INTEGER NOT NULL DEFAULT 0,
  video_url TEXT,
  quiz_data JSONB,
  estimated_minutes INTEGER DEFAULT 10,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.learn_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View published lessons" ON public.learn_lessons FOR SELECT USING (published = true);

CREATE TABLE public.learn_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.learn_courses(id) ON DELETE CASCADE,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
ALTER TABLE public.learn_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage enrollments" ON public.learn_enrollments FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.learn_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.learn_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  quiz_score INTEGER,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
ALTER TABLE public.learn_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manage lesson progress" ON public.learn_lesson_progress FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'marketplace' CHECK (item_type IN ('marketplace', 'project', 'template', 'creator')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  pros TEXT[],
  cons TEXT[],
  tags TEXT[],
  media_urls TEXT[],
  roblox_verified BOOLEAN NOT NULL DEFAULT false,
  roblox_username TEXT,
  roblox_avatar_url TEXT,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false,
  moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  version_reviewed TEXT,
  credits_cost INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View approved reviews" ON public.reviews FOR SELECT USING (moderation_status = 'approved' OR user_id = auth.uid());
CREATE POLICY "Create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type TEXT NOT NULL DEFAULT 'helpful' CHECK (vote_type IN ('helpful', 'unhelpful')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (review_id, user_id)
);
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View votes" ON public.review_votes FOR SELECT USING (true);
CREATE POLICY "Cast votes" ON public.review_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Remove votes" ON public.review_votes FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.review_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View responses" ON public.review_responses FOR SELECT USING (true);
CREATE POLICY "Create responses" ON public.review_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Edit responses" ON public.review_responses FOR UPDATE USING (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.dm_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channel_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;

-- Indexes
CREATE INDEX idx_friendships_requester ON public.friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON public.friendships(addressee_id);
CREATE INDEX idx_dm_messages_conv ON public.dm_messages(conversation_id, created_at);
CREATE INDEX idx_channel_messages_ch ON public.channel_messages(channel_id, created_at);
CREATE INDEX idx_reviews_item ON public.reviews(item_id, item_type);
CREATE INDEX idx_learn_lessons_course ON public.learn_lessons(course_id, position);

-- Seed courses
INSERT INTO public.learn_courses (title, description, category, difficulty, estimated_hours, tags, lesson_count, published) VALUES
('Roblox Scripting Fundamentals', 'Master Luau scripting basics.', 'scripting', 'beginner', 4.0, ARRAY['luau','basics'], 8, true),
('Advanced Game Mechanics', 'Build complex game systems.', 'scripting', 'advanced', 8.0, ARRAY['systems','combat'], 12, true),
('UI/UX Design for Roblox', 'Create beautiful interfaces.', 'design', 'intermediate', 3.0, ARRAY['ui','design'], 6, true),
('AI-Powered Development', 'Use NexusAI tools effectively.', 'ai', 'beginner', 2.0, ARRAY['ai','nexusai'], 5, true),
('Multiplayer & Networking', 'Build multiplayer systems.', 'scripting', 'advanced', 6.0, ARRAY['multiplayer'], 10, true),
('Building Obby Games', 'Create obstacle course games.', 'gamedev', 'beginner', 3.0, ARRAY['obby'], 7, true);
