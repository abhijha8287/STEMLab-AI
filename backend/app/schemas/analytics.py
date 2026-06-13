from pydantic import BaseModel


class TotalsData(BaseModel):
    experiments_run: int
    physics_experiments: int
    circuit_experiments: int
    reports_generated: int
    quizzes_taken: int


class QuizPerformanceData(BaseModel):
    average_score: float
    best_score: float
    worst_score: float
    total_attempts: int


class LearningProgressData(BaseModel):
    concepts_explored: int
    knowledge_gaps_detected: int
    knowledge_gaps_resolved: int


class ActivityItem(BaseModel):
    type: str
    description: str
    entity_id: str | None = None
    entity_type: str | None = None
    timestamp: str


class DashboardResponse(BaseModel):
    totals: TotalsData
    quiz_performance: QuizPerformanceData
    learning_progress: LearningProgressData
    recent_activity: list[ActivityItem]


class DailyCount(BaseModel):
    date: str
    count: int


class ExperimentUsageResponse(BaseModel):
    period: str
    by_type: dict[str, int]
    by_day: list[DailyCount]


class TopicPerformance(BaseModel):
    average: float
    attempts: int


class ScoreTrendItem(BaseModel):
    date: str
    score: float
    topic: str


class QuizPerformanceResponse(BaseModel):
    score_trend: list[ScoreTrendItem]
    by_topic: dict[str, TopicPerformance]


class SubjectMastery(BaseModel):
    physics: float
    chemistry: float
    mathematics: float


class ProgressResponse(BaseModel):
    concepts_mastered: list[str]
    concepts_in_progress: list[str]
    concepts_not_started: list[str]
    mastery_by_subject: SubjectMastery
    progress_over_time: list[DailyCount]
