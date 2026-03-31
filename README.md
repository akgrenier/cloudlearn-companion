# CloudLearn Companion

**Interactive Cloud-Native Learning Agent** — MCP Hack 26 Submission

An MCP server that turns any AI assistant into an interactive cloud-native learning tutor. Covers Kubernetes, Istio, and Prometheus with hands-on exercises, progress tracking, and skill badges.

## Features

- **3 Learning Tracks**: Kubernetes Fundamentals, Istio Service Mesh, Prometheus & Observability
- **Interactive Exercises**: kubectl commands and YAML manifest challenges
- **Instant Feedback**: Answer validation with scoring and hints
- **Progress Tracking**: Track completion across tracks and earn skill badges
- **Documentation Search**: Find concepts and exercises by topic

## MCP Tools

| Tool | Description |
|------|-------------|
| `list_tracks` | Browse available learning tracks |
| `get_learning_path` | Get modules and concepts for a track |
| `get_concept` | Detailed explanation with examples and commands |
| `get_exercise` | Get a hands-on exercise (kubectl or YAML) |
| `check_answer` | Submit and validate your answer |
| `get_hint` | Stuck? Get a hint |
| `get_progress` | View progress and earned badges |
| `search_docs` | Search all learning content |

## Quick Start

```bash
# Install
npm install

# Build
npm run build

# Connect to MCP client
node dist/index.js
```

## Badge System

- **First Steps** — Complete your first exercise
- **On Fire** — 5 exercises in a row
- **Kubernetes Master** — All K8s exercises
- **Istio Master** — All Istio exercises
- **Prometheus Master** — All Prometheus exercises
- **Cloud Native Expert** — Complete all tracks

## Deploy with kagent

CloudLearn Companion integrates with [kagent](https://kagent.dev) — deploy it as a Kubernetes-native AI agent in seconds.

```bash
# Apply the MCP server resource
kubectl apply -f kagent/mcpserver.yaml

# Apply the CloudLearn tutor agent
kubectl apply -f kagent/agent.yaml

# Open kagent dashboard and start learning
kagent dashboard
```

The `cloudlearn-tutor` agent uses all 8 CloudLearn tools and can guide users through Kubernetes, Istio, and Prometheus learning tracks interactively.

## Hackathon

MCP Hack 26 — "Building Cool Agents" category
Deadline: Apr 3 | 2-min demo video required
