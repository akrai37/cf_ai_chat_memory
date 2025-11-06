# PROMPTS.md

This document records all prompts used during development and the system prompt used by the application.

## System Prompt (Runtime)

The AI uses this system prompt to guide its behavior:

```
You are a concise, helpful assistant. Be direct and avoid unnecessary verbosity. 
When answering questions, provide clear explanations with relevant examples. 
If you don't know something, say so honestly. Maintain context from the conversation history.
```

## Development Prompts (AI-Assisted Coding)

### Backend/Worker Development
1. **Initial Worker Setup**
   - "Write a minimal Cloudflare Worker that calls Workers AI chat with KV-based memory."
   - Result: Core `/chat` endpoint with session management

2. **Memory Implementation**
   - "Implement conversation history storage in Cloudflare KV with automatic trimming to last 10 message pairs."
   - Result: Session-based history with TTL and auto-trimming

3. **Error Handling & CORS**
   - "Add proper error handling, CORS headers, and graceful degradation for the Worker."
   - Result: Complete error handling and CORS support

### Frontend Development
4. **UI Structure**
   - "Produce an index.html that posts JSON to /chat and appends the reply to the DOM with proper styling."
   - Result: Interactive chat bubble interface

5. **Loading States**
   - "Add animated loading dots (WhatsApp style) while waiting for AI response."
   - Result: Smooth bouncing dot animation during processing

6. **Design System**
   - "Create a Cloudflare-inspired dark UI with orange accents and modern typography."
   - Result: Professional gradient background, orange buttons, modern fonts

### Configuration
7. **Wrangler Setup**
   - "Show how to configure wrangler.toml with an AI binding and KV namespace."
   - Result: Complete template with all bindings configured

## Model Configuration

- **Current Model:** `@cf/meta/llama-3.1-8b-instruct`
- **Why Llama 3.1 8B:** Recommended by Cloudflare assignment (closest to Llama 3.3), superior instruction-following, better conversational abilities
- **Previous Model:** Mistral 7B (upgraded due to poor instruction adherence)
- **Other Options:** Llama 3.2, Mixtral, etc. available on Workers AI

## Key Design Decisions

- **Session-based memory:** Each session ID maintains independent conversation history
- **24-hour TTL:** Automatic cleanup after 24 hours of inactivity
- **Last 10 messages:** Smart trimming balances context vs token limits
- **No external APIs:** Pure Cloudflare infrastructure, fully self-contained
- **Minimal frontend:** Vanilla JS, no frameworks - keeps app lightweight

## Future Enhancement Ideas

- Add voice input/output with Cloudflare Calls
- Implement user authentication and persistent profiles
- RAG (Retrieval Augmented Generation) with Vectorize for knowledge base
- Admin dashboard for analytics and monitoring
- Multi-language support
