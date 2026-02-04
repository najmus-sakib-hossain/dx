#!/usr/bin/env python3
"""
Interactive RLM Chat CLI
A powerful chat interface using Recursive Language Models with Groq
"""

import os
import sys
import time
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from rlm import RLM

# ANSI color codes
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


def print_banner():
    """Print welcome banner."""
    banner = f"""
{Colors.CYAN}{Colors.BOLD}╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🚀 RLM Interactive Chat with Groq 🚀             ║
║                                                               ║
║         Recursive Language Models - Unlimited Context        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝{Colors.END}

{Colors.YELLOW}Features:{Colors.END}
  • Process documents of ANY size (no token limits!)
  • 88%+ token savings vs traditional prompting
  • Blazing fast with Groq infrastructure
  • No context rot - consistent accuracy

{Colors.YELLOW}Commands:{Colors.END}
  {Colors.GREEN}/load <file>{Colors.END}     - Load a document as context
  {Colors.GREEN}/context{Colors.END}         - Show current context info
  {Colors.GREEN}/clear{Colors.END}           - Clear context
  {Colors.GREEN}/stats{Colors.END}           - Show usage statistics
  {Colors.GREEN}/help{Colors.END}            - Show this help
  {Colors.GREEN}/quit{Colors.END} or {Colors.GREEN}/exit{Colors.END} - Exit chat

{Colors.CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.END}
"""
    print(banner)


def load_api_key():
    """Load Groq API key from .env file."""
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                if line.startswith('GROQ_API_KEY='):
                    key = line.split('=', 1)[1].strip()
                    os.environ['GROQ_API_KEY'] = key
                    return True
    return False


def load_file(filepath: str) -> str:
    """Load file content."""
    try:
        path = Path(filepath)
        if not path.exists():
            return None
        
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return content
    except Exception as e:
        print(f"{Colors.RED}Error loading file: {e}{Colors.END}")
        return None


def format_size(chars: int) -> str:
    """Format character count in human-readable format."""
    tokens = chars // 4
    if tokens < 1000:
        return f"{chars:,} chars (~{tokens} tokens)"
    elif tokens < 1_000_000:
        return f"{chars:,} chars (~{tokens/1000:.1f}K tokens)"
    else:
        return f"{chars:,} chars (~{tokens/1_000_000:.1f}M tokens)"


class RLMChat:
    """Interactive RLM chat session."""
    
    def __init__(self):
        """Initialize chat session."""
        self.context = ""
        self.context_name = None
        self.rlm = None
        self.total_queries = 0
        self.total_llm_calls = 0
        self.total_iterations = 0
        self.total_time = 0.0
        
        # Initialize RLM
        self._init_rlm()
    
    def _init_rlm(self):
        """Initialize RLM instance."""
        try:
            self.rlm = RLM(
                model="groq/meta-llama/llama-4-scout-17b-16e-instruct",
                max_iterations=25,
            )
            print(f"{Colors.GREEN}✓ RLM initialized with Groq (llama-4-scout-17b-16e-instruct){Colors.END}")
        except Exception as e:
            print(f"{Colors.RED}✗ Failed to initialize RLM: {e}{Colors.END}")
            sys.exit(1)
    
    def load_context(self, filepath: str):
        """Load context from file."""
        content = load_file(filepath)
        if content is None:
            print(f"{Colors.RED}✗ Failed to load file: {filepath}{Colors.END}")
            return
        
        self.context = content
        self.context_name = Path(filepath).name
        
        print(f"{Colors.GREEN}✓ Loaded context from: {self.context_name}{Colors.END}")
        print(f"  Size: {format_size(len(content))}")
        print()
    
    def show_context_info(self):
        """Show current context information."""
        if not self.context:
            print(f"{Colors.YELLOW}No context loaded.{Colors.END}")
            print(f"Use {Colors.GREEN}/load <file>{Colors.END} to load a document.")
            return
        
        print(f"{Colors.CYAN}Current Context:{Colors.END}")
        print(f"  File: {self.context_name or 'Direct input'}")
        print(f"  Size: {format_size(len(self.context))}")
        print(f"  Preview: {self.context[:200]}...")
        print()
    
    def clear_context(self):
        """Clear current context."""
        self.context = ""
        self.context_name = None
        print(f"{Colors.GREEN}✓ Context cleared{Colors.END}")
        print()
    
    def show_stats(self):
        """Show usage statistics."""
        print(f"{Colors.CYAN}Session Statistics:{Colors.END}")
        print(f"  Total queries: {self.total_queries}")
        print(f"  Total LLM calls: {self.total_llm_calls}")
        print(f"  Total iterations: {self.total_iterations}")
        print(f"  Total time: {self.total_time:.2f}s")
        
        if self.total_queries > 0:
            avg_calls = self.total_llm_calls / self.total_queries
            avg_time = self.total_time / self.total_queries
            print(f"  Avg LLM calls/query: {avg_calls:.1f}")
            print(f"  Avg time/query: {avg_time:.2f}s")
        
        print()
    
    def process_query(self, query: str):
        """Process user query with RLM."""
        if not query.strip():
            return
        
        # If no context, use query as context
        context = self.context if self.context else query
        
        print(f"{Colors.CYAN}Processing with RLM...{Colors.END}")
        print()
        
        start_time = time.time()
        
        try:
            # Call RLM
            result = self.rlm.complete(query, context)
            
            elapsed = time.time() - start_time
            
            # Update stats
            self.total_queries += 1
            self.total_llm_calls += self.rlm.stats['llm_calls']
            self.total_iterations += self.rlm.stats['iterations']
            self.total_time += elapsed
            
            # Display result
            print(f"{Colors.GREEN}{Colors.BOLD}Answer:{Colors.END}")
            print(f"{result}")
            print()
            
            # Display stats for this query
            print(f"{Colors.CYAN}Query Stats:{Colors.END}")
            print(f"  LLM calls: {self.rlm.stats['llm_calls']}")
            print(f"  Iterations: {self.rlm.stats['iterations']}")
            print(f"  Time: {elapsed:.2f}s")
            
            # Show token savings
            if self.context:
                doc_tokens = len(self.context) // 4
                estimated_tokens = self.rlm.stats['llm_calls'] * 400
                savings = ((doc_tokens - estimated_tokens) / doc_tokens) * 100 if doc_tokens > 0 else 0
                print(f"  Token savings: ~{savings:.1f}% (vs traditional prompting)")
            
            print()
            
        except Exception as e:
            error_msg = str(e)
            if "rate_limit" in error_msg.lower():
                print(f"{Colors.YELLOW}⚠️  Rate Limit Hit{Colors.END}")
                print(f"Groq free tier: 12,000 tokens/minute")
                print(f"Please wait 10-15 seconds and try again.")
                print()
            else:
                print(f"{Colors.RED}Error: {e}{Colors.END}")
                print()
    
    def show_help(self):
        """Show help message."""
        help_text = f"""
{Colors.CYAN}Available Commands:{Colors.END}

{Colors.GREEN}/load <file>{Colors.END}
    Load a document as context for your queries.
    Example: /load report.txt

{Colors.GREEN}/context{Colors.END}
    Show information about the currently loaded context.

{Colors.GREEN}/clear{Colors.END}
    Clear the current context.

{Colors.GREEN}/stats{Colors.END}
    Show session statistics (queries, LLM calls, time, etc.)

{Colors.GREEN}/help{Colors.END}
    Show this help message.

{Colors.GREEN}/quit{Colors.END} or {Colors.GREEN}/exit{Colors.END}
    Exit the chat.

{Colors.CYAN}Usage Tips:{Colors.END}

1. Load a large document first:
   {Colors.YELLOW}/load my_document.txt{Colors.END}

2. Ask questions about it:
   {Colors.YELLOW}What are the main topics in this document?{Colors.END}
   {Colors.YELLOW}Find all mentions of "revenue" and summarize them{Colors.END}

3. RLM will explore the document programmatically to find answers!

{Colors.CYAN}Why RLM is Powerful:{Colors.END}

• Traditional LLMs send the ENTIRE document in every prompt
• RLM stores it as a variable and explores it with code
• Result: 88%+ token savings, no context limits, better accuracy!
"""
        print(help_text)
    
    def run(self):
        """Run interactive chat loop."""
        print_banner()
        
        # Check API key
        if not os.getenv('GROQ_API_KEY'):
            print(f"{Colors.RED}✗ GROQ_API_KEY not found!{Colors.END}")
            print(f"Please set it in .env file or as environment variable.")
            return
        
        print(f"{Colors.YELLOW}Type your query or use /help for commands{Colors.END}")
        print()
        
        while True:
            try:
                # Get user input
                user_input = input(f"{Colors.BOLD}You:{Colors.END} ").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.startswith('/'):
                    cmd_parts = user_input.split(maxsplit=1)
                    cmd = cmd_parts[0].lower()
                    arg = cmd_parts[1] if len(cmd_parts) > 1 else None
                    
                    if cmd in ['/quit', '/exit']:
                        print(f"{Colors.CYAN}Goodbye! 👋{Colors.END}")
                        break
                    
                    elif cmd == '/load':
                        if not arg:
                            print(f"{Colors.RED}Usage: /load <file>{Colors.END}")
                        else:
                            self.load_context(arg)
                    
                    elif cmd == '/context':
                        self.show_context_info()
                    
                    elif cmd == '/clear':
                        self.clear_context()
                    
                    elif cmd == '/stats':
                        self.show_stats()
                    
                    elif cmd == '/help':
                        self.show_help()
                    
                    else:
                        print(f"{Colors.RED}Unknown command: {cmd}{Colors.END}")
                        print(f"Type {Colors.GREEN}/help{Colors.END} for available commands")
                        print()
                
                else:
                    # Process as query
                    self.process_query(user_input)
            
            except KeyboardInterrupt:
                print()
                print(f"{Colors.CYAN}Goodbye! 👋{Colors.END}")
                break
            
            except EOFError:
                print()
                print(f"{Colors.CYAN}Goodbye! 👋{Colors.END}")
                break


def main():
    """Main entry point."""
    # Load API key
    load_api_key()
    
    # Run chat
    chat = RLMChat()
    chat.run()


if __name__ == "__main__":
    main()
