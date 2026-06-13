# STEMLab AI — Complete Folder Structure

```
stemlab-ai/
│
├── frontend/                              # Next.js 15 application
│   ├── public/
│   │   ├── icons/                         # app icons, favicons
│   │   └── images/                        # static images
│   ├── src/
│   │   ├── app/                           # Next.js App Router
│   │   │   ├── layout.tsx                 # root layout (providers, theme)
│   │   │   ├── page.tsx                   # homepage (landing)
│   │   │   ├── globals.css
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx               # main dashboard
│   │   │   │
│   │   │   ├── physics/
│   │   │   │   ├── page.tsx               # physics lab selector
│   │   │   │   ├── projectile-motion/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── newtons-laws/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── pendulum/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── circuits/
│   │   │   │   └── page.tsx               # circuit laboratory
│   │   │   │
│   │   │   ├── ai-instructor/
│   │   │   │   └── page.tsx               # AI chat interface
│   │   │   │
│   │   │   ├── concept-explorer/
│   │   │   │   ├── page.tsx               # concept map overview
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx           # individual concept detail
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── page.tsx               # quiz selector / generator
│   │   │   │   ├── [quizId]/
│   │   │   │   │   └── page.tsx           # active quiz session
│   │   │   │   └── results/
│   │   │   │       └── [attemptId]/
│   │   │   │           └── page.tsx       # quiz results
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx               # reports list
│   │   │   │   └── [reportId]/
│   │   │   │       └── page.tsx           # individual report viewer
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx               # analytics dashboard
│   │   │   │
│   │   │   ├── history/
│   │   │   │   └── page.tsx               # experiment history
│   │   │   │
│   │   │   └── knowledge-gaps/
│   │   │       └── page.tsx               # knowledge gap visualization
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                        # Shadcn UI base components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── chart.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx             # top navigation bar
│   │   │   │   ├── Sidebar.tsx            # collapsible sidebar
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── PageHeader.tsx
│   │   │   │
│   │   │   ├── homepage/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeaturesSection.tsx
│   │   │   │   ├── DemoPreview.tsx
│   │   │   │   ├── ScienceCategories.tsx
│   │   │   │   ├── ExperimentExplorer.tsx
│   │   │   │   ├── AIInstructorPreview.tsx
│   │   │   │   └── CallToAction.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.tsx          # single metric card
│   │   │   │   ├── RecentActivity.tsx
│   │   │   │   ├── ProgressOverview.tsx
│   │   │   │   └── QuickActions.tsx
│   │   │   │
│   │   │   ├── physics/
│   │   │   │   ├── ProjectileCanvas.tsx   # R3F 3D trajectory scene
│   │   │   │   ├── ProjectileControls.tsx # sliders and inputs
│   │   │   │   ├── ProjectileGraphs.tsx   # trajectory + velocity charts
│   │   │   │   ├── NewtonCanvas.tsx       # R3F force/mass scene
│   │   │   │   ├── NewtonControls.tsx
│   │   │   │   ├── NewtonGraphs.tsx
│   │   │   │   ├── PendulumCanvas.tsx     # R3F pendulum animation
│   │   │   │   ├── PendulumControls.tsx
│   │   │   │   ├── PendulumGraphs.tsx
│   │   │   │   └── ResultsSummary.tsx     # shared results display
│   │   │   │
│   │   │   ├── circuits/
│   │   │   │   ├── CircuitCanvas.tsx      # main drag-drop canvas
│   │   │   │   ├── ComponentPalette.tsx   # draggable component list
│   │   │   │   ├── CircuitComponent.tsx   # individual rendered component
│   │   │   │   ├── WireLayer.tsx          # SVG wire drawing layer
│   │   │   │   ├── CurrentAnimation.tsx   # animated current flow
│   │   │   │   ├── CircuitResults.tsx     # V/I/R/P display
│   │   │   │   └── CircuitValidation.tsx  # error display
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── ChatInterface.tsx      # full chat UI
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── TypingIndicator.tsx
│   │   │   │   ├── ConversationList.tsx
│   │   │   │   └── ContextPanel.tsx       # current experiment context
│   │   │   │
│   │   │   ├── concepts/
│   │   │   │   ├── ConceptMap.tsx         # D3/SVG knowledge graph
│   │   │   │   ├── ConceptCard.tsx
│   │   │   │   ├── ConceptDetail.tsx
│   │   │   │   ├── SubjectFilter.tsx
│   │   │   │   └── RelatedConcepts.tsx
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── QuizSetup.tsx          # difficulty/topic selector
│   │   │   │   ├── QuizQuestion.tsx       # MCQ/numerical/conceptual
│   │   │   │   ├── QuizProgress.tsx       # timer + progress bar
│   │   │   │   ├── QuizResults.tsx        # score + breakdown
│   │   │   │   └── QuizHistory.tsx
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── ReportCard.tsx
│   │   │   │   ├── ReportViewer.tsx       # full report display
│   │   │   │   ├── ReportSection.tsx
│   │   │   │   └── ExportButton.tsx       # PDF download trigger
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── ExperimentChart.tsx    # bar chart usage
│   │   │   │   ├── ProgressChart.tsx      # line chart over time
│   │   │   │   ├── QuizScoreChart.tsx
│   │   │   │   ├── TopicMasteryChart.tsx  # radar chart
│   │   │   │   └── KnowledgeGrowthChart.tsx
│   │   │   │
│   │   │   ├── history/
│   │   │   │   ├── ExperimentHistoryTable.tsx
│   │   │   │   ├── ExperimentHistoryCard.tsx
│   │   │   │   └── CompareExperiments.tsx
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       ├── ConfirmDialog.tsx
│   │   │       └── ThemeToggle.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useExperiments.ts          # React Query hooks for experiments
│   │   │   ├── usePhysics.ts              # physics simulation hooks
│   │   │   ├── useCircuit.ts              # circuit state management
│   │   │   ├── useAI.ts                   # AI chat + streaming
│   │   │   ├── useQuiz.ts                 # quiz state
│   │   │   ├── useReports.ts
│   │   │   ├── useAnalytics.ts
│   │   │   ├── useConcepts.ts
│   │   │   ├── useKnowledgeGaps.ts
│   │   │   └── useSession.ts              # anonymous session management
│   │   │
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts              # base axios/fetch client
│   │   │   │   ├── experiments.ts         # experiment API functions
│   │   │   │   ├── physics.ts
│   │   │   │   ├── circuits.ts
│   │   │   │   ├── ai.ts
│   │   │   │   ├── quizzes.ts
│   │   │   │   ├── reports.ts
│   │   │   │   ├── analytics.ts
│   │   │   │   ├── concepts.ts
│   │   │   │   └── knowledge-gaps.ts
│   │   │   ├── utils/
│   │   │   │   ├── format.ts              # number/date formatters
│   │   │   │   ├── physics-utils.ts       # client-side physics helpers
│   │   │   │   └── circuit-utils.ts       # client-side circuit helpers
│   │   │   ├── providers/
│   │   │   │   ├── QueryProvider.tsx      # React Query provider
│   │   │   │   └── ThemeProvider.tsx
│   │   │   └── constants.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── circuitStore.ts            # Zustand: circuit editor state
│   │   │   ├── experimentStore.ts         # Zustand: current experiment
│   │   │   └── uiStore.ts                 # Zustand: sidebar, modals
│   │   │
│   │   └── types/
│   │       ├── api.ts                     # API response types
│   │       ├── physics.ts                 # physics domain types
│   │       ├── circuit.ts                 # circuit domain types
│   │       ├── quiz.ts
│   │       ├── report.ts
│   │       ├── analytics.ts
│   │       └── concept.ts
│   │
│   ├── .env.local.example
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── components.json                    # Shadcn config
│   └── package.json
│
├── backend/                               # FastAPI application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                        # FastAPI app factory, middleware registration
│   │   │
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── router.py              # aggregates all v1 routers
│   │   │       └── endpoints/
│   │   │           ├── experiments.py
│   │   │           ├── physics.py
│   │   │           ├── circuits.py
│   │   │           ├── ai.py
│   │   │           ├── quizzes.py
│   │   │           ├── reports.py
│   │   │           ├── analytics.py
│   │   │           ├── concepts.py
│   │   │           └── knowledge_gaps.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py                  # Pydantic Settings (env vars)
│   │   │   ├── database.py                # async SQLAlchemy engine + session factory
│   │   │   ├── logging.py                 # structured JSON logger (structlog)
│   │   │   ├── exceptions.py              # custom exception hierarchy
│   │   │   └── dependencies.py            # FastAPI dependency injections
│   │   │
│   │   ├── models/                        # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── experiment.py
│   │   │   ├── report.py
│   │   │   ├── quiz.py
│   │   │   ├── ai_conversation.py
│   │   │   ├── analytics.py
│   │   │   └── concept.py
│   │   │
│   │   ├── schemas/                       # Pydantic v2 request/response DTOs
│   │   │   ├── __init__.py
│   │   │   ├── common.py                  # pagination, error responses
│   │   │   ├── experiment.py
│   │   │   ├── physics.py
│   │   │   ├── circuit.py
│   │   │   ├── ai.py
│   │   │   ├── quiz.py
│   │   │   ├── report.py
│   │   │   ├── analytics.py
│   │   │   ├── concept.py
│   │   │   └── knowledge_gap.py
│   │   │
│   │   ├── repositories/
│   │   │   ├── base.py                    # BaseRepository with CRUD generics
│   │   │   ├── experiment_repository.py
│   │   │   ├── report_repository.py
│   │   │   ├── quiz_repository.py
│   │   │   ├── ai_repository.py
│   │   │   ├── analytics_repository.py
│   │   │   └── concept_repository.py
│   │   │
│   │   ├── services/
│   │   │   ├── experiment_service.py      # orchestrates experiment CRUD + results
│   │   │   ├── report_service.py          # report generation orchestration
│   │   │   ├── quiz_service.py            # quiz generation + grading
│   │   │   ├── analytics_service.py       # dashboard + progress aggregation
│   │   │   └── knowledge_gap_service.py   # gap detection logic
│   │   │
│   │   ├── engines/
│   │   │   ├── physics/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── projectile_motion.py   # kinematic solver
│   │   │   │   ├── newtons_laws.py        # force/mass/friction solver
│   │   │   │   └── pendulum.py            # SHM + ODE solver
│   │   │   │
│   │   │   ├── circuit/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── graph_builder.py       # component graph construction
│   │   │   │   ├── mna_solver.py          # Modified Nodal Analysis
│   │   │   │   ├── validator.py           # circuit validation rules
│   │   │   │   └── current_flow.py        # current path computation
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── gemini_client.py       # async Gemini API wrapper
│   │   │   │   ├── conversation_manager.py
│   │   │   │   ├── prompt_builder.py      # system prompts + context injection
│   │   │   │   ├── streaming.py           # SSE streaming handler
│   │   │   │   └── quiz_generator.py      # Gemini quiz generation
│   │   │   │
│   │   │   ├── reporting/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── report_builder.py      # section assembler
│   │   │   │   ├── pdf_renderer.py        # WeasyPrint PDF generator
│   │   │   │   ├── chart_generator.py     # matplotlib chart → base64
│   │   │   │   └── templates/
│   │   │   │       ├── base.html          # base report template
│   │   │   │       ├── physics_report.html
│   │   │   │       ├── circuit_report.html
│   │   │   │       └── report.css         # print stylesheet
│   │   │   │
│   │   │   └── analytics/
│   │   │       ├── __init__.py
│   │   │       ├── aggregator.py          # dashboard stat queries
│   │   │       └── progress_tracker.py
│   │   │
│   │   └── middleware/
│   │       ├── cors.py
│   │       ├── logging_middleware.py      # request/response logging
│   │       ├── error_handler.py           # global exception → JSON error
│   │       └── session_middleware.py      # anonymous session cookie
│   │
│   ├── migrations/
│   │   ├── env.py                         # Alembic async config
│   │   ├── script.py.mako
│   │   ├── versions/
│   │   │   ├── 0001_initial_schema.py
│   │   │   └── 0002_seed_concepts.py
│   │   └── seed/
│   │       ├── concepts.json              # concept nodes seed data
│   │       └── concept_edges.json         # concept relationships
│   │
│   ├── tests/
│   │   ├── conftest.py                    # pytest fixtures, test DB setup
│   │   ├── unit/
│   │   │   ├── test_projectile_motion.py
│   │   │   ├── test_newtons_laws.py
│   │   │   ├── test_pendulum.py
│   │   │   ├── test_mna_solver.py
│   │   │   └── test_circuit_validator.py
│   │   ├── integration/
│   │   │   ├── test_experiments_api.py
│   │   │   ├── test_physics_api.py
│   │   │   ├── test_circuit_api.py
│   │   │   ├── test_quiz_api.py
│   │   │   ├── test_reports_api.py
│   │   │   └── test_analytics_api.py
│   │   └── e2e/
│   │       └── test_full_experiment_flow.py
│   │
│   ├── .env.example
│   ├── pyproject.toml                     # dependencies (uv/pip)
│   ├── alembic.ini
│   └── Dockerfile
│
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nginx/
│       ├── nginx.conf
│       └── default.conf
│
├── infrastructure/
│   ├── aws/
│   │   ├── ecs-task-definition.json
│   │   ├── ecr-policy.json
│   │   └── rds-config.json
│   └── scripts/
│       ├── deploy.sh
│       ├── migrate.sh
│       └── seed.sh
│
├── docker-compose.yml                     # development
├── docker-compose.prod.yml                # production
├── .env.example                           # root env template
└── README.md
```

## Key File Count Summary

| Layer | Files |
|---|---|
| Frontend pages | 14 |
| Frontend components | 58 |
| Frontend hooks | 10 |
| Frontend lib/types | 18 |
| Backend endpoints | 9 |
| Backend models | 6 |
| Backend schemas | 10 |
| Backend repositories | 6 |
| Backend services | 5 |
| Backend engines | 17 |
| Migrations | 4 |
| Tests | 13 |
| Docker/Infra | 8 |
| **Total** | **~178** |
