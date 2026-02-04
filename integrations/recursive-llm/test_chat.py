#!/usr/bin/env python3
"""
Quick test of RLM chat functionality
"""

import os
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from rlm import RLM

# Load API key
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if line.startswith('GROQ_API_KEY='):
                key = line.split('=', 1)[1].strip()
                os.environ['GROQ_API_KEY'] = key

# Check API key
if not os.getenv('GROQ_API_KEY'):
    print("❌ GROQ_API_KEY not found!")
    sys.exit(1)

print("=" * 80)
print("RLM CHAT TEST")
print("=" * 80)
print()

# Load sample document
doc_path = Path(__file__).parent / "sample_doc.txt"
with open(doc_path) as f:
    context = f.read()

print(f"📄 Loaded document: {len(context):,} characters (~{len(context)//4:,} tokens)")
print()

# Initialize RLM
print("🚀 Initializing RLM with Groq...")
rlm = RLM(
    model="groq/llama-3.3-70b-versatile",
    max_iterations=25,
)
print("✓ RLM ready!")
print()

# Test queries
queries = [
    "What is the total AI market size and growth rate?",
    "How many tech workers are employed globally?",
    "What is the average salary for AI/ML Engineers?",
]

for i, query in enumerate(queries, 1):
    print(f"Query {i}: {query}")
    print()
    
    try:
        result = rlm.complete(query, context)
        
        print(f"✅ Answer: {result}")
        print(f"📊 Stats: {rlm.stats['llm_calls']} LLM calls, {rlm.stats['iterations']} iterations")
        print("-" * 80)
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("-" * 80)
        print()

print("=" * 80)
print("TEST COMPLETE")
print("=" * 80)
print()
print("To use the interactive chat, run:")
print("  python3.13 integrations/recursive-llm/rlm_chat.py")
print()
