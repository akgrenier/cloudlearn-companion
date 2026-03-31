import type { UserProgress, TrackProgress, Badge } from "../types.js";
import { allTracks, getAllExercises } from "../tracks/index.js";

const store = new Map<string, UserProgress>();

const BADGES: Badge[] = [];

function ensureProgress(userId: string): UserProgress {
  let progress = store.get(userId);
  if (progress) return progress;

  progress = {
    userId,
    tracks: allTracks.map((t) => ({
      trackId: t.id,
      completedModules: [],
      completedExercises: [],
      score: 0,
    })),
    badges: [],
    totalExercises: getAllExercises().length,
    completedExercises: 0,
    streak: 0,
    lastActive: new Date().toISOString(),
  };
  store.set(userId, progress);
  return progress;
}

export function getProgress(userId: string): UserProgress {
  return ensureProgress(userId);
}

export function completeExercise(
  userId: string,
  trackId: string,
  exerciseId: string,
  score: number
): UserProgress {
  const progress = ensureProgress(userId);
  const trackProgress = progress.tracks.find((t) => t.trackId === trackId);
  if (!trackProgress) return progress;

  if (!trackProgress.completedExercises.includes(exerciseId)) {
    trackProgress.completedExercises.push(exerciseId);
    trackProgress.score += score;
    progress.completedExercises += 1;
    progress.streak += 1;
  }

  progress.lastActive = new Date().toISOString();
  checkBadges(progress);
  return progress;
}

function checkBadges(progress: UserProgress): void {
  const earned = progress.badges.map((b) => b.id);

  if (progress.completedExercises >= 1 && !earned.includes("first-steps")) {
    progress.badges.push({
      id: "first-steps",
      name: "First Steps",
      icon: "🚀",
      description: "Completed your first exercise",
      earnedAt: new Date().toISOString(),
    });
  }

  if (progress.streak >= 5 && !earned.includes("on-fire")) {
    progress.badges.push({
      id: "on-fire",
      name: "On Fire",
      icon: "🔥",
      description: "5 exercises in a row",
      earnedAt: new Date().toISOString(),
    });
  }

  for (const tp of progress.tracks) {
    const track = allTracks.find((t) => t.id === tp.trackId);
    if (!track) continue;
    const totalExercises = track.modules.reduce(
      (sum, m) => sum + m.exercises.length,
      0
    );
    if (
      tp.completedExercises.length >= totalExercises &&
      !earned.includes(`${tp.trackId}-master`)
    ) {
      progress.badges.push({
        id: `${tp.trackId}-master`,
        name: `${track.name} Master`,
        icon: track.icon,
        description: `Completed all exercises in ${track.name}`,
        earnedAt: new Date().toISOString(),
      });
    }
  }

  if (
    progress.completedExercises >= progress.totalExercises &&
    !earned.includes("cloud-native")
  ) {
    progress.badges.push({
      id: "cloud-native",
      name: "Cloud Native Expert",
      icon: "☁️",
      description: "Completed all tracks",
      earnedAt: new Date().toISOString(),
    });
  }
}
