# CloudLearn Companion — 2-Minute Demo Script

## Opening Hook (0:00–0:15)
**[Screen: Empty terminal]**

"Learning Kubernetes, Istio, and Prometheus from docs alone is painful. What if your AI assistant could teach you interactively — with real exercises, instant feedback, and progress badges?"

**[Show MCP logo]**

"Meet CloudLearn Companion — an MCP server that turns any AI assistant into a cloud-native learning tutor."

## Problem & Solution (0:15–0:30)
**[Screen: Split — left shows dense docs, right shows chat interface]**

"Cloud docs are dense. Tutorials are static. You read, you forget, you never practice.

CloudLearn Companion changes that. It connects to your AI assistant via MCP and delivers hands-on exercises — kubectl commands, YAML manifests, troubleshooting scenarios — with instant scoring."

## Live Demo (0:30–1:30)
**[Screen: MCP-enabled chat client]**

### Part 1: Browse Tracks (0:30–0:45)
"Let's see what's available."

> User: What learning tracks do you have?
> AI: *lists 3 tracks with exercise counts*

"I can learn Kubernetes, Istio, or Prometheus. Let's start with K8s."

### Part 2: Learn a Concept (0:45–1:00)
"Teach me about Kubernetes Deployments."

> AI: *Shows concept explanation with kubectl commands, rolling updates, rollbacks*

"Clean explanations with real commands I can copy."

### Part 3: Try an Exercise (1:00–1:15)
"Give me a Kubernetes exercise."

> AI: *Presents exercise: 'Create a deployment with 3 replicas'*

> User: kubectl create deployment frontend --image=node:20-alpine --replicas=3
> AI: "Correct! Score: 100%. Solution matches perfectly."

### Part 4: Check Progress (1:15–1:25)
"How am I doing?"

> AI: *Shows progress dashboard — completed exercises, streak, badges*

"I just earned my First Steps badge!"

## Technical Highlights (1:25–1:45)
**[Screen: Architecture diagram]**

"Under the hood: 8 MCP tools, 3 learning tracks, 10+ exercises, YAML validation, keyword matching, progress tracking with a badge system.

Built with the MCP SDK. Works with any MCP-compatible client — Claude Desktop, VS Code extensions, custom integrations."

## CTA (1:45–2:00)
**[Screen: GitHub repo + demo link]**

"CloudLearn Companion — learn cloud-native by doing, not reading.

Star the repo, connect your MCP client, and start earning badges today."

**[End card with project name and hackathon logo]**

## Visual Notes
- Screen recordings of actual MCP client interaction
- Show real terminal output with kubectl commands
- Keep overlays minimal, focus on the conversation flow
- Blue/green color palette matching cloud-native branding

## Audio Notes
- Clear, enthusiastic narration at ~150 wpm
- Emphasize "interactive" and "hands-on" moments
- Natural pauses after exercise completions
