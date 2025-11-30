import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-plugin-token",
};

const validateToken = async (supabase: any, token: string | null) => {
  if (!token) {
    return { valid: false, userId: null };
  }

  const { data, error } = await supabase.rpc("validate_plugin_token", {
    p_token: token,
  });

  if (error || !data || data.length === 0 || !data[0].is_valid) {
    return { valid: false, userId: null };
  }

  return { valid: true, userId: data[0].user_id };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const pluginToken = req.headers.get("x-plugin-token");

  try {
    // Validate token
    const { valid, userId } = await validateToken(supabase, pluginToken);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const path = new URL(req.url).pathname;

    // Check credits
    if (path.includes("/check") && req.method === "GET") {
      const { data: credits, error } = await supabase
        .from("credits")
        .select("amount")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ credits: credits?.amount || 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if sufficient credits
    if (path.includes("/check-sufficient") && req.method === "POST") {
      const { amount } = await req.json();

      const { data, error } = await supabase.rpc("has_sufficient_credits", {
        p_user_id: userId,
        p_amount: amount,
      });

      if (error) throw error;

      return new Response(
        JSON.stringify({ sufficient: data }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deduct credits (with task tracking)
    if (path.includes("/deduct") && req.method === "POST") {
      const { amount, taskType, taskData } = await req.json();

      // Check if user is owner (unlimited credits)
      const { data: profile } = await supabase
        .from("profiles")
        .select("roblox_username")
        .eq("id", userId)
        .single();

      const { data: userAuth } = await supabase.auth.admin.getUserById(userId);
      const isOwner = userAuth?.user?.email === 'yassin.kadry@icloud.com' || 
                      profile?.roblox_username?.toLowerCase() === 'jameslovemm2';

      // Create task
      const { data: task, error: taskError } = await supabase
        .from("tasks")
        .insert({
          user_id: userId,
          type: taskType,
          credits_cost: isOwner ? 0 : amount,
          status: "processing",
          input_data: taskData,
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // If owner, skip credit deduction
      if (isOwner) {
        await supabase
          .from("tasks")
          .update({ status: "completed", credits_deducted: true })
          .eq("id", task.id);

        return new Response(
          JSON.stringify({ success: true, taskId: task.id, creditsUsed: 0, owner: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Deduct credits for non-owners
      const { data: success, error: deductError } = await supabase.rpc("deduct_credits", {
        p_user_id: userId,
        p_task_id: task.id,
        p_amount: amount,
      });

      if (deductError || !success) {
        await supabase
          .from("tasks")
          .update({ status: "failed", error_message: "Insufficient credits" })
          .eq("id", task.id);

        return new Response(
          JSON.stringify({ error: "Insufficient credits", taskId: task.id }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, taskId: task.id, creditsUsed: amount }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in plugin-credits:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
