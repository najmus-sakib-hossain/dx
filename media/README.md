# Media

This is media folder.

in this rust workspace make suer that when we run "cargo run" the crates cli crate should run and by default please use crates/cli/ser/prompts to show a onboarding to an ai chat with many providers, tools, intergrations configurations!!!

I am creating my own rust ai cli and there my llm models need tool - but I don't know one thing does they have tools or do we have to make a rust tools to web search and then let the ai know that we can use web search tools by running this command - or what how does this works??

Its not "DX Serial" its "DX Serializer" and also we will have:
1. integrations in wasm nodejs as known is has the largest amount of packages as whatsapp, telegram, discord, x and others messaging is mostly supported in nodejs ecosystem!!!
2. providers in wasm python and arguably Python supports local and remote LLMs by basically any provider by interface in the world. So it's definitely the right choice to use providers in Python programming languages. 
3. tools in rust, go and c/cpp/zig languages as tools need to be fast, we should use the fastest programming languages to use them. 
And our DX should have workspaces so many agents can run in parallel thanks to Rust speed and parallelism with Tokyo and rayon crates
And then our DX can run any commands, but they should run in a sandbox environment so the main operating system doesn't lose any data. If we are using the main operating system, then we can run copy, move, and other types of commands. But if we are tasked with deleting any command, then we ask the user first. Deleting something is still an irreversible task for an AI, mostly. So we should ask the user to confirm that. 
And our Rust dx can be deployed in any operating system, Docker, VPS, or any deployment platforms in matters of seconds.

# DX Project Master Plan

## Current Status

✅ **DONE**: `crates/serializer/` — Human (.sr), LLM (.llm 70%+ savings), Machine (.machine RKYV+LZ4)

## Project Structure

```
dx/
├── Cargo.toml                    # Workspace
├── crates/
│   ├── cli/                      # ✅ Main binary
│   ├── core/                     # 🔨 Shared types
│   ├── serializer/               # ✅ DONE
│   ├── daemon/                   # 🔨 24/7 background process
│   ├── workspace/                # 🔨 Parallel agents (Tokio + Rayon)
│   ├── sandbox/                  # 🔨 Command safety + user confirmation
│   ├── plugins/                  # 🔨 WASM host (wasmtime)
│   └── agent/                    # 🔨 Self-evolving AI
├── plugins/
│   ├── integrations/             # Node.js → WASM (messaging)
│   ├── providers/                # Python → WASM (LLMs)
│   └── tools/                    # Rust/Go/C/Zig → WASM (performance)
├── deploy/
│   ├── docker/
│   └── scripts/
└── scripts/
```

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Core Crate
| Task | Description | Priority |
|------|-------------|----------|
| Error types | Unified error handling across all crates | P0 |
| Config loader | Parse config.sr using your serializer | P0 |
| Status types | Shared status/result types | P0 |
| Logging setup | tracing integration | P1 |

### 1.2 CLI Crate
| Task | Description | Priority |
|------|-------------|----------|
| Command structure | clap with all subcommands | P0 |
| Status reporter | Pretty + DX LLM + JSON output formats | P0 |
| `dx init` | Project initialization | P0 |
| `dx status` | Show current state (AI-friendly) | P0 |
| Daemon forwarding | Forward commands to daemon if running | P1 |

### 1.3 Daemon Crate (CRITICAL)
| Task | Description | Priority |
|------|-------------|----------|
| Unix socket IPC | `/tmp/dx.sock` for commands | P0 |
| Event loop | Tokio select! (0% CPU when idle) | P0 |
| Signal handling | SIGTERM, SIGINT, SIGHUP | P0 |
| `dx daemon start` | Foreground + background modes | P0 |
| `dx daemon stop` | Graceful shutdown | P0 |
| `dx daemon status` | Show stats (uptime, CPU, memory) | P0 |
| `dx daemon send` | Send command to running daemon | P1 |
| PID file | Track running daemon | P1 |
| Windows support | Named pipes for Windows | P2 |

**Goal**: Daemon runs 24/7 with 0.0% CPU when idle

---

## Phase 2: Execution Layer (Week 2-3)

### 2.1 Sandbox Crate
| Task | Description | Priority |
|------|-------------|----------|
| Command classifier | Safe / Moderate / Destructive / Unknown | P0 |
| User confirmation | Terminal prompt for destructive ops | P0 |
| Audit logging | Log all executed commands | P0 |
| Full isolation | bubblewrap (Linux) / sandbox-exec (macOS) | P1 |
| Semi-isolated mode | Filter dangerous commands | P1 |
| Native mode | Direct execution with confirmation | P1 |

**Rules**:
- `ls`, `cat`, `grep`, `find` → Safe (run immediately)
- `cp`, `mv`, `mkdir` → Moderate (run with logging)
- `rm`, `rm -rf`, `dd` → Destructive (ASK USER FIRST)

### 2.2 Workspace Crate
| Task | Description | Priority |
|------|-------------|----------|
| WorkspaceManager | Track all active workspaces | P0 |
| Spawn workspace | `dx workspace spawn <name>` | P0 |
| Resource limits | Memory/CPU per workspace | P1 |
| Inter-workspace channels | Message passing between agents | P1 |
| Parallel execution | Rayon for CPU-bound tasks | P1 |
| Persistence | Save/restore workspace state | P2 |

**Goal**: 100+ parallel agents with zero interference

---

## Phase 3: Plugin System (Week 3-4)

### 3.1 Plugin Host
| Task | Description | Priority |
|------|-------------|----------|
| Wasmtime engine | Configure with async + component-model | P0 |
| Plugin loading | Load .wasm from disk | P0 |
| Plugin registry | Track loaded plugins by category | P0 |
| Host functions | Register DX Serializer, sandbox, etc. | P0 |
| Hot reload | Reload plugins without restart | P2 |

### 3.2 Integrations (Node.js → WASM)
| Task | Description | Priority |
|------|-------------|----------|
| Javy compiler | Node.js/TS → WASM pipeline | P0 |
| Plugin scaffold | `dx plugin add --type integration <name>` | P0 |
| Discord integration | First working example | P1 |
| Telegram integration | Second example | P1 |
| WhatsApp integration | Via whatsapp-web.js | P2 |
| X (Twitter) integration | Via API | P2 |
| Slack integration | Via Bolt | P2 |

### 3.3 Providers (Python → WASM)
| Task | Description | Priority |
|------|-------------|----------|
| componentize-py | Python → WASM pipeline | P0 |
| Provider scaffold | `dx plugin add --type provider <name>` | P0 |
| OpenAI provider | First working example | P0 |
| Anthropic provider | Claude support | P1 |
| Ollama provider | Local models | P1 |
| Gemini provider | Google AI | P2 |
| HuggingFace provider | Open models | P2 |

### 3.4 Tools (Rust/Go/C/Zig → WASM)
| Task | Description | Priority |
|------|-------------|----------|
| Rust compiler | cargo build --target wasm32-wasip2 | P0 |
| Go compiler | TinyGo | P1 |
| C/C++ compiler | Emscripten | P2 |
| Zig compiler | Native WASM target | P2 |
| MCP tool | Model Context Protocol server | P0 |
| Filesystem tool | File operations | P0 |
| Git tool | Git operations | P1 |
| Shell tool | Command execution | P1 |
| HTTP tool | API calls | P1 |

---

## Phase 4: Agent System (Week 4-5)

### 4.1 Self-Updating Agent
| Task | Description | Priority |
|------|-------------|----------|
| Capability registry | Track what agent can do | P0 |
| Add capability | Generate code → compile → load | P0 |
| Language selection | Pick best language for task | P0 |
| Dependency manager | Auto-install Node.js/Python/Go | P1 |
| Feature delta | Detect local vs remote differences | P1 |

### 4.2 Community Integration
| Task | Description | Priority |
|------|-------------|----------|
| GitHub auth | OAuth for pushing | P1 |
| `dx agent push` | Create PR with new capability | P1 |
| `dx agent pull` | Fetch community capabilities | P1 |
| Plugin hub | Future: plugins.dx.ai | P2 |

---

## Phase 5: MCP Integration (Week 5-6)

### 5.1 MCP Server Tool
| Task | Description | Priority |
|------|-------------|----------|
| JSON-RPC handler | Parse MCP protocol | P0 |
| Tool registration | Expose DX tools to IDE | P0 |
| Resource provider | Expose files/context | P0 |
| stdio transport | VS Code / Cursor connection | P0 |
| DX Serializer wire format | Use LLM format for efficiency | P1 |

### 5.2 IDE Integration
| Task | Description | Priority |
|------|-------------|----------|
| VS Code config | MCP server configuration | P0 |
| Cursor config | Same as VS Code | P0 |
| Tool discovery | Auto-register new tools | P1 |

---

## Phase 6: Deployment (Week 6-7)

### 6.1 Binary Distribution
| Task | Description | Priority |
|------|-------------|----------|
| Cross-compile | Linux/macOS/Windows x86_64 + ARM64 | P0 |
| Static linking | musl for Linux | P0 |
| Install script | `curl -fsSL https://dx.ai/install \| bash` | P0 |
| GitHub releases | Automated release workflow | P0 |

### 6.2 Docker
| Task | Description | Priority |
|------|-------------|----------|
| Multi-stage Dockerfile | <50MB final image | P0 |
| Alpine variant | Minimal footprint | P1 |
| docker-compose | Multi-agent deployment | P1 |
| Health checks | Readiness/liveness probes | P1 |

### 6.3 Cloud Deployment
| Task | Description | Priority |
|------|-------------|----------|
| VPS scripts | Ubuntu/Debian/Alpine | P1 |
| Systemd service | Auto-start on boot | P1 |
| Fly.io config | Edge deployment | P2 |
| Railway config | One-click deploy | P2 |

---

## Commands Summary

```bash
# Daemon (runs 24/7, 0% CPU when idle)
dx daemon start [--foreground]
dx daemon stop
dx daemon restart
dx daemon status

# Interactive
dx run [--sandbox full|semi|native]
dx mcp                              # Start MCP server

# Workspaces (parallel agents)
dx workspace spawn <name>
dx workspace list
dx workspace stop <name>
dx workspace stop-all

# Plugins (3 categories)
dx plugin add --type integration discord
dx plugin add --type provider openai
dx plugin add --type tool mcp
dx plugin list [--type integration|provider|tool]
dx plugin build <path>
dx plugin remove <name>

# Agent (self-evolving)
dx agent add-capability "<description>"
dx agent capabilities
dx agent push <capability>
dx agent pull

# Serializer (already done)
dx serializer <path>
dx serializer convert <file> --format llm|human|json|machine

# Project
dx init [--with-examples]
dx status [--ai]
```

---

## Priority Order (What To Build Next)

```
Week 1:
├── 1. core/          → Error types, config, status
├── 2. daemon/        → Event loop, IPC, start/stop
└── 3. cli/           → Commands, daemon forwarding

Week 2:
├── 4. sandbox/       → Command safety, user confirmation
└── 5. workspace/     → Spawn, list, parallel execution

Week 3:
├── 6. plugins/host   → Wasmtime, registry, loading
├── 7. First integration (Discord)
└── 8. First provider (OpenAI)

Week 4:
├── 9. First tool (MCP)
└── 10. agent/        → Add capability, self-modification

Week 5:
├── 11. MCP integration with VS Code
└── 12. More integrations/providers/tools

Week 6:
├── 13. Deployment (Docker, install script)
└── 14. Community features (push/pull)
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Daemon idle CPU | 0.0% |
| Daemon startup | <100ms |
| Plugin load time | <50ms |
| WASM call overhead | <1ms |
| Parallel workspaces | 100+ |
| Token savings (LLM format) | 70%+ |
| Docker image size | <50MB |
| Deploy time | <30 seconds |

---

## What Makes DX Unbeatable

1. **Serializer** — 70%+ token savings (you already have this)
2. **Daemon** — Instant response, 0% CPU when idle
3. **3 Plugin Categories** — Right language for each job
4. **Self-Evolving** — Agent writes its own capabilities
5. **MCP Tool** — Takes over every IDE
6. **WASM Sandbox** — Safe, portable, instant

---

## Next Immediate Steps

1. **Today**: Finish `daemon/` with Unix socket IPC
2. **Tomorrow**: Make `dx daemon start` work with 0% CPU
3. **Day 3**: Connect `cli/` to daemon
4. **Day 4**: Add `sandbox/` with command safety
5. **Day 5**: Add `workspace/` for parallel agents
6. **Day 6-7**: First plugin (MCP tool in Rust)

**You are 7 days away from having something nobody else has.**