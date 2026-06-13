# STEMLab AI — Development Roadmap

## Overview

9 phases, fully sequential. Each phase produces working, testable software.
Implementation begins after Phase 1 approval.

---

## Phase 1 — Architecture & Design (CURRENT)
**Deliverables:** ARCHITECTURE.md, DATABASE_SCHEMA.md, FOLDER_STRUCTURE.md, API_SPECIFICATION.md, DEVELOPMENT_ROADMAP.md
**Status:** Complete — awaiting approval

---

## Phase 2 — Project Scaffolding & Infrastructure
**Goal:** Runnable containers with no features yet

### Backend
- [ ] FastAPI project with pyproject.toml (FastAPI, SQLAlchemy 2.0, asyncpg, alembic, pydantic-v2, structlog, httpx)
- [ ] `app/main.py` — app factory, CORS, middleware registration
- [ ] `app/core/config.py` — Pydantic Settings with all env vars
- [ ] `app/core/database.py` — async engine, session factory, lifespan context
- [ ] `app/core/logging.py` — structlog JSON formatter
- [ ] `app/core/exceptions.py` — custom exception classes
- [ ] `app/middleware/error_handler.py` — global exception → standard JSON error
- [ ] `app/middleware/session_middleware.py` — anonymous session UUID cookie
- [ ] Health check endpoint `GET /health`
- [ ] Alembic config with async support

### Frontend
- [ ] Next.js 15 project with TypeScript, TailwindCSS, Shadcn UI
- [ ] Install all dependencies (React Query, React Three Fiber, Framer Motion, Zod, React Hook Form)
- [ ] `src/lib/providers/` — QueryProvider, ThemeProvider
- [ ] Root layout with providers and Navbar
- [ ] `src/lib/api/client.ts` — base fetch client with session header injection
- [ ] Shadcn component initialization

### Database & Docker
- [ ] PostgreSQL 16 container configuration
- [ ] `docker-compose.yml` with frontend/backend/postgres/nginx services
- [ ] `backend/Dockerfile`
- [ ] `frontend/Dockerfile`
- [ ] `nginx/nginx.conf` reverse proxy
- [ ] `.env.example` for all services
- [ ] Alembic initial migration (0001_initial_schema.py) — full schema
- [ ] Alembic seed migration (0002_seed_concepts.py) — 46 concepts + edges

**Acceptance:** `docker compose up` starts all services, `/health` returns 200, DB migrations run

---

## Phase 3 — Homepage & Dashboard
**Goal:** Fully functional landing page and data-driven dashboard

### Homepage
- [ ] `HeroSection.tsx` — animated hero with 3D particle background (R3F)
- [ ] `FeaturesSection.tsx` — 6 feature cards with icons
- [ ] `DemoPreview.tsx` — animated preview of physics simulation
- [ ] `ScienceCategories.tsx` — Physics / Chemistry / Math cards
- [ ] `ExperimentExplorer.tsx` — scrollable experiment grid with previews
- [ ] `AIInstructorPreview.tsx` — animated chat demo
- [ ] `CallToAction.tsx` — link to physics lab
- [ ] Framer Motion page transitions
- [ ] Fully responsive (mobile/tablet/desktop)

### Dashboard Backend
- [ ] `analytics_repository.py` — dashboard aggregation queries
- [ ] `GET /api/v1/analytics/dashboard` — real data from DB
- [ ] `GET /api/v1/analytics/experiments` — usage breakdown
- [ ] `GET /api/v1/history` — combined timeline

### Dashboard Frontend
- [ ] `dashboard/page.tsx` with all 7 stat cards
- [ ] `StatsCard.tsx` — animated number counters
- [ ] `RecentActivity.tsx` — live activity feed
- [ ] `ProgressOverview.tsx` — subject progress bars
- [ ] `QuickActions.tsx` — shortcut buttons
- [ ] React Query data fetching with loading/error states

**Acceptance:** Dashboard shows real zeros from DB, increments as experiments are run

---

## Phase 4 — Physics Laboratory
**Goal:** All 3 physics simulations fully working

### Physics Engine (Backend)
- [ ] `engines/physics/projectile_motion.py`
  - Euler integration with air drag
  - Trajectory point generation (100 points)
  - `POST /api/v1/physics/projectile-motion`
- [ ] `engines/physics/newtons_laws.py`
  - Net force, friction, velocity/acceleration series
  - `POST /api/v1/physics/newtons-laws`
- [ ] `engines/physics/pendulum.py`
  - RK4 ODE solver for large angles
  - SHM approximation for small angles
  - `POST /api/v1/physics/pendulum`
- [ ] `experiment_repository.py` — create/read/update experiments + results
- [ ] `experiment_service.py` — orchestration
- [ ] `GET/POST /api/v1/experiments` + `GET /api/v1/experiments/{id}`

### Physics Frontend
- [ ] `physics/page.tsx` — lab selector with experiment cards
- [ ] `ProjectileCanvas.tsx` — R3F animated ball trajectory
- [ ] `ProjectileControls.tsx` — velocity/angle/gravity/drag sliders
- [ ] `ProjectileGraphs.tsx` — x-y trajectory + velocity charts (recharts)
- [ ] Projectile motion page: run simulation, see animation, see graphs, see calculations
- [ ] `NewtonCanvas.tsx` — R3F block being pushed with force arrow
- [ ] `NewtonControls.tsx`
- [ ] `NewtonGraphs.tsx` — velocity/acceleration over time
- [ ] `PendulumCanvas.tsx` — R3F swinging pendulum animation
- [ ] `PendulumControls.tsx`
- [ ] `PendulumGraphs.tsx` — angle/velocity phase diagram
- [ ] `ResultsSummary.tsx` — shared calculated values display
- [ ] `usePhysics.ts` — mutation hooks for each simulation
- [ ] All 3 experiments store results to DB

**Acceptance:** Run all 3 experiments, see animations, graphs update, results stored in DB

---

## Phase 5 — Circuit Laboratory
**Goal:** Drag-and-drop circuit builder with real simulation

### Circuit Engine (Backend)
- [ ] `engines/circuit/graph_builder.py` — JSON → NetworkX directed graph
- [ ] `engines/circuit/validator.py` — short circuit, open circuit, floating node detection
- [ ] `engines/circuit/mna_solver.py` — Modified Nodal Analysis with NumPy matrix solve
- [ ] `engines/circuit/current_flow.py` — compute current through each branch for animation
- [ ] `POST /api/v1/circuits/simulate`
- [ ] `POST /api/v1/circuits/validate`
- [ ] Circuit results stored to experiments table

### Circuit Frontend
- [ ] `circuits/page.tsx`
- [ ] `CircuitCanvas.tsx` — HTML5 Canvas drag-and-drop board with grid snap
- [ ] `ComponentPalette.tsx` — draggable battery/resistor/LED/switch/capacitor
- [ ] `CircuitComponent.tsx` — SVG rendering of each component type
- [ ] `WireLayer.tsx` — SVG wire drawing with click-to-connect
- [ ] `CurrentAnimation.tsx` — animated dots flowing along wires (canvas/SVG)
- [ ] `CircuitResults.tsx` — V/I/R/P display panel
- [ ] `CircuitValidation.tsx` — error messages panel
- [ ] `useCircuit.ts` — circuit editor state with Zustand
- [ ] Real-time validation on component placement
- [ ] Simulate button calls backend MNA solver

**Acceptance:** Build and simulate a simple LED circuit, see current animation, results displayed

---

## Phase 6 — AI STEM Instructor
**Goal:** Fully working AI chat with streaming, context-aware responses

### AI Engine (Backend)
- [ ] `engines/ai/gemini_client.py` — async google-genai client, retry logic, error handling
- [ ] `engines/ai/prompt_builder.py` — system prompts per context type, experiment data injection
- [ ] `engines/ai/conversation_manager.py` — history assembly for Gemini multi-turn
- [ ] `engines/ai/streaming.py` — SSE generator from Gemini stream
- [ ] `ai_repository.py` — conversation + message CRUD
- [ ] `POST /api/v1/ai/conversations`
- [ ] `POST /api/v1/ai/conversations/{id}/messages`
- [ ] `POST /api/v1/ai/conversations/{id}/stream` (SSE)
- [ ] `POST /api/v1/ai/explain-concept`
- [ ] `POST /api/v1/ai/analyze-experiment`
- [ ] `GET /api/v1/ai/conversations`
- [ ] Context injection: when context_type=experiment, include experiment parameters + results in system prompt

### AI Frontend
- [ ] `ai-instructor/page.tsx`
- [ ] `ChatInterface.tsx` — full chat UI with conversation list sidebar
- [ ] `MessageBubble.tsx` — user/assistant bubbles with markdown rendering
- [ ] `TypingIndicator.tsx` — animated dots while streaming
- [ ] `ConversationList.tsx` — history sidebar
- [ ] `ContextPanel.tsx` — shows current experiment being discussed
- [ ] `useAI.ts` — SSE streaming hook with token accumulation
- [ ] AI chat button embedded in each physics/circuit experiment page
- [ ] "Ask AI about this result" button on experiment result pages

**Acceptance:** Chat with AI, get streaming responses, AI knows about current experiment, history persists

---

## Phase 7 — Quiz System & Concept Explorer
**Goal:** AI-generated quizzes and visual concept knowledge graph

### Quiz Engine (Backend)
- [ ] `engines/ai/quiz_generator.py` — structured Gemini prompt with JSON mode for quiz generation
- [ ] `quiz_repository.py` — quiz/question/attempt/answer CRUD
- [ ] `quiz_service.py` — generate, start attempt, grade answers
- [ ] All quiz API endpoints

### Concept System (Backend)
- [ ] `concept_repository.py` — concept node/edge queries
- [ ] All concept API endpoints
- [ ] Concept explain endpoint uses Gemini with concept context

### Frontend
- [ ] `quiz/page.tsx` — topic/difficulty/count selector
- [ ] `QuizSetup.tsx`
- [ ] `quiz/[quizId]/page.tsx` — active quiz with timer
- [ ] `QuizQuestion.tsx` — MCQ option buttons, numerical input, conceptual textarea
- [ ] `QuizProgress.tsx` — progress bar + timer
- [ ] `quiz/results/[attemptId]/page.tsx`
- [ ] `QuizResults.tsx` — score, per-question breakdown, explanations
- [ ] `concept-explorer/page.tsx`
- [ ] `ConceptMap.tsx` — D3-force directed graph visualization
- [ ] `ConceptCard.tsx` — subject/category color-coded cards
- [ ] `concept-explorer/[slug]/page.tsx`
- [ ] `ConceptDetail.tsx` — description, prerequisites, related, AI explanation

**Acceptance:** Generate and complete a quiz, see results; browse concept map, click a concept and see AI explanation

---

## Phase 8 — Reports, Analytics & Knowledge Gaps
**Goal:** PDF reports, full analytics charts, knowledge gap detection

### Reporting Engine (Backend)
- [ ] `engines/reporting/report_builder.py` — assembles sections using experiment data + AI generation
- [ ] `engines/reporting/chart_generator.py` — matplotlib figures → base64 PNG
- [ ] `engines/reporting/templates/` — Jinja2 HTML templates with CSS
- [ ] `engines/reporting/pdf_renderer.py` — WeasyPrint HTML→PDF
- [ ] Supabase Storage client for PDF upload
- [ ] `report_repository.py`
- [ ] `report_service.py`
- [ ] All report API endpoints

### Analytics Engine (Backend)
- [ ] `engines/analytics/aggregator.py` — all dashboard queries
- [ ] `engines/analytics/progress_tracker.py`
- [ ] Full analytics API endpoints

### Knowledge Gap System (Backend)
- [ ] `knowledge_gap_service.py` — analyzes quiz answers + experiment patterns
- [ ] Gap detection rules: wrong answer topics, experiment parameter mistakes
- [ ] Roadmap generation using concept graph traversal
- [ ] All knowledge gap API endpoints

### Frontend
- [ ] `reports/page.tsx` + `reports/[reportId]/page.tsx`
- [ ] `ReportViewer.tsx` — full rendered report with all sections
- [ ] `ExportButton.tsx` — triggers PDF generation, shows progress, downloads file
- [ ] `analytics/page.tsx`
- [ ] `ExperimentChart.tsx` — bar chart by type (recharts)
- [ ] `ProgressChart.tsx` — line chart over time
- [ ] `QuizScoreChart.tsx` — score trend line
- [ ] `TopicMasteryChart.tsx` — radar chart
- [ ] `KnowledgeGrowthChart.tsx`
- [ ] `knowledge-gaps/page.tsx`
- [ ] Knowledge gap severity cards with concept graph visualization
- [ ] Learning roadmap display

**Acceptance:** Generate PDF report and download it; analytics shows real charts; knowledge gaps detected after quiz

---

## Phase 9 — History, Polish & Testing
**Goal:** Experiment history, responsive UI polish, full test suite

### History
- [ ] `history/page.tsx` — paginated experiment + quiz history table
- [ ] `ExperimentHistoryTable.tsx` with sort/filter
- [ ] Reopen experiment (restore parameters)
- [ ] Compare two runs side-by-side
- [ ] Export individual result as PDF

### UI Polish
- [ ] Dark mode complete (all components)
- [ ] Mobile responsive: all pages work on 375px width
- [ ] Tablet responsive: all pages work on 768px width
- [ ] Loading skeletons on all data-fetching components
- [ ] Error boundaries on all feature sections
- [ ] Empty states on all list components
- [ ] Framer Motion page transitions

### Testing
- [ ] `tests/unit/test_projectile_motion.py` — physics accuracy tests
- [ ] `tests/unit/test_newtons_laws.py`
- [ ] `tests/unit/test_pendulum.py`
- [ ] `tests/unit/test_mna_solver.py` — circuit solver correctness
- [ ] `tests/unit/test_circuit_validator.py`
- [ ] `tests/integration/test_experiments_api.py` — full API flow
- [ ] `tests/integration/test_physics_api.py`
- [ ] `tests/integration/test_circuit_api.py`
- [ ] `tests/integration/test_quiz_api.py`
- [ ] `tests/integration/test_reports_api.py`
- [ ] `tests/e2e/test_full_experiment_flow.py` — create experiment → run → generate report

### DevOps
- [ ] `docker-compose.prod.yml` with production settings
- [ ] `infrastructure/aws/ecs-task-definition.json`
- [ ] `infrastructure/scripts/deploy.sh`
- [ ] Environment variables documentation

**Acceptance:** All tests pass; all responsive breakpoints work; Docker build succeeds

---

## Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql+asyncpg://stemlab:password@postgres:5432/stemlab
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_BUCKET=stemlab-reports
ENVIRONMENT=development
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=STEMLab AI
```

---

## Technology Versions

| Package | Version |
|---|---|
| Python | 3.12 |
| FastAPI | 0.115.x |
| SQLAlchemy | 2.0.x |
| Pydantic | 2.x |
| Alembic | 1.13.x |
| asyncpg | 0.29.x |
| google-genai | 1.x |
| WeasyPrint | 62.x |
| structlog | 24.x |
| numpy | 2.x |
| matplotlib | 3.9.x |
| Node.js | 22 LTS |
| Next.js | 15.x |
| React | 19.x |
| TypeScript | 5.x |
| TailwindCSS | 3.4.x |
| React Three Fiber | 8.x |
| Three.js | 0.169.x |
| Framer Motion | 11.x |
| TanStack Query | 5.x |
| Recharts | 2.x |
| Zustand | 5.x |
| D3 | 7.x |

---

## Estimated Implementation Timeline

| Phase | Estimated Effort |
|---|---|
| Phase 2 — Scaffolding | 1 session |
| Phase 3 — Homepage + Dashboard | 1 session |
| Phase 4 — Physics Lab | 1 session |
| Phase 5 — Circuit Lab | 1 session |
| Phase 6 — AI Instructor | 1 session |
| Phase 7 — Quiz + Concepts | 1 session |
| Phase 8 — Reports + Analytics + Gaps | 1 session |
| Phase 9 — History + Polish + Tests | 1 session |
| **Total** | **8 sessions** |

Each session generates production-ready, fully functional code for that phase.
No code is generated until the previous phase is approved and working.
