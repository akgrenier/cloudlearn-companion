import type { Exercise } from "../types.js";

export function validateAnswer(exercise: Exercise, answer: string): {
  correct: boolean;
  score: number;
  feedback: string;
} {
  const normalizedAnswer = answer.trim().toLowerCase();
  const { validation } = exercise;

  switch (validation.type) {
    case "command_match": {
      const matched = validation.criteria.filter((c) =>
        normalizedAnswer.includes(c.toLowerCase())
      );
      const score = matched.length / validation.criteria.length;
      return {
        correct: score >= 0.8,
        score: Math.round(score * 100),
        feedback:
          score >= 0.8
            ? `Correct! You matched ${matched.length}/${validation.criteria.length} key parts.`
            : `Almost! You matched ${matched.length}/${validation.criteria.length} key parts. Missing: ${validation.criteria
                .filter((c) => !normalizedAnswer.includes(c.toLowerCase()))
                .join(", ")}`,
      };
    }

    case "yaml_structure": {
      const matched = validation.criteria.filter((c) =>
        normalizedAnswer.includes(c.toLowerCase())
      );
      const score = matched.length / validation.criteria.length;
      return {
        correct: score >= 0.7,
        score: Math.round(score * 100),
        feedback:
          score >= 0.7
            ? `YAML structure looks good! ${matched.length}/${validation.criteria.length} elements found.`
            : `Your YAML is missing key elements: ${validation.criteria
                .filter((c) => !normalizedAnswer.includes(c.toLowerCase()))
                .join(", ")}`,
      };
    }

    case "keyword": {
      const matched = validation.criteria.filter((c) =>
        normalizedAnswer.includes(c.toLowerCase())
      );
      const score = matched.length / validation.criteria.length;
      return {
        correct: score >= 0.75,
        score: Math.round(score * 100),
        feedback:
          score >= 0.75
            ? `Good query! ${matched.length}/${validation.criteria.length} keywords present.`
            : `Your query is missing keywords: ${validation.criteria
                .filter((c) => !normalizedAnswer.includes(c.toLowerCase()))
                .join(", ")}`,
      };
    }

    default:
      return { correct: false, score: 0, feedback: "Unknown validation type." };
  }
}
