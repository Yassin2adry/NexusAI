import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { chatSessionId, message } = await req.json();

    if (!chatSessionId || !message) {
      return new Response(JSON.stringify({ error: "Missing chatSessionId or message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify chat session belongs to user
    const { data: session, error: sessionError } = await supabaseClient
      .from("chat_sessions")
      .select("*")
      .eq("id", chatSessionId)
      .single();

    if (sessionError || !session || session.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Chat session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save user message
    const { error: userMsgError } = await supabaseClient
      .from("chat_messages")
      .insert({
        chat_session_id: chatSessionId,
        role: "user",
        content: message,
      });

    if (userMsgError) {
      console.error("Error saving user message:", userMsgError);
      throw userMsgError;
    }

    // Get conversation history
    const { data: messages, error: messagesError } = await supabaseClient
      .from("chat_messages")
      .select("role, content")
      .eq("chat_session_id", chatSessionId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      throw messagesError;
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are NexusAI, an advanced AI assistant specialized in Roblox game development. You help users design, plan, and create Roblox games by:

1. Understanding their game ideas and asking clarifying questions
2. Creating detailed game design documents
3. Suggesting game mechanics, features, and systems
4. Providing guidance on Luau scripting
5. Helping with UI/UX design decisions
6. Recommending asset organization and structure

Be helpful, detailed, and technical when needed. Always provide actionable advice.`,
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Save assistant message
    const { error: assistantMsgError } = await supabaseClient
      .from("chat_messages")
      .insert({
        chat_session_id: chatSessionId,
        role: "assistant",
        content: assistantMessage,
      });

    if (assistantMsgError) {
      console.error("Error saving assistant message:", assistantMsgError);
      throw assistantMsgError;
    }

    // Update chat session timestamp
    await supabaseClient
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", chatSessionId);

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
