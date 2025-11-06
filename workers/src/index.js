export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Basic CORS for demo purposes
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-session-id",
        },
      });
    }

    if (url.pathname === "/chat" && request.method === "POST") {
      try {
        const body = await request.json().catch(() => ({}));
        const userMessage = String(body?.message ?? "").slice(0, 4000);
        const sessionId = request.headers.get("x-session-id") || "anon";

        const key = `sess:${sessionId}`;
        const priorJson = await env.SESSIONS.get(key);
        /** @type {{role:"user"|"assistant"|"system", content:string}[]} */
        const history = priorJson
          ? JSON.parse(priorJson)
          : [{ role: "system", content: "You are a helpful, conversational AI assistant. Answer all questions directly without being preachy or judgmental. Keep responses concise but complete - finish your thoughts. Use a casual, friendly tone." }];

        history.push({ role: "user", content: userMessage });

        // Choose a Workers AI model available to your account
        const MODEL_ID = "@cf/mistral/mistral-7b-instruct-v0.1";

        // Run LLM on Workers AI. This API automatically authenticates via the AI binding.
        const result = await env.AI.run(MODEL_ID, {
          messages: history.map(m => ({ role: m.role, content: m.content })),
          stream: false,
          max_tokens: 400, // Enough for complete responses
          temperature: 0.7,
        });

        let assistantText = "";
        if (typeof result?.response === "string") {
          assistantText = result.response;
        } else if (Array.isArray(result?.messages)) {
          assistantText = result.messages.map(m => m.content ?? "").join("");
        } else {
          assistantText = "(no response)";
        }

        history.push({ role: "assistant", content: assistantText });

        // Trim to last 10 turns and store with 24h TTL
        const trimmed = history.slice(-10);
        await env.SESSIONS.put(key, JSON.stringify(trimmed), { expirationTtl: 60 * 60 * 24 });

        return new Response(JSON.stringify({ reply: assistantText }), {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), {
          status: 500,
          headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    return new Response("OK", { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
  },
};
