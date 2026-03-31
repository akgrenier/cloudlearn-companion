import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { allTracks, getTrack, getModule, getExercise } from "./tracks/index.js";
import { validateAnswer } from "./exercises/validator.js";
import { getProgress, completeExercise } from "./progress/tracker.js";

const tools = [
  {
    name: "list_tracks",
    description: "List all available cloud-native learning tracks (Kubernetes, Istio, Prometheus)",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_learning_path",
    description: "Get the learning path for a specific track with modules and concepts",
    inputSchema: {
      type: "object" as const,
      properties: {
        track_id: {
          type: "string" as const,
          description: "Track ID: k8s, istio, or prometheus",
        },
      },
      required: ["track_id"],
    },
  },
  {
    name: "get_concept",
    description: "Get a detailed concept explanation with examples and commands",
    inputSchema: {
      type: "object" as const,
      properties: {
        track_id: {
          type: "string" as const,
          description: "Track ID: k8s, istio, or prometheus",
        },
        module_id: {
          type: "string" as const,
          description: "Module ID from the track",
        },
        concept_id: {
          type: "string" as const,
          description: "Concept ID within the module",
        },
      },
      required: ["track_id", "module_id", "concept_id"],
    },
  },
  {
    name: "get_exercise",
    description: "Get an interactive exercise for practice (kubectl commands or YAML manifests)",
    inputSchema: {
      type: "object" as const,
      properties: {
        track_id: {
          type: "string" as const,
          description: "Track ID: k8s, istio, or prometheus",
        },
        exercise_id: {
          type: "string" as const,
          description: "Optional specific exercise ID, or omit for next available",
        },
      },
      required: ["track_id"],
    },
  },
  {
    name: "check_answer",
    description: "Submit an answer for an exercise and get scored feedback",
    inputSchema: {
      type: "object" as const,
      properties: {
        track_id: {
          type: "string" as const,
          description: "Track ID: k8s, istio, or prometheus",
        },
        exercise_id: {
          type: "string" as const,
          description: "Exercise ID to check",
        },
        answer: {
          type: "string" as const,
          description: "Your kubectl command or YAML manifest",
        },
        user_id: {
          type: "string" as const,
          description: "User ID for progress tracking (default: 'default')",
        },
      },
      required: ["track_id", "exercise_id", "answer"],
    },
  },
  {
    name: "get_hint",
    description: "Get a hint for the current exercise",
    inputSchema: {
      type: "object" as const,
      properties: {
        track_id: {
          type: "string" as const,
          description: "Track ID",
        },
        exercise_id: {
          type: "string" as const,
          description: "Exercise ID",
        },
        hint_index: {
          type: "number" as const,
          description: "Which hint (0-based index)",
        },
      },
      required: ["track_id", "exercise_id"],
    },
  },
  {
    name: "get_progress",
    description: "Get user progress, completed exercises, and earned badges",
    inputSchema: {
      type: "object" as const,
      properties: {
        user_id: {
          type: "string" as const,
          description: "User ID (default: 'default')",
        },
      },
      required: [],
    },
  },
  {
    name: "search_docs",
    description: "Search across all learning content for a topic",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string" as const,
          description: "Search query (e.g., 'rolling update', 'mTLS', 'PromQL')",
        },
      },
      required: ["query"],
    },
  },
];

const server = new Server(
  {
    name: "cloudlearn-companion",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = (args ?? {}) as Record<string, unknown>;

  switch (name) {
    case "list_tracks": {
      const summary = allTracks
        .map(
          (t) =>
            `${t.icon} **${t.name}** (${t.id})\n  ${t.description}\n  ${t.modules.length} modules, ${t.modules.reduce((s, m) => s + m.exercises.length, 0)} exercises`
        )
        .join("\n\n");
      return textResponse(`# CloudLearn Tracks\n\n${summary}`);
    }

    case "get_learning_path": {
      const track = getTrack(String(a.track_id));
      if (!track) return textResponse(`Track "${a.track_id}" not found. Available: k8s, istio, prometheus`);
      const modules = track.modules
        .map(
          (m, i) =>
            `### ${i + 1}. ${m.title}\n${m.description}\n- Concepts: ${m.concepts.map((c) => c.title).join(", ")}\n- Exercises: ${m.exercises.length}`
        )
        .join("\n\n");
      return textResponse(
        `# ${track.icon} ${track.name}\n\n${track.description}\n\n## Modules\n\n${modules}`
      );
    }

    case "get_concept": {
      const track = getTrack(String(a.track_id));
      if (!track) return textResponse("Track not found.");
      const mod = getModule(String(a.track_id), String(a.module_id));
      if (!mod) return textResponse("Module not found.");
      const concept = mod.concepts.find((c) => c.id === String(a.concept_id));
      if (!concept) return textResponse("Concept not found.");

      let output = `# ${concept.title}\n\n${concept.explanation}`;
      if (concept.commands?.length) {
        output += `\n\n## Commands\n\n${concept.commands.map((c) => `\`${c.command}\`\n  ${c.description}`).join("\n\n")}`;
      }
      if (concept.yamlExample) {
        output += `\n\n## Example YAML\n\n\`\`\`yaml\n${concept.yamlExample}\n\`\`\``;
      }
      return textResponse(output);
    }

    case "get_exercise": {
      const trackId = String(a.track_id);
      const track = getTrack(trackId);
      if (!track) return textResponse("Track not found.");

      let exercise;
      if (a.exercise_id) {
        exercise = getExercise(trackId, String(a.exercise_id));
      } else {
        // Return first exercise from first module
        for (const mod of track.modules) {
          if (mod.exercises.length > 0) {
            exercise = mod.exercises[0];
            break;
          }
        }
      }
      if (!exercise) return textResponse("No exercise found.");

      let output = `# ${exercise.title}\n\n**Type:** ${exercise.type}\n\n${exercise.prompt}\n\n**Context:** ${exercise.context}`;
      return textResponse(output);
    }

    case "check_answer": {
      const trackId = String(a.track_id);
      const exerciseId = String(a.exercise_id);
      const answer = String(a.answer);
      const userId = a.user_id ? String(a.user_id) : "default";

      const exercise = getExercise(trackId, exerciseId);
      if (!exercise) return textResponse("Exercise not found.");

      const result = validateAnswer(exercise, answer);
      if (result.correct) {
        completeExercise(userId, trackId, exerciseId, result.score);
      }
      const icon = result.correct ? "✅" : "❌";
      let output = `${icon} **Score: ${result.score}%**\n\n${result.feedback}`;
      if (result.correct) {
        output += `\n\n**Solution:**\n\`\`\`\n${exercise.solution}\n\`\`\``;
      }
      return textResponse(output);
    }

    case "get_hint": {
      const trackId = String(a.track_id);
      const exerciseId = String(a.exercise_id);
      const hintIndex = a.hint_index !== undefined ? Number(a.hint_index) : 0;

      const exercise = getExercise(trackId, exerciseId);
      if (!exercise) return textResponse("Exercise not found.");
      if (hintIndex >= exercise.hints.length) {
        return textResponse("No more hints available.");
      }
      return textResponse(`💡 **Hint ${hintIndex + 1}/${exercise.hints.length}:**\n\n${exercise.hints[hintIndex]}`);
    }

    case "get_progress": {
      const userId = a.user_id ? String(a.user_id) : "default";
      const progress = getProgress(userId);

      const trackSummaries = progress.tracks
        .map((tp) => {
          const track = allTracks.find((t) => t.id === tp.trackId);
          const total = track?.modules.reduce((s, m) => s + m.exercises.length, 0) ?? 0;
          return `${track?.icon ?? ""} **${track?.name ?? tp.trackId}:** ${tp.completedExercises.length}/${total} exercises, Score: ${tp.score}`;
        })
        .join("\n");

      const badges = progress.badges.length
        ? progress.badges.map((b) => `${b.icon} **${b.name}** — ${b.description}`).join("\n")
        : "No badges earned yet. Complete exercises to earn badges!";

      return textResponse(
        `# Your Progress\n\n**Total:** ${progress.completedExercises}/${progress.totalExercises} exercises completed\n**Streak:** ${progress.streak} 🔥\n\n## Tracks\n\n${trackSummaries}\n\n## Badges\n\n${badges}`
      );
    }

    case "search_docs": {
      const query = String(a.query).toLowerCase();
      const results: string[] = [];

      for (const track of allTracks) {
        for (const mod of track.modules) {
          for (const concept of mod.concepts) {
            if (
              concept.title.toLowerCase().includes(query) ||
              concept.explanation.toLowerCase().includes(query)
            ) {
              results.push(`${track.icon} [${track.name}] **${concept.title}** (${mod.title})`);
            }
          }
          for (const ex of mod.exercises) {
            if (
              ex.title.toLowerCase().includes(query) ||
              ex.prompt.toLowerCase().includes(query)
            ) {
              results.push(`${track.icon} [Exercise] **${ex.title}** (${mod.title})`);
            }
          }
        }
      }

      if (results.length === 0) {
        return textResponse(`No results found for "${a.query}".`);
      }
      return textResponse(`# Search Results for "${a.query}"\n\n${results.join("\n")}`);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

function textResponse(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CloudLearn Companion MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
