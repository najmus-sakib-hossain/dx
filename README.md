# DX CLI - AGI-like Rust Agent

A modern Rust workspace implementing an advanced AI agent with token-efficient serialization, WASM integrations, and self-updating capabilities.

Please look at integrations/openclaw folder and make sure in our rust dx project we have everything that openclaw has like soul.md and other ai agent systems but not the useless static whatsapp, telegram, discord integrations and other useless nodejs stuffs as we can beat them with our AGI like:
1. Integrations
2. Providers
3. Tools

For now on in your steering file please put that I am already may be using "cargo watch -x run" command in some terminal so please use that to find lint and formatting warnings and errors instead of blindly runnning another terminal commands:

Shohan@dx MINGW64 /f/Dx (main)
$ openclaw

🦞 OpenClaw 2026.1.29 (a5b4d22) — Because the right answer is usually a script.

Usage: openclaw [options] [command]

Options:
  -V, --version     output the version number
  --dev             Dev profile: isolate state under ~/.openclaw-dev, default gateway port 19001, and shift derived ports (browser/canvas)
  --profile <name>  Use a named profile (isolates OPENCLAW_STATE_DIR/OPENCLAW_CONFIG_PATH under ~/.openclaw-<name>)
  --no-color        Disable ANSI colors
  -h, --help        display help for command

Commands:
  setup             Initialize ~/.openclaw/openclaw.json and the agent workspace
  onboard           Interactive wizard to set up the gateway, workspace, and skills
  configure         Interactive prompt to set up credentials, devices, and agent defaults
  config            Config helpers (get/set/unset). Run without subcommand for the wizard.
  doctor            Health checks + quick fixes for the gateway and channels
  dashboard         Open the Control UI with your current token
  reset             Reset local config/state (keeps the CLI installed)
  uninstall         Uninstall the gateway service + local data (CLI remains)
  message           Send messages and channel actions
  memory            Memory search tools
  agent             Run an agent turn via the Gateway (use --local for embedded)
  agents            Manage isolated agents (workspaces + auth + routing)
  acp               Agent Control Protocol tools
  gateway           Gateway control
  daemon            Gateway service (legacy alias)
  logs              Gateway logs
  system            System events, heartbeat, and presence
  models            Model configuration
  approvals         Exec approvals
  nodes             Node commands
  devices           Device pairing + token management
  node              Node control
  sandbox           Sandbox tools
  tui               Terminal UI
  cron              Cron scheduler
  dns               DNS helpers
  docs              Docs helpers
  hooks             Hooks tooling
  webhooks          Webhook helpers
  pairing           Pairing helpers
  plugins           Plugin management
  channels          Channel management
  directory         Directory commands
  security          Security helpers
  skills            Skills management
  update            CLI update helpers
  status            Show channel health and recent session recipients
  health            Fetch health from the running gateway
  sessions          List stored conversation sessions
  browser           Manage OpenClaw's dedicated browser (Chrome/Chromium)
  help              display help for command

Examples:
  openclaw channels login --verbose
    Link personal WhatsApp Web and show QR + connection logs.
  openclaw message send --target +15555550123 --message "Hi" --json
    Send via your web session and print JSON result.
  openclaw gateway --port 18789
    Run the WebSocket Gateway locally.
  openclaw --dev gateway
    Run a dev Gateway (isolated state/config) on ws://127.0.0.1:19001.
  openclaw gateway --force
    Kill anything bound to the default gateway port, then start it.
  openclaw gateway ...
    Gateway control via WebSocket.
  openclaw agent --to +15555550123 --message "Run summary" --deliver
    Talk directly to the agent using the Gateway; optionally send the WhatsApp reply.
  openclaw message send --channel telegram --target @mychat --message "Hi"
    Send via your Telegram bot.

Docs: docs.openclaw.ai/cli










Shohan@dx MINGW64 /f/Dx (main)
$ openclaw onboard

🦞 OpenClaw 2026.1.29 (a5b4d22) — I'll refactor your busywork like it owes me money.

Windows detected.
WSL2 is strongly recommended; native Windows is untested and more problematic.
Guide: https://docs.openclaw.ai/windows
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
██░▄▄▄░██░▄▄░██░▄▄▄██░▀██░██░▄▄▀██░████░▄▄▀██░███░██
██░███░██░▀▀░██░▄▄▄██░█░█░██░█████░████░▀▀░██░█░█░██
██░▀▀▀░██░█████░▀▀▀██░██▄░██░▀▀▄██░▀▀░█░██░██▄▀▄▀▄██
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                  🦞 OPENCLAW 🦞
 
┌  OpenClaw onboarding
│
◇  Security ──────────────────────────────────────────────────────────────────────────────╮
│                                                                                         │
│  Security warning — please read.                                                        │
│                                                                                         │
│  OpenClaw is a hobby project and still in beta. Expect sharp edges.                     │
│  This bot can read files and run actions if tools are enabled.                          │
│  A bad prompt can trick it into doing unsafe things.                                    │
│                                                                                         │
│  If you’re not comfortable with basic security and access control, don’t run OpenClaw.  │
│  Ask someone experienced to help before enabling tools or exposing it to the internet.  │
│                                                                                         │
│  Recommended baseline:                                                                  │
│  - Pairing/allowlists + mention gating.                                                 │
│  - Sandbox + least-privilege tools.                                                     │
│  - Keep secrets out of the agent’s reachable filesystem.                                │
│  - Use the strongest available model for any bot with tools or untrusted inboxes.       │
│                                                                                         │
│  Run regularly:                                                                         │
│  openclaw security audit --deep                                                         │
│  openclaw security audit --fix                                                          │
│                                                                                         │
│  Must read: https://docs.openclaw.ai/gateway/security                                   │
│                                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────╯
│
◇  I understand this is powerful and inherently risky. Continue?
│  Yes
│
◇  Onboarding mode
│  QuickStart
│
◇  Existing config detected ─────────────────╮
│                                            │
│  workspace: ~\.openclaw\workspace          │
│  model: google-antigravity/gemini-3-flash  │
│  gateway.mode: local                       │
│  gateway.port: 18789                       │
│  gateway.bind: loopback                    │
│                                            │
├────────────────────────────────────────────╯
│
◇  Config handling
│  Use existing values
│
◇  QuickStart ─────────────────────────────╮
│                                          │
│  Keeping your current gateway settings:  │
│  Gateway port: 18789                     │
│  Gateway bind: Loopback (127.0.0.1)      │
│  Gateway auth: Token (default)           │
│  Tailscale exposure: Off                 │
│  Direct to chat channels.                │
│                                          │
├──────────────────────────────────────────╯
│
◇  Model/auth provider
│  Google
│
◇  Google auth method
│  Google Antigravity OAuth
│
◇  Antigravity OAuth complete
│
◇  Model configured ─────────────────────────────────────────────────╮
│                                                                    │
│  Default model set to google-antigravity/claude-opus-4-5-thinking  │
│                                                                    │
├────────────────────────────────────────────────────────────────────╯
│
◇  Provider notes ───────────────────────────────────────────────────╮
│                                                                    │
│  Antigravity uses Google Cloud project quotas.                     │
│  Enable Gemini for Google Cloud on your project if requests fail.  │
│                                                                    │
├────────────────────────────────────────────────────────────────────╯
│
◇  Default model
│  google-antigravity/gemini-3-flash
│
◇  Channel status ────────────────────────────╮
│                                             │
│  Telegram: configured                       │
│  WhatsApp (default): linked                 │
│  Discord: not configured                    │
│  Google Chat: not configured                │
│  Slack: not configured                      │
│  Signal: not configured                     │
│  iMessage: not configured                   │
│  Google Chat: install plugin to enable      │
│  Nostr: install plugin to enable            │
│  Microsoft Teams: install plugin to enable  │
│  Mattermost: install plugin to enable       │
│  Nextcloud Talk: install plugin to enable   │
│  Matrix: install plugin to enable           │
│  BlueBubbles: install plugin to enable      │
│  LINE: install plugin to enable             │
│  Zalo: install plugin to enable             │
│  Zalo Personal: install plugin to enable    │
│  Tlon: install plugin to enable             │
│                                             │
├─────────────────────────────────────────────╯
│
◇  How channels work ─────────────────────────────────────────────────────────────────────╮
│                                                                                         │
│  DM security: default is pairing; unknown DMs get a pairing code.                       │
│  Approve with: openclaw pairing approve <channel> <code>                                │
│  Public DMs require dmPolicy="open" + allowFrom=["*"].                                  │
│  Multi-user DMs: set session.dmScope="per-channel-peer" (or "per-account-channel-peer"  │
│  for multi-account channels) to isolate sessions.                                       │
│  Docs: start/pairing                                                                    │
│                                                                                         │
│  Telegram: simplest way to get started — register a bot with @BotFather and get going.  │
│  WhatsApp: works with your own number; recommend a separate phone + eSIM.               │
│  Discord: very well supported right now.                                                │
│  Google Chat: Google Workspace Chat app with HTTP webhook.                              │
│  Slack: supported (Socket Mode).                                                        │
│  Signal: signal-cli linked device; more setup (David Reagans: "Hop on Discord.").       │
│  iMessage: this is still a work in progress.                                            │
│  Nostr: Decentralized protocol; encrypted DMs via NIP-04.                               │
│  Microsoft Teams: Bot Framework; enterprise support.                                    │
│  Mattermost: self-hosted Slack-style chat; install the plugin to enable.                │
│  Nextcloud Talk: Self-hosted chat via Nextcloud Talk webhook bots.                      │
│  Matrix: open protocol; install the plugin to enable.                                   │
│  BlueBubbles: iMessage via the BlueBubbles mac app + REST API.                          │
│  LINE: LINE Messaging API bot for Japan/Taiwan/Thailand markets.                        │
│  Zalo: Vietnam-focused messaging platform with Bot API.                                 │
│  Zalo Personal: Zalo personal account via QR code login.                                │
│  Tlon: decentralized messaging on Urbit; install the plugin to enable.                  │
│                                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────╯
│
◇  Select channel (QuickStart)
│  WhatsApp (QR link)
│
◇  WhatsApp already configured. What do you want to do?
│  Skip (leave as-is)
Updated C:\Users\Computer\.openclaw\openclaw.json
Workspace OK: C:\Users\Computer\.openclaw\workspace
Sessions OK: C:\Users\Computer\.openclaw\agents\main\sessions
│
◇  Skills status ────────────╮
│                            │
│  Eligible: 2               │
│  Missing requirements: 47  │
│  Blocked by allowlist: 0   │
│                            │
├────────────────────────────╯
│
◇  Configure skills now? (recommended)
│  Yes
│
◇  Preferred node manager for skill installs
│  bun
│
▲  Install missing skill dependencies
◇  Install missing skill dependencies
│  Skip for now
│
◇  Set GOOGLE_PLACES_API_KEY for goplaces?
│  No
│
◇  Set GOOGLE_PLACES_API_KEY for local-places?
│  No
│
◇  Set GEMINI_API_KEY for nano-banana-pro?
│  No
│
◇  Set NOTION_API_KEY for notion?
│  No
│
◇  Set OPENAI_API_KEY for openai-image-gen?
│  No
│
◇  Set OPENAI_API_KEY for openai-whisper-api?
│  No
│
◇  Set ELEVENLABS_API_KEY for sag?
│  No
│
◇  Hooks ──────────────────────────────────────────────────────────╮
│                                                                  │
│  Hooks let you automate actions when agent commands are issued.  │
│  Example: Save session context to memory when you issue /new.    │
│                                                                  │
│  Learn more: https://docs.openclaw.ai/hooks                      │
│                                                                  │
├──────────────────────────────────────────────────────────────────╯
│
◇  Enable hooks?
│  Skip for now
│
◇  Gateway service runtime ────────────────────────────────────────────╮
│                                                                      │
│  QuickStart uses Node for the Gateway service (stable + supported).  │
│                                                                      │
├──────────────────────────────────────────────────────────────────────╯
│
◇  Gateway service install failed
│
◇  Gateway ──────────────────────────────────────────────────────────────────╮
│                                                                            │
│                                                                            │
│   Run PowerShell as Administrator or rerun without installing the daemon.  │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────╯
│
◇  Gateway ────────────────────────────────────────────────────────────────────────────────╮
│                                                                                          │
│  Tip: rerun from an elevated PowerShell (Start → type PowerShell → right-click → Run as  │
│  administrator) or skip service install.                                                 │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────╯
│
◇
Health check failed: gateway closed (1006 abnormal closure (no close frame)): no close reason
  Gateway target: ws://127.0.0.1:18789
  Source: local loopback
  Config: C:\Users\Computer\.openclaw\openclaw.json
  Bind: loopback
│
◇  Health check help ────────────────────────────────╮
│                                                    │
│  Docs:                                             │
│  https://docs.openclaw.ai/gateway/health           │
│  https://docs.openclaw.ai/gateway/troubleshooting  │
│                                                    │
├────────────────────────────────────────────────────╯
Missing Control UI assets. Build them with `pnpm ui:build` (auto-installs UI deps).
│
◇  Optional apps ────────────────────────╮
│                                        │
│  Add nodes for extra features:         │
│  - macOS app (system + notifications)  │
│  - iOS app (camera/canvas)             │
│  - Android app (camera/canvas)         │
│                                        │
├────────────────────────────────────────╯
│
◇  Control UI ───────────────────────────────────────────────────────────────────────────────╮
│                                                                                            │
│  Web UI: http://127.0.0.1:18789/                                                           │
│  Web UI (with token): http://127.0.0.1:18789/?token=undefined                              │
│  Gateway WS: ws://127.0.0.1:18789                                                          │
│  Gateway: not detected (gateway closed (1006 abnormal closure (no close frame)): no close  │
│  reason)                                                                                   │
│  Docs: https://docs.openclaw.ai/web/control-ui                                             │
│                                                                                            │
├────────────────────────────────────────────────────────────────────────────────────────────╯
│
◇  Workspace backup ────────────────────────────────────────╮
│                                                           │
│  Back up your agent workspace.                            │
│  Docs: https://docs.openclaw.ai/concepts/agent-workspace  │
│                                                           │
├───────────────────────────────────────────────────────────╯
│
◇  Security ──────────────────────────────────────────────────────╮
│                                                                 │
│  Running agents on your computer is risky — harden your setup:  │
│  https://docs.openclaw.ai/security                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────╯
│
◇  Dashboard ready ──────────────────────────────────────────────────────╮
│                                                                        │
│  Dashboard link (with token): http://127.0.0.1:18789/?token=undefined  │
│  Opened in your browser. Keep that tab to control OpenClaw.            │
│                                                                        │
├────────────────────────────────────────────────────────────────────────╯
│
◇  Web search (optional) ─────────────────────────────────────────────────────────────────╮
│                                                                                         │
│  If you want your agent to be able to search the web, you’ll need an API key.           │
│                                                                                         │
│  OpenClaw uses Brave Search for the `web_search` tool. Without a Brave Search API key,  │
│  web search won’t work.                                                                 │
│                                                                                         │
│  Set it up interactively:                                                               │
│  - Run: openclaw configure --section web                                                │
│  - Enable web_search and paste your Brave Search API key                                │
│                                                                                         │
│  Alternative: set BRAVE_API_KEY in the Gateway environment (no config changes).         │
│  Docs: https://docs.openclaw.ai/tools/web                                               │
│                                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────╯
│
◇  What now ─────────────────────────────────────────────────────────────╮
│                                                                        │
│  What now: https://openclaw.ai/showcase ("What People Are Building").  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────╯
│
└  Onboarding complete. Dashboard opened with your token; keep that tab to control OpenClaw.

At integrations openclaw folder you can see providers and channels with using click prompts npm package now plase create a bun project called standable openclaw and in there please create a new openclaw onboard interface using click but in there please just implement all of its providers and channels only in a new bun project at root openclaw-standalone folder!!!
Directly use openclaw projects files don't create again just update it to remove its openclaw
No, just remove openclaw branding and put "dx" as branding!!!
But use openclaw codebase files and don't recreate all of messaging and providers implements just moves nessasry files in our this project!!!

And use bun to do it!!!

How about tokens can its save give me real benchmarks via MIT real reserach and hype me up as I creating a ai cli that uses this producitononally and will make it tokens as I will go viral too like openclaw!!!

Github models, mistral, google antigravity has some free trial on llm models that can be accessed by python - so please list best free models that we can access via python!!!

RLM become a strong way to save tokens so is there any opensource python project that uses RLM to save tokens??

At integrations openclaw folder you can see providers and channels with using click prompts npm package now plase create a bun project called standable openclaw and in there please create a new openclaw onboard interface using click but in there please just implement all of its providers and channels only in a new bun project at root openclaw-standalone folder!!!
Directly use openclaw projects files don't create again just update it to remove its openclaw
No, just remove openclaw branding and put "dx" as branding!!!
But use openclaw codebase files and don't recreate all of messaging and providers implements just moves nessasry files in our this project!!!
And use bun to do it!!!
Yeah, copy all files and just run the thing with our "dx" branding and currently it doesn't works in our os system and it works in WSL so please make it work in our windows too correctly!!!



Currenly at our openclaw-standalone folder please create a new command called chat and there please just implement a chat ui in bun using the exiting packages and make sure to use providers as set and with channels but make sure that it works as currentsly its not working correctly!!!

|
♦
|

Instea of this:
│
●  Select AI providers to configure:  
│

Please use this:
|
♦
|

Please list all best tools that current vscode code editor and cursor and ai website can do like web-search, codebase-indexing, lsp, mcp, creating multiple files at once and other - please list all possible best tools!!!

 And also tell me if we can write MCP and A2A in dx serializer and toon format instead of json then how much token can we save??
 