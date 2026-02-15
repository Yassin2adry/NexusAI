export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          credit_reward: number
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          created_at?: string
          credit_reward?: number
          description: string
          icon: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          created_at?: string
          credit_reward?: number
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      channel_messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          deleted: boolean
          edited: boolean
          id: string
          pinned: boolean
          thread_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          deleted?: boolean
          edited?: boolean
          id?: string
          pinned?: boolean
          thread_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          deleted?: boolean
          edited?: boolean
          id?: string
          pinned?: boolean
          thread_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          position: number
          room_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          position?: number
          room_id: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          position?: number
          room_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_session_id: string
          content: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          chat_session_id: string
          content: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          chat_session_id?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_session_id_fkey"
            columns: ["chat_session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credits: {
        Row: {
          amount: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credits_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          task_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          task_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          task_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_transactions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_credit_resets: {
        Row: {
          created_at: string | null
          credits_awarded: number
          id: string
          reset_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits_awarded?: number
          id?: string
          reset_date?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_awarded?: number
          id?: string
          reset_date?: string
          user_id?: string
        }
        Relationships: []
      }
      dm_conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      dm_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          deleted: boolean
          edited: boolean
          id: string
          read_at: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          deleted?: boolean
          edited?: boolean
          id?: string
          read_at?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          deleted?: boolean
          edited?: boolean
          id?: string
          read_at?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "dm_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      learn_courses: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty: string
          enrolled_count: number
          estimated_hours: number | null
          id: string
          lesson_count: number
          published: boolean
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          difficulty?: string
          enrolled_count?: number
          estimated_hours?: number | null
          id?: string
          lesson_count?: number
          published?: boolean
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          enrolled_count?: number
          estimated_hours?: number | null
          id?: string
          lesson_count?: number
          published?: boolean
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      learn_enrollments: {
        Row: {
          completed: boolean
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress_percent: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress_percent?: number
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress_percent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learn_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          notes: string | null
          quiz_score: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          notes?: string | null
          quiz_score?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          notes?: string | null
          quiz_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learn_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_lessons: {
        Row: {
          content: string
          course_id: string
          created_at: string
          estimated_minutes: number | null
          id: string
          lesson_type: string
          position: number
          published: boolean
          quiz_data: Json | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string
          estimated_minutes?: number | null
          id?: string
          lesson_type?: string
          position?: number
          published?: boolean
          quiz_data?: Json | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string
          estimated_minutes?: number | null
          id?: string
          lesson_type?: string
          position?: number
          published?: boolean
          quiz_data?: Json | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learn_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "learn_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      linked_accounts: {
        Row: {
          id: string
          linked_at: string
          provider: string
          provider_avatar_url: string | null
          provider_user_id: string | null
          provider_username: string | null
          user_id: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          id?: string
          linked_at?: string
          provider: string
          provider_avatar_url?: string | null
          provider_user_id?: string | null
          provider_username?: string | null
          user_id: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          id?: string
          linked_at?: string
          provider?: string
          provider_avatar_url?: string | null
          provider_user_id?: string | null
          provider_username?: string | null
          user_id?: string
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          content: Json
          created_at: string | null
          description: string
          downloads: number
          id: string
          name: string
          preview_image: string | null
          price: number
          rating: number | null
          status: string
          total_ratings: number | null
          type: string
          updated_at: string | null
          user_id: string
          version: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          description: string
          downloads?: number
          id?: string
          name: string
          preview_image?: string | null
          price?: number
          rating?: number | null
          status?: string
          total_ratings?: number | null
          type: string
          updated_at?: string | null
          user_id: string
          version?: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string
          downloads?: number
          id?: string
          name?: string
          preview_image?: string | null
          price?: number
          rating?: number | null
          status?: string
          total_ratings?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      marketplace_purchases: {
        Row: {
          credits_spent: number
          id: string
          item_id: string
          purchased_at: string | null
          user_id: string
        }
        Insert: {
          credits_spent: number
          id?: string
          item_id: string
          purchased_at?: string | null
          user_id: string
        }
        Update: {
          credits_spent?: number
          id?: string
          item_id?: string
          purchased_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_ratings: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          rating: number
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          rating: number
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          rating?: number
          review?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_ratings_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "channel_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      plugin_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          last_used_at: string | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          last_used_at?: string | null
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          last_used_at?: string | null
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          last_login_date: string | null
          last_streak_reward_date: string | null
          login_streak: number | null
          referral_code: string | null
          referred_by: string | null
          roblox_avatar_url: string | null
          roblox_user_id: string | null
          roblox_username: string | null
          total_logins: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          last_login_date?: string | null
          last_streak_reward_date?: string | null
          login_streak?: number | null
          referral_code?: string | null
          referred_by?: string | null
          roblox_avatar_url?: string | null
          roblox_user_id?: string | null
          roblox_username?: string | null
          total_logins?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          last_login_date?: string | null
          last_streak_reward_date?: string | null
          login_streak?: number | null
          referral_code?: string | null
          referred_by?: string | null
          roblox_avatar_url?: string | null
          roblox_user_id?: string | null
          roblox_username?: string | null
          total_logins?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      project_collaborators: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string | null
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          project_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_exports: {
        Row: {
          completed_at: string | null
          created_at: string
          download_url: string | null
          error_message: string | null
          format: string
          id: string
          project_id: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          download_url?: string | null
          error_message?: string | null
          format: string
          id?: string
          project_id: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          download_url?: string | null
          error_message?: string | null
          format?: string
          id?: string
          project_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_exports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assets: string | null
          client_scripts: Json | null
          created_at: string
          design_document: string | null
          export_status: string | null
          export_url: string | null
          id: string
          modules: Json | null
          name: string
          prompt: string
          replicated_scripts: Json | null
          scripts: string | null
          server_scripts: Json | null
          status: string
          type: string | null
          ui_components: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assets?: string | null
          client_scripts?: Json | null
          created_at?: string
          design_document?: string | null
          export_status?: string | null
          export_url?: string | null
          id?: string
          modules?: Json | null
          name: string
          prompt: string
          replicated_scripts?: Json | null
          scripts?: string | null
          server_scripts?: Json | null
          status?: string
          type?: string | null
          ui_components?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assets?: string | null
          client_scripts?: Json | null
          created_at?: string
          design_document?: string | null
          export_status?: string | null
          export_url?: string | null
          id?: string
          modules?: Json | null
          name?: string
          prompt?: string
          replicated_scripts?: Json | null
          scripts?: string | null
          server_scripts?: Json | null
          status?: string
          type?: string | null
          ui_components?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          credits_awarded: boolean | null
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          signup_bonus_awarded: boolean | null
          task_bonus_awarded: boolean | null
        }
        Insert: {
          created_at?: string | null
          credits_awarded?: boolean | null
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          signup_bonus_awarded?: boolean | null
          task_bonus_awarded?: boolean | null
        }
        Update: {
          created_at?: string | null
          credits_awarded?: boolean | null
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          signup_bonus_awarded?: boolean | null
          task_bonus_awarded?: boolean | null
        }
        Relationships: []
      }
      review_responses: {
        Row: {
          content: string
          created_at: string
          id: string
          review_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          review_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          review_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_votes: {
        Row: {
          created_at: string
          id: string
          review_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          user_id: string
          vote_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string
          cons: string[] | null
          created_at: string
          credits_cost: number
          helpful_count: number
          id: string
          item_id: string
          item_type: string
          media_urls: string[] | null
          moderation_status: string
          pros: string[] | null
          rating: number
          reported: boolean
          roblox_avatar_url: string | null
          roblox_username: string | null
          roblox_verified: boolean
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          version_reviewed: string | null
        }
        Insert: {
          body: string
          cons?: string[] | null
          created_at?: string
          credits_cost?: number
          helpful_count?: number
          id?: string
          item_id: string
          item_type?: string
          media_urls?: string[] | null
          moderation_status?: string
          pros?: string[] | null
          rating: number
          reported?: boolean
          roblox_avatar_url?: string | null
          roblox_username?: string | null
          roblox_verified?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          version_reviewed?: string | null
        }
        Update: {
          body?: string
          cons?: string[] | null
          created_at?: string
          credits_cost?: number
          helpful_count?: number
          id?: string
          item_id?: string
          item_type?: string
          media_urls?: string[] | null
          moderation_status?: string
          pros?: string[] | null
          rating?: number
          reported?: boolean
          roblox_avatar_url?: string | null
          roblox_username?: string | null
          roblox_verified?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          version_reviewed?: string | null
        }
        Relationships: []
      }
      room_audit_log: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          details: Json | null
          id: string
          room_id: string
          target_id: string | null
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          details?: Json | null
          id?: string
          room_id: string
          target_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          room_id?: string
          target_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_audit_log_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_invites: {
        Row: {
          code: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          max_uses: number | null
          role_on_join: string
          room_id: string
          uses: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          role_on_join?: string
          room_id: string
          uses?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          role_on_join?: string
          room_id?: string
          uses?: number
        }
        Relationships: [
          {
            foreignKeyName: "room_invites_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_members: {
        Row: {
          id: string
          is_banned: boolean
          is_muted: boolean
          joined_at: string
          role: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_banned?: boolean
          is_muted?: boolean
          joined_at?: string
          role?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_banned?: boolean
          is_muted?: boolean
          joined_at?: string
          role?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          room_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type?: string
          room_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_roles: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          permissions: Json
          position: number
          room_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          permissions?: Json
          position?: number
          room_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          permissions?: Json
          position?: number
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_roles_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean
          max_participants: number
          name: string
          project_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean
          max_participants?: number
          name: string
          project_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean
          max_participants?: number
          name?: string
          project_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          credits_cost: number
          credits_deducted: boolean
          error_message: string | null
          id: string
          input_data: Json | null
          output_data: Json | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          credits_cost: number
          credits_deducted?: boolean
          error_message?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          credits_cost?: number
          credits_deducted?: boolean
          error_message?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence: {
        Row: {
          current_room_id: string | null
          id: string
          last_seen: string
          status: string
          user_id: string
        }
        Insert: {
          current_room_id?: string | null
          id?: string
          last_seen?: string
          status?: string
          user_id: string
        }
        Update: {
          current_room_id?: string | null
          id?: string
          last_seen?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_current_room_id_fkey"
            columns: ["current_room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          progress_percent: number
          started_at: string | null
          tutorial_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          progress_percent?: number
          started_at?: string | null
          tutorial_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          progress_percent?: number
          started_at?: string | null
          tutorial_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_achievements: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string
          credit_reward: number
          description: string
          icon: string
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }[]
        SetofOptions: {
          from: "*"
          to: "achievements"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      deduct_credits: {
        Args: { p_amount: number; p_task_id: string; p_user_id: string }
        Returns: boolean
      }
      generate_referral_code: { Args: { user_id: string }; Returns: string }
      handle_daily_login: {
        Args: { p_user_id: string }
        Returns: {
          credits_awarded: number
          is_streak_broken: boolean
          new_streak: number
        }[]
      }
      has_sufficient_credits: {
        Args: { p_amount: number; p_user_id: string }
        Returns: boolean
      }
      validate_plugin_token: {
        Args: { p_token: string }
        Returns: {
          is_valid: boolean
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
