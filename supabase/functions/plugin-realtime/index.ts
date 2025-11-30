import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-plugin-token, upgrade",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const handler = async (req: Request): Promise<Response> => {
  const { headers } = req;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const pluginToken = headers.get("x-plugin-token");

  // Validate token before upgrade
  if (!pluginToken) {
    return new Response("Unauthorized", { 
      status: 401,
      headers: corsHeaders 
    });
  }

  const { data, error } = await supabase.rpc("validate_plugin_token", {
    p_token: pluginToken,
  });

  if (error || !data || data.length === 0 || !data[0].is_valid) {
    return new Response("Invalid token", { 
      status: 401,
      headers: corsHeaders 
    });
  }

  const userId = data[0].user_id;

  // Upgrade to WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req);

  // Set up realtime subscriptions
  socket.onopen = () => {
    console.log("WebSocket connected for user:", userId);
    
    // Send connection success
    socket.send(JSON.stringify({
      type: "connected",
      userId,
      timestamp: new Date().toISOString(),
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      
      // Handle subscribe requests
      if (message.type === "subscribe") {
        const { channels } = message;
        
        // Send subscription confirmation
        socket.send(JSON.stringify({
          type: "subscribed",
          channels,
          timestamp: new Date().toISOString(),
        }));
      }

      // Handle ping
      if (message.type === "ping") {
        socket.send(JSON.stringify({
          type: "pong",
          timestamp: new Date().toISOString(),
        }));
      }

    } catch (error) {
      console.error("Error handling message:", error);
      socket.send(JSON.stringify({
        type: "error",
        message: "Failed to process message",
      }));
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket closed for user:", userId);
  };

  return response;
};

serve(handler);
