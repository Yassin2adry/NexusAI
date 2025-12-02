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
