import type { Track, Exercise } from "../types.js";
import { k8sTrack } from "./k8s.js";
import { istioTrack } from "./istio.js";
import { prometheusTrack } from "./prometheus.js";

export const allTracks: Track[] = [k8sTrack, istioTrack, prometheusTrack];

export function getTrack(trackId: string): Track | undefined {
  return allTracks.find((t) => t.id === trackId);
}

export function getModule(trackId: string, moduleId: string) {
  const track = getTrack(trackId);
  return track?.modules.find((m) => m.id === moduleId);
}

export function getExercise(
  trackId: string,
  exerciseId: string
): Exercise | undefined {
  const track = getTrack(trackId);
  for (const mod of track?.modules ?? []) {
    const ex = mod.exercises.find((e) => e.id === exerciseId);
    if (ex) return ex;
  }
  return undefined;
}

export function getAllExercises(): Exercise[] {
  const exercises: Exercise[] = [];
  for (const track of allTracks) {
    for (const mod of track.modules) {
      exercises.push(...mod.exercises);
    }
  }
  return exercises;
}
