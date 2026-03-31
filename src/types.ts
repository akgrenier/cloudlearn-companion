export interface Track {
  id: string;
  name: string;
  description: string;
  icon: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  concepts: Concept[];
  exercises: Exercise[];
}

export interface Concept {
  id: string;
  title: string;
  explanation: string;
  commands?: Command[];
  yamlExample?: string;
}

export interface Command {
  command: string;
  description: string;
  output?: string;
}

export interface Exercise {
  id: string;
  type: "kubectl" | "yaml" | "troubleshoot";
  title: string;
  prompt: string;
  context: string;
  hints: string[];
  solution: string;
  validation: ExerciseValidation;
}

export interface ExerciseValidation {
  type: "command_match" | "yaml_structure" | "keyword";
  criteria: string[];
}

export interface UserProgress {
  userId: string;
  tracks: TrackProgress[];
  badges: Badge[];
  totalExercises: number;
  completedExercises: number;
  streak: number;
  lastActive: string;
}

export interface TrackProgress {
  trackId: string;
  completedModules: string[];
  completedExercises: string[];
  score: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}
