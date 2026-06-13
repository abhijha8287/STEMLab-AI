# STEMLab AI — Complete Database Schema

## Entity Relationship Overview

```
experiments ──< experiment_results
experiments ──< reports
quizzes ──< quiz_questions ──< quiz_answers
quiz_attempts ──< quiz_answers
ai_conversations ──< ai_messages
analytics_events (append-only log)
concept_nodes ──< concept_edges
knowledge_gaps
```

---

## Full Schema (PostgreSQL DDL)

### Extension
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for concept search
```

---

### experiments

Stores a single experiment session (one student run).

```sql
CREATE TABLE experiments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type            VARCHAR(50)  NOT NULL,  -- 'projectile_motion' | 'newtons_laws' | 'pendulum' | 'circuit'
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    status          VARCHAR(20)  NOT NULL DEFAULT 'in_progress',  -- 'in_progress' | 'completed' | 'abandoned'
    session_id      VARCHAR(100),           -- anonymous session identifier (cookie-based)
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,

    CONSTRAINT experiments_type_check CHECK (
        type IN ('projectile_motion', 'newtons_laws', 'pendulum', 'circuit')
    ),
    CONSTRAINT experiments_status_check CHECK (
        status IN ('in_progress', 'completed', 'abandoned')
    )
);

CREATE INDEX idx_experiments_type    ON experiments(type);
CREATE INDEX idx_experiments_session ON experiments(session_id);
CREATE INDEX idx_experiments_created ON experiments(created_at DESC);
```

---

### experiment_results

Each row = one simulation run with specific parameter set.

```sql
CREATE TABLE experiment_results (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id   UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,

    -- Input parameters (flexible JSONB per experiment type)
    parameters      JSONB NOT NULL,
    /*
      projectile_motion: {
        "initial_velocity": 25.0,    -- m/s
        "launch_angle": 45.0,        -- degrees
        "gravity": 9.81,             -- m/s²
        "air_resistance": 0.1        -- drag coefficient
      }
      newtons_laws: {
        "force": 10.0,               -- N
        "mass": 2.0,                 -- kg
        "friction_coefficient": 0.3
      }
      pendulum: {
        "length": 1.0,               -- m
        "mass": 0.5,                 -- kg
        "initial_angle": 30.0,       -- degrees
        "gravity": 9.81              -- m/s²
      }
      circuit: {
        "components": [...],
        "connections": [...]
      }
    */

    -- Calculated outputs
    results         JSONB NOT NULL,
    /*
      projectile_motion: {
        "flight_time": 3.6,          -- s
        "max_height": 15.9,          -- m
        "range": 63.7,               -- m
        "trajectory_points": [[x,y,t], ...]
      }
      newtons_laws: {
        "acceleration": 4.2,         -- m/s²
        "final_velocity": 12.6,      -- m/s
        "velocity_series": [[t,v], ...]
      }
      pendulum: {
        "period": 2.006,             -- s
        "frequency": 0.499,          -- Hz
        "angle_series": [[t,a], ...]
      }
      circuit: {
        "total_voltage": 9.0,
        "total_current": 0.045,
        "total_resistance": 200.0,
        "total_power": 0.405,
        "node_voltages": {...},
        "branch_currents": {...}
      }
    */

    -- Time series data for graphs (stored separately for efficient retrieval)
    time_series     JSONB,

    -- AI-generated analysis (optional, populated after AI review)
    ai_analysis     TEXT,
    error_details   TEXT,           -- any simulation errors

    run_duration_ms INTEGER,        -- how long the simulation took
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_experiment_results_experiment FOREIGN KEY (experiment_id)
        REFERENCES experiments(id) ON DELETE CASCADE
);

CREATE INDEX idx_experiment_results_experiment ON experiment_results(experiment_id);
CREATE INDEX idx_experiment_results_created    ON experiment_results(created_at DESC);
CREATE INDEX idx_experiment_results_params     ON experiment_results USING gin(parameters);
CREATE INDEX idx_experiment_results_results    ON experiment_results USING gin(results);
```

---

### reports

Lab reports generated from experiment results.

```sql
CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id   UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    result_id       UUID REFERENCES experiment_results(id) ON DELETE SET NULL,

    title           VARCHAR(255) NOT NULL,
    session_id      VARCHAR(100),

    -- Report sections (structured)
    objective       TEXT NOT NULL,
    methodology     TEXT NOT NULL,
    observations    TEXT NOT NULL,
    results_text    TEXT NOT NULL,
    analysis        TEXT NOT NULL,
    conclusion      TEXT NOT NULL,
    raw_parameters  JSONB NOT NULL,   -- snapshot of experiment parameters at report time
    raw_results     JSONB NOT NULL,   -- snapshot of experiment results at report time

    -- PDF export
    pdf_url         TEXT,             -- Supabase Storage URL
    pdf_generated   BOOLEAN NOT NULL DEFAULT FALSE,
    pdf_size_bytes  INTEGER,

    -- Metadata
    generated_by_ai BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_experiment ON reports(experiment_id);
CREATE INDEX idx_reports_session    ON reports(session_id);
CREATE INDEX idx_reports_created    ON reports(created_at DESC);
```

---

### quizzes

A generated quiz instance with its questions.

```sql
CREATE TABLE quizzes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(255) NOT NULL,
    topic           VARCHAR(100) NOT NULL,   -- e.g. 'projectile_motion', 'circuit_basics'
    subject         VARCHAR(50)  NOT NULL,   -- 'physics' | 'chemistry' | 'mathematics'
    difficulty      VARCHAR(20)  NOT NULL,   -- 'beginner' | 'intermediate' | 'advanced'
    question_count  INTEGER      NOT NULL,
    session_id      VARCHAR(100),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT quizzes_difficulty_check CHECK (
        difficulty IN ('beginner', 'intermediate', 'advanced')
    ),
    CONSTRAINT quizzes_subject_check CHECK (
        subject IN ('physics', 'chemistry', 'mathematics', 'general')
    )
);

CREATE INDEX idx_quizzes_topic      ON quizzes(topic);
CREATE INDEX idx_quizzes_subject    ON quizzes(subject);
CREATE INDEX idx_quizzes_session    ON quizzes(session_id);
CREATE INDEX idx_quizzes_created    ON quizzes(created_at DESC);
```

---

### quiz_questions

Individual questions belonging to a quiz.

```sql
CREATE TABLE quiz_questions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id         UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_number INTEGER      NOT NULL,
    question_type   VARCHAR(20)  NOT NULL,   -- 'mcq' | 'numerical' | 'conceptual'
    question_text   TEXT         NOT NULL,
    options         JSONB,                   -- for MCQ: ["option_a", "option_b", "option_c", "option_d"]
    correct_answer  TEXT         NOT NULL,
    explanation     TEXT         NOT NULL,
    topic_tag       VARCHAR(100),            -- concept tag for gap analysis
    difficulty      VARCHAR(20)  NOT NULL,

    CONSTRAINT quiz_questions_type_check CHECK (
        question_type IN ('mcq', 'numerical', 'conceptual')
    ),

    UNIQUE(quiz_id, question_number)
);

CREATE INDEX idx_quiz_questions_quiz  ON quiz_questions(quiz_id);
CREATE INDEX idx_quiz_questions_topic ON quiz_questions(topic_tag);
```

---

### quiz_attempts

A student's attempt at a quiz.

```sql
CREATE TABLE quiz_attempts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id         UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    session_id      VARCHAR(100),
    score           NUMERIC(5,2) NOT NULL DEFAULT 0,   -- percentage 0.00-100.00
    total_questions INTEGER      NOT NULL,
    correct_count   INTEGER      NOT NULL DEFAULT 0,
    time_taken_secs INTEGER,
    completed       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_quiz_attempts_quiz    ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_session ON quiz_attempts(session_id);
CREATE INDEX idx_quiz_attempts_created ON quiz_attempts(created_at DESC);
```

---

### quiz_answers

Individual answers submitted in an attempt.

```sql
CREATE TABLE quiz_answers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id      UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id     UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    submitted_answer TEXT        NOT NULL,
    is_correct      BOOLEAN     NOT NULL,
    time_taken_secs INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(attempt_id, question_id)
);

CREATE INDEX idx_quiz_answers_attempt  ON quiz_answers(attempt_id);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);
```

---

### ai_conversations

An AI chat session.

```sql
CREATE TABLE ai_conversations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      VARCHAR(100),
    title           VARCHAR(255),           -- auto-generated from first message
    context_type    VARCHAR(50),            -- 'general' | 'experiment' | 'quiz' | 'concept'
    context_id      UUID,                   -- FK to experiment/quiz/concept (polymorphic)
    message_count   INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_session ON ai_conversations(session_id);
CREATE INDEX idx_ai_conversations_context ON ai_conversations(context_type, context_id);
CREATE INDEX idx_ai_conversations_created ON ai_conversations(created_at DESC);
```

---

### ai_messages

Individual messages in a conversation.

```sql
CREATE TABLE ai_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role            VARCHAR(10)  NOT NULL,   -- 'user' | 'assistant'
    content         TEXT         NOT NULL,
    token_count     INTEGER,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT ai_messages_role_check CHECK (
        role IN ('user', 'assistant')
    )
);

CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created      ON ai_messages(created_at);
```

---

### analytics_events

Append-only event log for all user interactions.

```sql
CREATE TABLE analytics_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type      VARCHAR(100) NOT NULL,
    /*
      'experiment_started' | 'experiment_completed' | 'experiment_run'
      'quiz_started' | 'quiz_completed'
      'report_generated' | 'pdf_exported'
      'ai_query' | 'concept_viewed'
    */
    session_id      VARCHAR(100),
    entity_type     VARCHAR(50),            -- 'experiment' | 'quiz' | 'report' | 'concept'
    entity_id       UUID,
    properties      JSONB,                  -- event-specific data
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type    ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_entity  ON analytics_events(entity_type, entity_id);
```

---

### concept_nodes

STEM concept knowledge graph nodes.

```sql
CREATE TABLE concept_nodes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug            VARCHAR(100) NOT NULL UNIQUE,  -- 'projectile-motion'
    name            VARCHAR(255) NOT NULL,
    subject         VARCHAR(50)  NOT NULL,          -- 'physics' | 'chemistry' | 'mathematics'
    category        VARCHAR(100) NOT NULL,           -- 'motion' | 'forces' | 'atoms' etc.
    description     TEXT,
    difficulty      VARCHAR(20)  NOT NULL DEFAULT 'beginner',
    icon            VARCHAR(50),                    -- icon identifier
    color           VARCHAR(7),                     -- hex color for UI
    sort_order      INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT concept_nodes_subject_check CHECK (
        subject IN ('physics', 'chemistry', 'mathematics')
    )
);

CREATE INDEX idx_concept_nodes_subject  ON concept_nodes(subject);
CREATE INDEX idx_concept_nodes_category ON concept_nodes(category);
CREATE INDEX idx_concept_nodes_slug     ON concept_nodes(slug);
```

---

### concept_edges

Directed prerequisite/related relationships between concepts.

```sql
CREATE TABLE concept_edges (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_concept_id UUID NOT NULL REFERENCES concept_nodes(id) ON DELETE CASCADE,
    to_concept_id   UUID NOT NULL REFERENCES concept_nodes(id) ON DELETE CASCADE,
    relationship    VARCHAR(50)  NOT NULL,  -- 'prerequisite' | 'related' | 'builds_on'
    strength        NUMERIC(3,2) NOT NULL DEFAULT 1.0,  -- 0.0 to 1.0

    UNIQUE(from_concept_id, to_concept_id, relationship)
);

CREATE INDEX idx_concept_edges_from ON concept_edges(from_concept_id);
CREATE INDEX idx_concept_edges_to   ON concept_edges(to_concept_id);
```

---

### knowledge_gaps

Detected knowledge gaps for a session.

```sql
CREATE TABLE knowledge_gaps (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      VARCHAR(100) NOT NULL,
    concept_id      UUID REFERENCES concept_nodes(id) ON DELETE SET NULL,
    concept_slug    VARCHAR(100) NOT NULL,
    gap_type        VARCHAR(50)  NOT NULL,  -- 'weak_concept' | 'missing_prerequisite' | 'common_mistake'
    severity        VARCHAR(20)  NOT NULL,  -- 'low' | 'medium' | 'high'
    evidence        JSONB,                  -- quiz answers, experiment mistakes that triggered this
    recommendation  TEXT,
    resolved        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    resolved_at     TIMESTAMPTZ
);

CREATE INDEX idx_knowledge_gaps_session  ON knowledge_gaps(session_id);
CREATE INDEX idx_knowledge_gaps_concept  ON knowledge_gaps(concept_slug);
CREATE INDEX idx_knowledge_gaps_severity ON knowledge_gaps(severity);
```

---

## Migrations Strategy

- Alembic with async SQLAlchemy
- One migration file per logical change
- Migration files in `backend/migrations/versions/`
- `alembic upgrade head` runs on container startup
- Seed data for concept_nodes and concept_edges in `backend/migrations/seed/`

## Initial Seed Data

### concept_nodes seed (46 concepts)

Physics (20): kinematics, displacement, velocity, acceleration, force, mass, weight, friction, momentum, energy, work, power, projectile-motion, circular-motion, gravity, waves, frequency, amplitude, electric-charge, electric-current

Chemistry (13): atom, element, molecule, compound, mixture, chemical-reaction, oxidation, reduction, acid, base, pH, mole, periodic-table

Mathematics (13): variable, equation, function, derivative, integral, vector, matrix, statistics, probability, geometry, trigonometry, algebra, calculus
