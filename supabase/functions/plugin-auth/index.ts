import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-plugin-token",
};

interface LoginRequest {
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const path = new URL(req.url).pathname;

    // Login endpoint
    if (path.includes("/login") && req.method === "POST") {
      const { email, password }: LoginRequest = await req.json();

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if Roblox account is linked
      const { data: profile } = await supabase
        .from("profiles")
        .select("roblox_username")
        .eq("id", authData.user.id)
        .single();

      if (!profile?.roblox_username) {
        return new Response(
          JSON.stringify({ error: "Roblox account not linked. Please link your account on the website." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate plugin token (valid for 30 days)
      const token = crypto.randomUUID() + "-" + crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const { error: tokenError } = await supabase
        .from("plugin_tokens")
        .insert({
          user_id: authData.user.id,
          token,
          expires_at: expiresAt.toISOString(),
        });

      if (tokenError) throw tokenError;

      return new Response(
        JSON.stringify({
          success: true,
          token,
          user: {
            id: authData.user.id,
            email: authData.user.email,
            roblox_username: profile.roblox_username,
          },
          expires_at: expiresAt.toISOString(),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify session endpoint
    if (path.includes("/verify") && req.method === "POST") {
      const pluginToken = req.headers.get("x-plugin-token");

      if (!pluginToken) {
        return new Response(
          JSON.stringify({ error: "No token provided" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase.rpc("validate_plugin_token", {
        p_token: pluginToken,
      });

      if (error || !data || data.length === 0 || !data[0].is_valid) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired token" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const userId = data[0].user_id;

      // Get user details
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, roblox_username, roblox_avatar_url")
        .eq("id", userId)
        .single();

      // Get credits
      const { data: credits } = await supabase
        .from("credits")
        .select("amount")
        .eq("user_id", userId)
        .single();

      return new Response(
        JSON.stringify({
          valid: true,
          user: {
            id: userId,
            full_name: profile?.full_name,
            roblox_username: profile?.roblox_username,
            avatar_url: profile?.roblox_avatar_url,
            credits: credits?.amount || 0,
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Logout endpoint
    if (path.includes("/logout") && req.method === "POST") {
      const pluginToken = req.headers.get("x-plugin-token");

      if (pluginToken) {
        await supabase.from("plugin_tokens").delete().eq("token", pluginToken);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in plugin-auth:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
