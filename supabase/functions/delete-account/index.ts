import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client for deletion
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { password } = await req.json();

    if (!password) {
      return new Response(
        JSON.stringify({ error: "Password is required to confirm deletion" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify password by attempting sign in
    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: user.email!,
      password: password,
    });

    if (signInError) {
      console.log("Password verification failed:", signInError.message);
      return new Response(
        JSON.stringify({ error: "Incorrect password" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Starting account deletion for user: ${user.id}`);

    // Delete all user data in correct order (respecting foreign keys)
    const userId = user.id;

    // Delete room messages first (user's messages)
    await supabaseAdmin.from("room_messages").delete().eq("user_id", userId);
    console.log("Deleted room_messages");

    // Delete room memberships
    await supabaseAdmin.from("room_members").delete().eq("user_id", userId);
    console.log("Deleted room_members");

    // Delete rooms created by user
    await supabaseAdmin.from("rooms").delete().eq("created_by", userId);
    console.log("Deleted rooms");

    // Delete user presence
    await supabaseAdmin.from("user_presence").delete().eq("user_id", userId);
    console.log("Deleted user_presence");

    // Delete notifications
    await supabaseAdmin.from("notifications").delete().eq("user_id", userId);
    console.log("Deleted notifications");

    // Delete activity log
    await supabaseAdmin.from("activity_log").delete().eq("user_id", userId);
    console.log("Deleted activity_log");

    // Delete user progress
    await supabaseAdmin.from("user_progress").delete().eq("user_id", userId);
    console.log("Deleted user_progress");

    // Delete chat messages (via sessions)
    const { data: sessions } = await supabaseAdmin
      .from("chat_sessions")
      .select("id")
      .eq("user_id", userId);
    
    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map(s => s.id);
      await supabaseAdmin.from("chat_messages").delete().in("chat_session_id", sessionIds);
    }
    console.log("Deleted chat_messages");

    // Delete chat sessions
    await supabaseAdmin.from("chat_sessions").delete().eq("user_id", userId);
    console.log("Deleted chat_sessions");

    // Delete project exports
    await supabaseAdmin.from("project_exports").delete().eq("user_id", userId);
    console.log("Deleted project_exports");

    // Delete project collaborators
    await supabaseAdmin.from("project_collaborators").delete().eq("user_id", userId);
    console.log("Deleted project_collaborators");

    // Delete projects
    await supabaseAdmin.from("projects").delete().eq("user_id", userId);
    console.log("Deleted projects");

    // Delete marketplace ratings
    await supabaseAdmin.from("marketplace_ratings").delete().eq("user_id", userId);
    console.log("Deleted marketplace_ratings");

    // Delete marketplace purchases
    await supabaseAdmin.from("marketplace_purchases").delete().eq("user_id", userId);
    console.log("Deleted marketplace_purchases");

    // Delete marketplace items
    await supabaseAdmin.from("marketplace_items").delete().eq("user_id", userId);
    console.log("Deleted marketplace_items");

    // Delete referrals (both as referrer and referred)
    await supabaseAdmin.from("referrals").delete().eq("referrer_id", userId);
    await supabaseAdmin.from("referrals").delete().eq("referred_id", userId);
    console.log("Deleted referrals");

    // Delete user achievements
    await supabaseAdmin.from("user_achievements").delete().eq("user_id", userId);
    console.log("Deleted user_achievements");

    // Delete tasks (also handles credits_transactions FK)
    const { data: tasks } = await supabaseAdmin
      .from("tasks")
      .select("id")
      .eq("user_id", userId);
    
    if (tasks && tasks.length > 0) {
      const taskIds = tasks.map(t => t.id);
      await supabaseAdmin.from("credits_transactions").delete().in("task_id", taskIds);
    }
    console.log("Deleted credits_transactions with task_id");

    // Delete remaining credits transactions
    await supabaseAdmin.from("credits_transactions").delete().eq("user_id", userId);
    console.log("Deleted credits_transactions");

    // Delete tasks
    await supabaseAdmin.from("tasks").delete().eq("user_id", userId);
    console.log("Deleted tasks");

    // Delete daily credit resets
    await supabaseAdmin.from("daily_credit_resets").delete().eq("user_id", userId);
    console.log("Deleted daily_credit_resets");

    // Delete credits
    await supabaseAdmin.from("credits").delete().eq("user_id", userId);
    console.log("Deleted credits");

    // Delete plugin tokens
    await supabaseAdmin.from("plugin_tokens").delete().eq("user_id", userId);
    console.log("Deleted plugin_tokens");

    // Delete profile
    await supabaseAdmin.from("profiles").delete().eq("id", userId);
    console.log("Deleted profile");

    // Finally, delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete user account" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Successfully deleted user: ${userId}`);

    return new Response(
      JSON.stringify({ success: true, message: "Account permanently deleted" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in delete-account:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
