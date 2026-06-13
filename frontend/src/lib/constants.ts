export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "STEMLab AI";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const EXPERIMENT_TYPES = {
  projectile_motion: "Projectile Motion",
  newtons_laws: "Newton's Laws",
  pendulum: "Pendulum",
  circuit: "Circuit Lab",
} as const;

export const SUBJECTS = {
  physics: { label: "Physics", color: "#3B82F6", icon: "atom" },
  chemistry: { label: "Chemistry", color: "#10B981", icon: "flask-conical" },
  mathematics: { label: "Mathematics", color: "#8B5CF6", icon: "calculator" },
} as const;

export const DIFFICULTY_COLORS = {
  beginner: "text-green-600 bg-green-50 border-green-200",
  intermediate: "text-yellow-600 bg-yellow-50 border-yellow-200",
  advanced: "text-red-600 bg-red-50 border-red-200",
} as const;

export const QUIZ_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export const QUIZ_QUESTION_TYPES = ["mcq", "numerical", "conceptual"] as const;
export const QUIZ_SUBJECTS = ["physics", "chemistry", "mathematics", "general"] as const;
