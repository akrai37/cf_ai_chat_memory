# cf_ai_chat_memory

**A persistent AI chat assistant built entirely on Cloudflare** — the platform for edge computing, serverless inference, and distributed state management.

- **LLM:** Mistral 7B via Workers AI (fast, reliable)
- **Workflow/Coordination:** Cloudflare Workers (edge compute)
- **User Input:** Modern web chat UI with real-time responses
- **Memory/State:** Cloudflare KV (per-session persistent history)
- **Architecture:** Serverless, globally distributed, pay-as-you-go
- **Repo Requirement:** ✅ Name starts with `cf_ai_`

---

## 🎯 What It Does

An AI chat assistant that **remembers your conversations**. Unlike typical chatbots that forget after each message, this app maintains full conversation history within a session using Cloudflare KV storage.

### How It Works
1. You type a message in the web interface
2. Message is sent to a Cloudflare Worker
3. Worker loads your previous conversation from KV
4. AI analyzes the full history + your new message
5. AI responds with context-aware answer
6. Entire conversation (user + AI) is saved back to KV
7. Next time you chat, the AI remembers everything

---

## ✨ Key Features

- **Conversation Memory:** Full history maintained per session (24-hour TTL)
- **Edge Computing:** 300+ global data centers = fast responses from anywhere
- **Zero Cold Starts:** Instant responses, no Lambda warm-up delays
- **Pay Per Use:** Only charged for actual compute time, not idle servers
- **No API Keys Needed:** Works directly with Cloudflare bindings
- **Modern UI:** Dark mode, loading animations, Cloudflare-inspired design
- **Production Ready:** CORS configured, error handling, graceful degradation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account (free tier works!)
- Wrangler CLI

### 1️⃣ Install Wrangler
```bash
npm install -g wrangler
# or use npx wrangler for each command
```

### 2️⃣ Set Up KV Namespace
```bash
cd workers
npx wrangler kv namespace create SESSIONS
# Copy the returned 'id' into wrangler.toml under [[kv_namespaces]]
```

Your `wrangler.toml` should look like:
```toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "your-id-here"
preview_id = "your-preview-id-here"
```

### 3️⃣ Start the Backend (Worker)
```bash
cd workers
npx wrangler dev src/index.js
# Server runs at http://127.0.0.1:8787
```

### 4️⃣ Start the Frontend
```bash
# In a new terminal
cd web
npx serve . -p 3001
# Opens at http://localhost:3001
```

### 5️⃣ Test It Out
- Go to `http://localhost:3001`
- Type a message like "Hi! I'm building a chat app"
- Ask follow-up: "What was I building?" → AI remembers!

---

## 📦 Project Structure

```
cf_ai_chat_memory/
├── README.md                    # This file
├── PROMPTS.md                   # AI prompts + development history
├── personal_notes.txt           # Quick reference guide
├── workers/
│   ├── wrangler.toml           # Worker config + KV bindings
│   ├── package.json            
│   └── src/
│       └── index.js            # Cloudflare Worker code (main logic)
└── web/
    └── index.html              # Chat UI (one file, no build needed)
```

---

## ⚙️ Configuration

### Change the AI Model
Edit `workers/src/index.js` line 32:
```javascript
const MODEL_ID = "@cf/mistral/mistral-7b-instruct-v0.1";
```

Available Workers AI models:
- `@cf/mistral/mistral-7b-instruct-v0.1` (current - fast & good)
- `@cf/meta/llama-3-8b-instruct`
- `@cf/meta/llama-3-70b-instruct-v1-fp8`
- See more at [Workers AI Docs](https://developers.cloudflare.com/workers-ai/models/)

### Adjust Session Settings
Edit `workers/src/index.js`:
- **TTL:** Line 51 `expirationTtl: 60 * 60 * 24` (change 24 for different hours)
- **Memory:** Line 49 `history.slice(-10)` (change 10 for more/fewer messages)
- **CORS:** Line 9 `"Access-Control-Allow-Origin": "*"` (restrict in production)

---

## 🌍 Deploy to Production

### Deploy Worker
```bash
cd workers
npx wrangler publish
# Get your Worker URL from the output
```

### Deploy Frontend (Option 1: Cloudflare Pages)
```bash
# Connect your GitHub repo to Cloudflare Pages
# Set build command: (none)
# Set publish directory: web/
# Auto-deploys on push!
```

### Deploy Frontend (Option 2: Any Static Host)
- Upload `/web/index.html` to any web server
- Update `WORKER_URL` in the HTML to your published Worker URL

### Update WORKER_URL
Edit `web/index.html` line 66:
```javascript
const WORKER_URL = "https://your-worker.your-account.workers.dev";
```

---

## 💡 How It's Different from AWS

| Feature | Cloudflare | AWS Lambda |
|---------|-----------|----------|
| **Location** | 300+ edge locations | Regional data centers |
| **Cold Start** | Instant | 1-5+ seconds |
| **Cost Model** | Pay-per-execution | Provisioned capacity |
| **Setup** | Simple (wrangler) | Complex (CDK/Terraform) |
| **AI Integration** | Built-in Workers AI | Need SageMaker (expensive) |
| **KV Storage** | Global replication | DynamoDB (higher costs) |
| **Time to Deploy** | ~30 seconds | 5-15 minutes |

**Result:** Your chat app is faster, cheaper, and simpler to maintain on Cloudflare.

---

## 🧪 Testing

### Test the API directly
```bash
curl -X POST http://127.0.0.1:8787/chat \
  -H "Content-Type: application/json" \
  -H "x-session-id: test-user" \
  -d '{"message":"What is your name?"}'
```

### Test memory persistence
1. Send: "My name is Alice"
2. Send: "What's my name?" → Should respond "Alice"
3. Refresh page, send: "What's my name?" → Still remembers! 🎉

---

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)
- [Cloudflare KV Storage](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

---

## ✅ Submission Checklist (Cloudflare Assignment)

- ✅ Repo name starts with `cf_ai_` 
- ✅ `README.md` with clear setup & deployment instructions
- ✅ `PROMPTS.md` documenting all AI prompts used
- ✅ Uses Workers AI (Mistral 7B LLM)
- ✅ Workflow/coordination layer (Cloudflare Worker)
- ✅ User input via chat UI (web interface)
- ✅ Memory/state (Cloudflare KV persistent storage)
- ✅ Original code (100% custom built)
- ✅ Running locally and deployable to production

---

## 📝 License & Attribution

Built for the Cloudflare Workers AI Assignment. All code is original.

**Questions?** Check `personal_notes.txt` for a quick reference!
