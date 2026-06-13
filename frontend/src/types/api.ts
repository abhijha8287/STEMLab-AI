export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, string>;
}

export interface Experiment {
  id: string;
  type: "projectile_motion" | "newtons_laws" | "pendulum" | "circuit";
  title: string;
  description?: string;
  status: "in_progress" | "completed" | "abandoned";
  session_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  result_count?: number;
}

export interface ExperimentResult {
  id: string;
  experiment_id: string;
  parameters: Record<string, unknown>;
  results: Record<string, unknown>;
  time_series?: Record<string, unknown>;
  ai_analysis?: string;
  run_duration_ms?: number;
  created_at: string;
}

export interface Report {
  id: string;
  experiment_id: string;
  result_id?: string;
  title: string;
  objective: string;
  methodology: string;
  observations: string;
  results_text: string;
  analysis: string;
  conclusion: string;
  raw_parameters: Record<string, unknown>;
  raw_results: Record<string, unknown>;
  pdf_url?: string;
  pdf_generated: boolean;
  pdf_size_bytes?: number;
  created_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  subject: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  question_count: number;
  questions?: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question_number: number;
  question_type: "mcq" | "numerical" | "conceptual";
  question_text: string;
  options?: string[];
  topic_tag?: string;
  difficulty: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  correct_count: number;
  time_taken_secs?: number;
  completed: boolean;
  created_at: string;
  completed_at?: string;
}

export interface AIConversation {
  id: string;
  title?: string;
  context_type?: string;
  context_id?: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  messages?: AIMessage[];
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ConceptNode {
  id: string;
  slug: string;
  name: string;
  subject: "physics" | "chemistry" | "mathematics";
  category: string;
  description?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon?: string;
  color?: string;
  prerequisite_count?: number;
  related_count?: number;
}

export interface DashboardStats {
  totals: {
    experiments_run: number;
    physics_experiments: number;
    circuit_experiments: number;
    reports_generated: number;
    quizzes_taken: number;
  };
  quiz_performance: {
    average_score: number;
    best_score: number;
    worst_score: number;
    total_attempts: number;
  };
  learning_progress: {
    concepts_explored: number;
    knowledge_gaps_detected: number;
    knowledge_gaps_resolved: number;
  };
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  type: string;
  description: string;
  entity_id?: string;
  timestamp: string;
}
