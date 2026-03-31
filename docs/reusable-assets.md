# Reusable Assets for MCP Hack 26

## Available From Existing Projects

### 1. TypeScript/Node.js Configuration
- `tsconfig.json` - ES2022, ESNext modules, strict mode
- `package.json` scripts pattern: build, dev, test, lint
- ESM module setup with proper imports

### 2. MCP SDK Integration
- `@modelcontextprotocol/sdk` already configured
- Tool schema definitions pattern
- Request handler registration pattern
- Stdio transport setup

### 3. Agent Orchestration Patterns
- Task management with status tracking
- Agent registration and capability definition
- Workflow orchestration with dependencies
- Multi-agent coordination patterns

### 4. Documentation Templates
- README structure for quick onboarding
- Demo script template (2-min format)
- Architecture diagrams (Mermaid format)
- Best practices summary from CNCF

### 5. Development Workflow
- Build scripts (tsc, tsx watch)
- Type checking configuration
- Testing setup (vitest)
- Linting configuration

## Quick Start Commands

```bash
# Clone/use the starter
cd mcp-hack26-starter

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Run tests
npm test
```

## Files to Reuse

1. **`tsconfig.json`** - Copy and modify for new MCP servers
2. **`src/index.ts`** - Base MCP server template
3. **`agent-orchestration/src/orchestrator.ts`** - Multi-agent coordination
4. **`docs/demo-script.md`** - Video script template
5. **`docs/mcp-best-practices.md`** - Reference for implementation

## Extension Points

### Add New Tools
```typescript
// Add to tools array in src/index.ts
{
  name: "your_tool",
  description: "What it does",
  inputSchema: {
    type: "object",
    properties: {
      param1: { type: "string", description: "..." }
    },
    required: ["param1"]
  }
}
```

### Add New Agents
```typescript
// Register in orchestrator
orchestrator.registerAgent({
  id: "specialist",
  name: "Specialist",
  role: "specialist",
  capabilities: ["specific_skill"]
});
```

### Add Resources
```typescript
// MCP supports resources in addition to tools
// See SDK docs for resource handlers
```

## Hackathon Timeline Suggestions

**Day 1 (Setup)**
- [ ] Use starter template as base
- [ ] Define core tools for your use case
- [ ] Set up agent roles

**Day 2 (Implementation)**
- [ ] Implement tool handlers
- [ ] Test with MCP inspector
- [ ] Add error handling

**Day 3 (Polish)**
- [ ] Record demo
- [ ] Write README
- [ ] Prepare presentation