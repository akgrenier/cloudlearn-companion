interface Agent {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
}

interface Task {
  id: string;
  description: string;
  assignedTo: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: unknown;
}

interface OrchestrationState {
  agents: Map<string, Agent>;
  tasks: Map<string, Task>;
  currentWorkflow: string | null;
}

export class AgentOrchestrator {
  private state: OrchestrationState;

  constructor() {
    this.state = {
      agents: new Map(),
      tasks: new Map(),
      currentWorkflow: null,
    };
  }

  registerAgent(agent: Agent): void {
    this.state.agents.set(agent.id, agent);
    console.log(`Registered agent: ${agent.name} (${agent.role})`);
  }

  createTask(description: string): Task {
    const task: Task = {
      id: `task-${Date.now()}`,
      description,
      assignedTo: null,
      status: 'pending',
    };
    this.state.tasks.set(task.id, task);
    return task;
  }

  assignTask(taskId: string, agentId: string): boolean {
    const task = this.state.tasks.get(taskId);
    const agent = this.state.agents.get(agentId);

    if (!task || !agent) {
      return false;
    }

    task.assignedTo = agentId;
    task.status = 'in_progress';
    console.log(`Assigned task ${taskId} to agent ${agent.name}`);
    return true;
  }

  completeTask(taskId: string, result: unknown): boolean {
    const task = this.state.tasks.get(taskId);
    if (!task) {
      return false;
    }

    task.status = 'completed';
    task.result = result;
    console.log(`Task ${taskId} completed`);
    return true;
  }

  getAgentTasks(agentId: string): Task[] {
    return Array.from(this.state.tasks.values()).filter(
      (task) => task.assignedTo === agentId
    );
  }

  getWorkflowStatus(): { total: number; completed: number; inProgress: number } {
    const tasks = Array.from(this.state.tasks.values());
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    };
  }
}

// Demo usage
async function runDemo() {
  const orchestrator = new AgentOrchestrator();

  // Register agents
  orchestrator.registerAgent({
    id: 'coordinator',
    name: 'Coordinator',
    role: 'coordinator',
    capabilities: ['task_distribution', 'workflow_management'],
  });

  orchestrator.registerAgent({
    id: 'researcher',
    name: 'Researcher',
    role: 'researcher',
    capabilities: ['web_search', 'data_analysis'],
  });

  orchestrator.registerAgent({
    id: 'writer',
    name: 'Writer',
    role: 'writer',
    capabilities: ['content_creation', 'editing'],
  });

  // Create and assign tasks
  const researchTask = orchestrator.createTask('Research AI agent frameworks');
  orchestrator.assignTask(researchTask.id, 'researcher');

  const writingTask = orchestrator.createTask('Write summary of findings');
  orchestrator.assignTask(writingTask.id, 'writer');

  // Simulate completion
  setTimeout(() => {
    orchestrator.completeTask(researchTask.id, { findings: 'MCP is emerging standard' });
    console.log('Workflow status:', orchestrator.getWorkflowStatus());
  }, 1000);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo().catch(console.error);
}