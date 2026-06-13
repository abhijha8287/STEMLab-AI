"""Initial database schema

Revision ID: 0001
Revises:
Create Date: 2026-06-12
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    op.create_table(
        "experiments",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("type", sa.String(50), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("status", sa.String(20), nullable=False, server_default="in_progress"),
        sa.Column("session_id", sa.String(100)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
    )
    op.create_index("idx_experiments_type", "experiments", ["type"])
    op.create_index("idx_experiments_session", "experiments", ["session_id"])
    op.create_index("idx_experiments_created", "experiments", [sa.text("created_at DESC")])

    op.create_table(
        "experiment_results",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("experiment_id", UUID(as_uuid=True), sa.ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("parameters", JSONB, nullable=False),
        sa.Column("results", JSONB, nullable=False),
        sa.Column("time_series", JSONB),
        sa.Column("ai_analysis", sa.Text),
        sa.Column("error_details", sa.Text),
        sa.Column("run_duration_ms", sa.Integer),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
    )
    op.create_index("idx_experiment_results_experiment", "experiment_results", ["experiment_id"])
    op.create_index("idx_experiment_results_created", "experiment_results", [sa.text("created_at DESC")])

    op.create_table(
        "reports",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("experiment_id", UUID(as_uuid=True), sa.ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("result_id", UUID(as_uuid=True), sa.ForeignKey("experiment_results.id", ondelete="SET NULL")),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("session_id", sa.String(100)),
        sa.Column("objective", sa.Text, nullable=False),
        sa.Column("methodology", sa.Text, nullable=False),
        sa.Column("observations", sa.Text, nullable=False),
        sa.Column("results_text", sa.Text, nullable=False),
        sa.Column("analysis", sa.Text, nullable=False),
        sa.Column("conclusion", sa.Text, nullable=False),
        sa.Column("raw_parameters", JSONB, nullable=False),
        sa.Column("raw_results", JSONB, nullable=False),
        sa.Column("pdf_url", sa.Text),
        sa.Column("pdf_generated", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("pdf_size_bytes", sa.Integer),
        sa.Column("generated_by_ai", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
    )
    op.create_index("idx_reports_experiment", "reports", ["experiment_id"])
    op.create_index("idx_reports_session", "reports", ["session_id"])
    op.create_index("idx_reports_created", "reports", [sa.text("created_at DESC")])

    op.create_table(
        "quizzes",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("topic", sa.String(100), nullable=False),
        sa.Column("subject", sa.String(50), nullable=False),
        sa.Column("difficulty", sa.String(20), nullable=False),
        sa.Column("question_count", sa.Integer, nullable=False),
        sa.Column("session_id", sa.String(100)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
    )
    op.create_index("idx_quizzes_topic", "quizzes", ["topic"])
    op.create_index("idx_quizzes_subject", "quizzes", ["subject"])
    op.create_index("idx_quizzes_session", "quizzes", ["session_id"])
    op.create_index("idx_quizzes_created", "quizzes", [sa.text("created_at DESC")])

    op.create_table(
        "quiz_questions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("quiz_id", UUID(as_uuid=True), sa.ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_number", sa.Integer, nullable=False),
        sa.Column("question_type", sa.String(20), nullable=False),
        sa.Column("question_text", sa.Text, nullable=False),
        sa.Column("options", JSONB),
        sa.Column("correct_answer", sa.Text, nullable=False),
        sa.Column("explanation", sa.Text, nullable=False),
        sa.Column("topic_tag", sa.String(100)),
        sa.Column("difficulty", sa.String(20), nullable=False),
        sa.UniqueConstraint("quiz_id", "question_number"),
    )
    op.create_index("idx_quiz_questions_quiz", "quiz_questions", ["quiz_id"])
    op.create_index("idx_quiz_questions_topic", "quiz_questions", ["topic_tag"])

    op.create_table(
        "quiz_attempts",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("quiz_id", UUID(as_uuid=True), sa.ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("session_id", sa.String(100)),
        sa.Column("score", sa.Numeric(5, 2), nullable=False, server_default="0"),
        sa.Column("total_questions", sa.Integer, nullable=False),
        sa.Column("correct_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("time_taken_secs", sa.Integer),
        sa.Column("completed", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
    )
    op.create_index("idx_quiz_attempts_quiz", "quiz_attempts", ["quiz_id"])
    op.create_index("idx_quiz_attempts_session", "quiz_attempts", ["session_id"])
    op.create_index("idx_quiz_attempts_created", "quiz_attempts", [sa.text("created_at DESC")])

    op.create_table(
        "quiz_answers",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("attempt_id", UUID(as_uuid=True), sa.ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("question_id", UUID(as_uuid=True), sa.ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("submitted_answer", sa.Text, nullable=False),
        sa.Column("is_correct", sa.Boolean, nullable=False),
        sa.Column("time_taken_secs", sa.Integer),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.UniqueConstraint("attempt_id", "question_id"),
    )
    op.create_index("idx_quiz_answers_attempt", "quiz_answers", ["attempt_id"])
    op.create_index("idx_quiz_answers_question", "quiz_answers", ["question_id"])

    op.create_table(
        "ai_conversations",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("session_id", sa.String(100)),
        sa.Column("title", sa.String(255)),
        sa.Column("context_type", sa.String(50)),
        sa.Column("context_id", UUID(as_uuid=True)),
        sa.Column("message_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
    )
    op.create_index("idx_ai_conversations_session", "ai_conversations", ["session_id"])
    op.create_index("idx_ai_conversations_context", "ai_conversations", ["context_type", "context_id"])
    op.create_index("idx_ai_conversations_created", "ai_conversations", [sa.text("created_at DESC")])

    op.create_table(
        "ai_messages",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("conversation_id", UUID(as_uuid=True), sa.ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role", sa.String(10), nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("token_count", sa.Integer),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
    )
    op.create_index("idx_ai_messages_conversation", "ai_messages", ["conversation_id"])
    op.create_index("idx_ai_messages_created", "ai_messages", ["created_at"])

    op.create_table(
        "analytics_events",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("event_type", sa.String(100), nullable=False),
        sa.Column("session_id", sa.String(100)),
        sa.Column("entity_type", sa.String(50)),
        sa.Column("entity_id", UUID(as_uuid=True)),
        sa.Column("properties", JSONB),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
    )
    op.create_index("idx_analytics_events_type", "analytics_events", ["event_type"])
    op.create_index("idx_analytics_events_session", "analytics_events", ["session_id"])
    op.create_index("idx_analytics_events_created", "analytics_events", [sa.text("created_at DESC")])
    op.create_index("idx_analytics_events_entity", "analytics_events", ["entity_type", "entity_id"])

    op.create_table(
        "concept_nodes",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("slug", sa.String(100), nullable=False, unique=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("subject", sa.String(50), nullable=False),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("difficulty", sa.String(20), nullable=False, server_default="beginner"),
        sa.Column("icon", sa.String(50)),
        sa.Column("color", sa.String(7)),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
    )
    op.create_index("idx_concept_nodes_subject", "concept_nodes", ["subject"])
    op.create_index("idx_concept_nodes_category", "concept_nodes", ["category"])
    op.create_index("idx_concept_nodes_slug", "concept_nodes", ["slug"], unique=True)

    op.create_table(
        "concept_edges",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("from_concept_id", UUID(as_uuid=True), sa.ForeignKey("concept_nodes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("to_concept_id", UUID(as_uuid=True), sa.ForeignKey("concept_nodes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("relationship", sa.String(50), nullable=False),
        sa.Column("strength", sa.Numeric(3, 2), nullable=False, server_default="1.0"),
        sa.UniqueConstraint("from_concept_id", "to_concept_id", "relationship"),
    )
    op.create_index("idx_concept_edges_from", "concept_edges", ["from_concept_id"])
    op.create_index("idx_concept_edges_to", "concept_edges", ["to_concept_id"])

    op.create_table(
        "knowledge_gaps",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("uuid_generate_v4()")),
        sa.Column("session_id", sa.String(100), nullable=False),
        sa.Column("concept_id", UUID(as_uuid=True), sa.ForeignKey("concept_nodes.id", ondelete="SET NULL")),
        sa.Column("concept_slug", sa.String(100), nullable=False),
        sa.Column("gap_type", sa.String(50), nullable=False),
        sa.Column("severity", sa.String(20), nullable=False),
        sa.Column("evidence", JSONB),
        sa.Column("recommendation", sa.Text),
        sa.Column("resolved", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()"), nullable=False),
        sa.Column("resolved_at", sa.DateTime(timezone=True)),
    )
    op.create_index("idx_knowledge_gaps_session", "knowledge_gaps", ["session_id"])
    op.create_index("idx_knowledge_gaps_concept", "knowledge_gaps", ["concept_slug"])
    op.create_index("idx_knowledge_gaps_severity", "knowledge_gaps", ["severity"])


def downgrade() -> None:
    op.drop_table("knowledge_gaps")
    op.drop_table("concept_edges")
    op.drop_table("concept_nodes")
    op.drop_table("analytics_events")
    op.drop_table("ai_messages")
    op.drop_table("ai_conversations")
    op.drop_table("quiz_answers")
    op.drop_table("quiz_attempts")
    op.drop_table("quiz_questions")
    op.drop_table("quizzes")
    op.drop_table("reports")
    op.drop_table("experiment_results")
    op.drop_table("experiments")
