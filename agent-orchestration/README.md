# Agent Orchestration Demo

A demonstration of multi-agent coordination using Model Context Protocol (MCP).

## Overview

This demo shows how multiple AI agents can work together to solve complex tasks:

1. **Coordinator Agent** - Manages the workflow and distributes tasks
2. **Researcher Agent** - Gathers information and data
3. **Writer Agent** - Produces content based on research
4. **Reviewer Agent** - Quality checks and provides feedback

## Architecture

```
┌─────────────────┐
│   Coordinator   │
│     Agent       │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│Research│ │Writer │
│ Agent  │ │ Agent │
└───────┘ └───────┘
    │         │
    └────┬────┘
         │
    ┌────▼────┐
    │Reviewer │
    │ Agent   │
    └─────────┘
```

## Quick Start

```bash
# Install dependencies
npm install

# Run the orchestration demo
npm run demo

# Run with specific task
npm run demo -- --task "Write a blog post about AI agents"
```

## Configuration

Edit `config/agents.json` to customize agent behaviors and capabilities.