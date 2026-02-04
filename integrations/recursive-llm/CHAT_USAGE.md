# RLM Interactive Chat

An interactive CLI chat interface powered by Recursive Language Models (RLM) with Groq.

## Features

- 🚀 Process documents of ANY size (no token limits!)
- 💰 88%+ token savings vs traditional prompting
- ⚡ Blazing fast with Groq infrastructure
- 🎯 No context rot - consistent accuracy
- 💬 Interactive chat interface with commands

## Quick Start

### 1. Run the Interactive Chat

```bash
python3.13 integrations/recursive-llm/rlm_chat.py
```

### 2. Load a Document

```
You: /load sample_doc.txt
```

### 3. Ask Questions

```
You: What is the total AI market size?
You: How many tech workers are employed globally?
You: What is the average salary for AI/ML Engineers?
```

## Available Commands

| Command | Description |
|---------|-------------|
| `/load <file>` | Load a document as context |
| `/context` | Show current context info |
| `/clear` | Clear context |
| `/stats` | Show usage statistics |
| `/help` | Show help message |
| `/quit` or `/exit` | Exit chat |

## Example Session

```
╔═══════════════════════════════════════════════════════════════╗
║              🚀 RLM Interactive Chat with Groq 🚀             ║
╚═══════════════════════════════════════════════════════════════╝

You: /load sample_doc.txt
✓ Loaded context from: sample_doc.txt
  Size: 2,762 chars (~690 tokens)

You: What is the total AI market size and growth rate?

Processing...

Answer:
The total AI market size is $450 billion with a year-over-year growth rate of 35%.

Query Stats:
  LLM calls: 8
  Iterations: 3
  Time: 2.45s

You: /stats

Session Statistics:
  Total queries: 1
  Total LLM calls: 8
  Total iterations: 3
  Total time: 2.45s
```

## How It Works

### Traditional Approach (Expensive & Limited)
```
Prompt: [ENTIRE 100K TOKEN DOCUMENT] + "What is X?"
Cost: 100K+ tokens per query
Limit: Context window restrictions
Issue: Context rot (degraded accuracy)
```

### RLM Approach (Efficient & Unlimited)
```
Context: Stored as Python variable (not in prompt)
Prompt: "Search context for X using code"
Cost: ~2-5K tokens per query
Limit: None! Process unlimited context
Benefit: No context rot, better accuracy
```

## Token Savings Example

For a 30K token document with 4 queries:

- **Traditional:** ~120K tokens needed (30K × 4)
- **RLM:** ~8-20K tokens needed
- **Savings:** ~85-93% reduction!

## Rate Limits

Groq free tier has rate limits:
- 12,000 tokens per minute
- If you hit limits, wait a few seconds between queries
- Or upgrade to Groq Dev Tier for higher limits

## Testing

Run the test script to verify everything works:

```bash
python3.13 integrations/recursive-llm/test_chat.py
```

## Tips

1. **Load large documents first** - RLM shines with big contexts
2. **Ask specific questions** - RLM will search the document programmatically
3. **Use /stats** - Monitor your token usage
4. **Be patient with rate limits** - Free tier has restrictions

## Why RLM is Revolutionary

Traditional LLMs stuff entire documents into prompts, leading to:
- ❌ High costs (sending full context every time)
- ❌ Context limits (can't process huge documents)
- ❌ Context rot (accuracy degrades with length)

RLM stores context as a variable and explores it with code:
- ✅ Massive cost savings (88%+ reduction)
- ✅ Unlimited context (no size limits)
- ✅ Better accuracy (no context rot)

## Learn More

- Paper: https://arxiv.org/abs/2512.24601
- Blog: https://alexzhang13.github.io/blog/2025/rlm/
