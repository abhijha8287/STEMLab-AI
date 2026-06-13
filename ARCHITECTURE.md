# STEMLab AI — Complete Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│   Next.js 15 + TypeScript + TailwindCSS + Shadcn UI             │
│   React Query │ React Three Fiber │ Framer Motion               │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS / SSE
┌─────────────────────────▼───────────────────────────────────────┐
│                     API GATEWAY LAYER                            │
│             FastAPI + Uvicorn  (port 8000)                      │
│      /api/v1  │  OpenAPI Docs  │  CORS Middleware               │
│   Rate Limiting │ Request Logging │ Error Handling              │
└──┬────────┬────────┬───────┬──────────┬────────────────────────┘
   │        │        │       │          │
   ▼        ▼        ▼       ▼          ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────────────────┐
│Phys. │ │Circ. │ │ AI   │ │Quiz  │ │  Analytics / Reporting   │
│Svc   │ │Svc   │ │ Svc  │ │ Svc  │ │       Services           │
└──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──────────┬───────────────┘
   │        │        │        │                  │
   ▼        ▼        ▼        ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REPOSITORY LAYER                              │
│          SQLAlchemy 2.0 Async + Alembic Migrations              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      DATA LAYER                                  │
│   PostgreSQL 16          │   Supabase Storage                   │
│   (experiments, reports, │   (PDFs, exports, assets)            │
│   quizzes, analytics)    │                                       │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                   EXTERNAL SERVICES                              │
│         Google Gemini API  (gemini-2.0-flash)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### Frontend Layer
- **Presentation**: All UI components, pages, layouts
- **State**: React Query for server state, Zustand for local UI state
- **Simulation Rendering**: React Three Fiber for 3D physics, Canvas 2D for circuits
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion for transitions and physics visualizations

### API Gateway Layer
- **Routing**: Versioned `/api/v1/` prefix on all routes
- **Middleware**: CORS, request timing, structured logging, error normalization
- **Documentation**: Auto-generated OpenAPI at `/docs` and `/redoc`
- **Validation**: Pydantic v2 request/response schemas

### Service Layer
- **Physics Engine**: Pure Python physics calculations (projectile motion, Newton's laws, pendulum)
- **Circuit Engine**: Graph-based circuit solver using modified nodal analysis
- **AI Service**: Gemini API wrapper with conversation management and streaming
- **Analytics Engine**: Aggregation queries and progress tracking
- **Reporting Engine**: PDF generation using WeasyPrint + Jinja2 templates

### Repository Layer
- **Pattern**: Repository pattern with async SQLAlchemy sessions
- **Transactions**: Unit of Work pattern for multi-table writes
- **Queries**: Type-safe query builders, no raw SQL except for analytics aggregations

### Data Layer
- **PostgreSQL**: Primary OLTP store for all application data
- **Supabase Storage**: Object storage for generated PDFs and exported files
- **Connection Pooling**: asyncpg with pool size 10-20

## Engine Architecture

### Physics Simulation Engine
```
PhysicsEngine
├── ProjectileMotionSolver    # kinematic equations, air drag (Euler integration)
├── NewtonLawsSolver          # F=ma, friction coefficient, velocity/accel graphs
└── PendulumSolver            # SHM approximation + exact ODE for large angles
```

### Circuit Simulation Engine
```
CircuitEngine
├── GraphBuilder              # converts component/wire JSON → NetworkX graph
├── NodalAnalysisSolver       # Modified Nodal Analysis (MNA) matrix solver
├── CurrentFlowAnimator       # computes per-segment current for frontend animation
└── CircuitValidator          # short circuit, open circuit, floating node detection
```

### AI Service
```
AIService
├── GeminiClient              # async Gemini API wrapper with retry logic
├── ConversationManager       # stores/retrieves conversation history from DB
├── StreamingHandler          # SSE streaming response builder
├── ContextBuilder            # assembles system prompt + experiment context
└── KnowledgeGapAnalyzer      # analyzes patterns across experiments/quizzes
```

### Analytics Engine
```
AnalyticsEngine
├── DashboardAggregator       # counts, totals, recent activity
├── ProgressTracker           # learning progress over time
├── QuizAnalyzer              # score trends, topic weakness detection
└── ExperimentUsageTracker    # frequency analysis per experiment type
```

### Reporting Engine
```
ReportingEngine
├── ReportBuilder             # assembles report sections from experiment data
├── PDFRenderer               # WeasyPrint HTML→PDF with custom STEM stylesheet
├── ChartRenderer             # generates base64 chart images for PDF embedding
└── StorageUploader           # uploads final PDF to Supabase Storage
```

## Deployment Architecture

### Docker Compose (Development)
```
services:
  frontend    → port 3000 (Next.js dev server)
  backend     → port 8000 (Uvicorn with --reload)
  postgres    → port 5432 (PostgreSQL 16)
  nginx       → port 80   (reverse proxy)
```

### AWS Production Architecture
```
Route 53 → CloudFront CDN → ALB
                              ├── ECS Fargate (frontend container)
                              └── ECS Fargate (backend container)
                                       └── RDS PostgreSQL (Multi-AZ)
                                       └── S3 + Supabase Storage (PDFs)
```

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| AI Model | gemini-2.0-flash | Fast, cost-effective, strong STEM knowledge |
| PDF Generation | WeasyPrint | Server-side, no headless browser needed |
| Circuit Solving | MNA (Modified Nodal Analysis) | Industry standard, handles all topologies |
| Physics Integration | Euler + RK4 | Euler for simple cases, RK4 for accuracy |
| Async Framework | asyncpg + SQLAlchemy async | Full async stack, no blocking DB calls |
| ORM | SQLAlchemy 2.0 | Modern async support, migration tooling |
| File Storage | Supabase Storage | S3-compatible, generous free tier |
