#!/usr/bin/env python3
"""
Single query demo - perfect for testing without hitting rate limits
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "src"))
from rlm import RLM

# Load API key
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if line.startswith('GROQ_API_KEY='):
                os.environ['GROQ_API_KEY'] = line.split('=', 1)[1].strip()

if not os.getenv('GROQ_API_KEY'):
    print("❌ GROQ_API_KEY not found!")
    sys.exit(1)

# Load document
doc_path = Path(__file__).parent / "massive_doc.txt"
with open(doc_path) as f:
    context = f.read()

doc_tokens = len(context) // 4

print("=" * 80)
print("RLM SINGLE QUERY DEMO")
print("=" * 80)
print()
print(f"📄 Document: ~{doc_tokens:,} tokens")
print(f"💡 Traditional: Would send all {doc_tokens:,} tokens in prompt")
print(f"💡 RLM: Stores as variable, uses only ~2-5K tokens")
print()

# Get query from command line or use default
if len(sys.argv) > 1:
    query = " ".join(sys.argv[1:])
else:
    query = "What is the total AI market size and its growth rate?"

print(f"❓ Query: {query}")
print()

# Initialize and run
rlm = RLM(model="groq/llama-3.3-70b-versatile", max_iterations=30)

print("🚀 Processing with RLM...")
print()

try:
    result = rlm.complete(query, context)
    
    print(f"✅ Answer: {result}")
    print()
    print(f"📊 RLM Stats:")
    print(f"   LLM calls: {rlm.stats['llm_calls']}")
    print(f"   Iterations: {rlm.stats['iterations']}")
    print()
    
    estimated_tokens = rlm.stats['llm_calls'] * 400
    savings = ((doc_tokens - estimated_tokens) / doc_tokens) * 100
    
    print(f"💰 Token Comparison:")
    print(f"   Traditional would use: ~{doc_tokens:,} tokens")
    print(f"   RLM actually used: ~{estimated_tokens:,} tokens")
    print(f"   Savings: ~{savings:.1f}%")
    
except Exception as e:
    print(f"❌ Error: {e}")

print()
print("=" * 80)
