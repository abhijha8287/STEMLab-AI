# STEMLab AI — Complete API Specification

Base URL: `http://localhost:8000/api/v1`
Content-Type: `application/json`
OpenAPI Docs: `http://localhost:8000/docs`

---

## Common Schemas

### Pagination
```json
{
  "page": 1,
  "page_size": 20,
  "total": 100,
  "pages": 5
}
```

### Error Response
```json
{
  "error": "validation_error",
  "message": "Human-readable description",
  "details": {}
}
```

### Session Header
All requests should include `X-Session-ID: <uuid>` header for anonymous session tracking.
Backend auto-creates a session UUID if not provided and returns it in response headers.

---

## 1. Experiments API

### GET /experiments
List all experiments for session.

Query: `?page=1&page_size=20&type=projectile_motion&status=completed`

Response 200:
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "projectile_motion",
      "title": "Projectile Motion - Run #1",
      "status": "completed",
      "created_at": "2026-06-12T10:00:00Z",
      "completed_at": "2026-06-12T10:05:00Z",
      "result_count": 3
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 42,
  "pages": 3
}
```

### POST /experiments
Create a new experiment session.

Request:
```json
{
  "type": "projectile_motion",
  "title": "My Projectile Experiment"
}
```

Response 201:
```json
{
  "id": "uuid",
  "type": "projectile_motion",
  "title": "My Projectile Experiment",
  "status": "in_progress",
  "created_at": "2026-06-12T10:00:00Z"
}
```

### GET /experiments/{id}
Get experiment with all results.

Response 200:
```json
{
  "id": "uuid",
  "type": "projectile_motion",
  "title": "My Projectile Experiment",
  "status": "completed",
  "created_at": "...",
  "results": [...]
}
```

### PATCH /experiments/{id}
Update experiment status or title.

Request: `{ "status": "completed" }`

### DELETE /experiments/{id}
Soft delete experiment.

---

## 2. Physics API

### POST /physics/projectile-motion
Run projectile motion simulation.

Request:
```json
{
  "experiment_id": "uuid",
  "initial_velocity": 25.0,
  "launch_angle": 45.0,
  "gravity": 9.81,
  "air_resistance": 0.0
}
```

Validation:
- `initial_velocity`: 0.1 – 200.0 m/s
- `launch_angle`: 1.0 – 89.0 degrees
- `gravity`: 1.0 – 30.0 m/s²
- `air_resistance`: 0.0 – 1.0

Response 200:
```json
{
  "result_id": "uuid",
  "experiment_id": "uuid",
  "parameters": {
    "initial_velocity": 25.0,
    "launch_angle": 45.0,
    "gravity": 9.81,
    "air_resistance": 0.0
  },
  "results": {
    "flight_time": 3.609,
    "max_height": 15.924,
    "range": 63.707,
    "time_to_peak": 1.804
  },
  "trajectory": [
    { "t": 0.0, "x": 0.0, "y": 0.0, "vx": 17.678, "vy": 17.678 },
    { "t": 0.1, "x": 1.768, "y": 1.670, "vx": 17.678, "vy": 16.697 }
  ],
  "velocity_x_series": [[0.0, 17.678], [0.1, 17.678]],
  "velocity_y_series": [[0.0, 17.678], [0.1, 16.697]],
  "created_at": "2026-06-12T10:00:00Z"
}
```

### POST /physics/newtons-laws
Run Newton's second law simulation.

Request:
```json
{
  "experiment_id": "uuid",
  "force": 10.0,
  "mass": 2.0,
  "friction_coefficient": 0.3,
  "duration": 5.0
}
```

Validation:
- `force`: 0.1 – 10000.0 N
- `mass`: 0.01 – 10000.0 kg
- `friction_coefficient`: 0.0 – 1.0
- `duration`: 1.0 – 60.0 s

Response 200:
```json
{
  "result_id": "uuid",
  "parameters": { ... },
  "results": {
    "net_force": 4.12,
    "acceleration": 2.06,
    "final_velocity": 10.3,
    "displacement": 25.75
  },
  "velocity_series": [[0.0, 0.0], [0.1, 0.206], ...],
  "acceleration_series": [[0.0, 2.06], [0.1, 2.06], ...]
}
```

### POST /physics/pendulum
Run pendulum simulation.

Request:
```json
{
  "experiment_id": "uuid",
  "length": 1.0,
  "mass": 0.5,
  "initial_angle": 30.0,
  "gravity": 9.81,
  "duration": 10.0
}
```

Validation:
- `length`: 0.1 – 10.0 m
- `mass`: 0.01 – 100.0 kg
- `initial_angle`: 1.0 – 179.0 degrees
- `gravity`: 1.0 – 30.0 m/s²

Response 200:
```json
{
  "result_id": "uuid",
  "results": {
    "period": 2.006,
    "frequency": 0.499,
    "angular_frequency": 3.132,
    "max_velocity": 1.566,
    "max_kinetic_energy": 0.614
  },
  "angle_series": [[0.0, 30.0], [0.05, 29.87], ...],
  "velocity_series": [[0.0, 0.0], [0.05, -0.157], ...]
}
```

### GET /physics/results/{result_id}
Retrieve stored physics result.

---

## 3. Circuit API

### POST /circuits/simulate
Simulate a circuit and solve for voltages/currents.

Request:
```json
{
  "experiment_id": "uuid",
  "components": [
    { "id": "bat1", "type": "battery", "value": 9.0, "unit": "V", "x": 100, "y": 200 },
    { "id": "r1",   "type": "resistor", "value": 100.0, "unit": "Ω", "x": 300, "y": 200 },
    { "id": "r2",   "type": "resistor", "value": 200.0, "unit": "Ω", "x": 300, "y": 350 },
    { "id": "led1", "type": "led",      "value": 2.0,   "unit": "V", "x": 500, "y": 200 },
    { "id": "sw1",  "type": "switch",   "closed": true,              "x": 500, "y": 350 }
  ],
  "connections": [
    { "from": "bat1_positive", "to": "r1_left" },
    { "from": "r1_right",      "to": "led1_anode" },
    { "from": "led1_cathode",  "to": "bat1_negative" }
  ]
}
```

Component types: `battery` | `resistor` | `led` | `switch` | `capacitor`

Response 200:
```json
{
  "result_id": "uuid",
  "valid": true,
  "errors": [],
  "results": {
    "total_voltage": 9.0,
    "total_current": 0.0467,
    "total_resistance": 192.64,
    "total_power": 0.420
  },
  "node_voltages": {
    "node_0": 0.0,
    "node_1": 9.0,
    "node_2": 4.33
  },
  "branch_currents": {
    "bat1": 0.0467,
    "r1": 0.0467,
    "led1": 0.0467
  },
  "component_power": {
    "r1": 0.218,
    "led1": 0.093
  },
  "current_paths": [
    [
      { "component_id": "bat1", "current": 0.0467, "direction": "forward" },
      { "component_id": "r1",   "current": 0.0467, "direction": "forward" }
    ]
  ]
}
```

Response 422 (invalid circuit):
```json
{
  "result_id": "uuid",
  "valid": false,
  "errors": [
    { "code": "short_circuit", "message": "Battery terminals directly connected", "component_ids": ["bat1"] }
  ],
  "results": null
}
```

### POST /circuits/validate
Validate circuit without simulating (faster, for real-time feedback).

Request: same as simulate
Response: `{ "valid": bool, "errors": [...] }`

### GET /circuits/{result_id}
Retrieve stored circuit result.

---

## 4. AI Instructor API

### POST /ai/conversations
Start a new conversation.

Request:
```json
{
  "context_type": "experiment",
  "context_id": "uuid",
  "initial_message": "Can you explain my projectile motion results?"
}
```

Response 201:
```json
{
  "conversation_id": "uuid",
  "title": "Projectile Motion Explanation",
  "messages": [
    { "id": "uuid", "role": "user", "content": "...", "created_at": "..." },
    { "id": "uuid", "role": "assistant", "content": "...", "created_at": "..." }
  ]
}
```

### POST /ai/conversations/{id}/messages
Send a message (non-streaming).

Request: `{ "content": "What if I increase the angle to 60 degrees?" }`

Response 200:
```json
{
  "message_id": "uuid",
  "role": "assistant",
  "content": "Great question! At 60°, you would see...",
  "created_at": "..."
}
```

### POST /ai/conversations/{id}/stream
Send message with streaming response (SSE).

Request: `{ "content": "Explain the physics concepts here" }`

Response: `text/event-stream`
```
data: {"token": "Great", "done": false}
data: {"token": " question!", "done": false}
data: {"token": "", "done": true, "message_id": "uuid"}
```

### GET /ai/conversations
List conversations for session.

Query: `?page=1&page_size=20&context_type=experiment`

### GET /ai/conversations/{id}
Get full conversation with all messages.

### POST /ai/explain-concept
Quick concept explanation (no conversation history).

Request:
```json
{
  "concept": "projectile_motion",
  "detail_level": "beginner"
}
```

Response: `{ "explanation": "...", "key_points": [...], "related_concepts": [...] }`

### POST /ai/analyze-experiment
Analyze an experiment result and identify mistakes/improvements.

Request: `{ "result_id": "uuid" }`

Response:
```json
{
  "analysis": "Your results look correct. The range of 63.7m...",
  "observations": ["Optimal angle for max range is 45°", "Air resistance reduces range by ~12%"],
  "mistakes": [],
  "improvements": ["Try increasing initial velocity to see how range scales"],
  "related_concepts": ["air_resistance", "kinematic_equations"]
}
```

---

## 5. Quiz API

### POST /quizzes/generate
Generate a new quiz using Gemini.

Request:
```json
{
  "topic": "projectile_motion",
  "subject": "physics",
  "difficulty": "intermediate",
  "question_count": 5,
  "question_types": ["mcq", "numerical", "conceptual"]
}
```

Response 201:
```json
{
  "quiz_id": "uuid",
  "title": "Projectile Motion — Intermediate",
  "topic": "projectile_motion",
  "difficulty": "intermediate",
  "question_count": 5,
  "questions": [
    {
      "id": "uuid",
      "question_number": 1,
      "type": "mcq",
      "text": "A projectile is launched at 45° for maximum range. If the angle is changed to 30°, the range will:",
      "options": [
        "Increase",
        "Decrease",
        "Stay the same",
        "Become zero"
      ],
      "topic_tag": "projectile_motion"
    }
  ],
  "created_at": "..."
}
```

Note: `correct_answer` and `explanation` are NOT returned here — only after submission.

### POST /quizzes/{id}/start
Start a quiz attempt.

Response 201:
```json
{
  "attempt_id": "uuid",
  "quiz_id": "uuid",
  "started_at": "..."
}
```

### POST /quizzes/attempts/{attempt_id}/submit
Submit answers and get results.

Request:
```json
{
  "answers": [
    { "question_id": "uuid", "answer": "Decrease", "time_taken_secs": 12 },
    { "question_id": "uuid", "answer": "63.7", "time_taken_secs": 25 }
  ]
}
```

Response 200:
```json
{
  "attempt_id": "uuid",
  "score": 80.0,
  "correct_count": 4,
  "total_questions": 5,
  "time_taken_secs": 183,
  "question_results": [
    {
      "question_id": "uuid",
      "question_text": "...",
      "submitted_answer": "Decrease",
      "correct_answer": "Decrease",
      "is_correct": true,
      "explanation": "At 30°, the range is R·sin(60°)/sin(90°) = 0.866R, which is less than at 45°"
    }
  ],
  "topic_breakdown": {
    "projectile_motion": { "correct": 3, "total": 4, "percentage": 75.0 }
  }
}
```

### GET /quizzes
List quizzes for session.

### GET /quizzes/{id}
Get quiz with questions (no answers).

### GET /quizzes/history
Get all quiz attempts with scores.

Response:
```json
{
  "attempts": [
    {
      "attempt_id": "uuid",
      "quiz_title": "Projectile Motion — Intermediate",
      "score": 80.0,
      "difficulty": "intermediate",
      "topic": "projectile_motion",
      "completed_at": "..."
    }
  ]
}
```

---

## 6. Reports API

### POST /reports/generate
Generate a lab report from experiment results.

Request:
```json
{
  "experiment_id": "uuid",
  "result_id": "uuid"
}
```

Response 201 (report generation begins, content available immediately):
```json
{
  "report_id": "uuid",
  "title": "Lab Report: Projectile Motion",
  "objective": "To investigate the relationship between launch angle and projectile range...",
  "methodology": "A projectile was simulated with initial velocity 25 m/s at 45°...",
  "observations": "The projectile followed a parabolic trajectory...",
  "results": "Flight time: 3.61s, Maximum height: 15.92m, Range: 63.71m",
  "analysis": "The results confirm the theoretical prediction R = v²sin(2θ)/g...",
  "conclusion": "The experiment successfully demonstrated projectile motion principles...",
  "pdf_generated": false,
  "created_at": "..."
}
```

### POST /reports/{id}/export-pdf
Generate and upload PDF, return download URL.

Response 200:
```json
{
  "report_id": "uuid",
  "pdf_url": "https://storage.supabase.co/.../report-uuid.pdf",
  "pdf_size_bytes": 184320,
  "generated_at": "..."
}
```

### GET /reports
List all reports for session.

### GET /reports/{id}
Get full report content.

### DELETE /reports/{id}
Delete report and associated PDF.

---

## 7. Analytics API

### GET /analytics/dashboard
Get all dashboard stats.

Response 200:
```json
{
  "totals": {
    "experiments_run": 42,
    "physics_experiments": 31,
    "circuit_experiments": 11,
    "reports_generated": 8,
    "quizzes_taken": 15
  },
  "quiz_performance": {
    "average_score": 74.2,
    "best_score": 100.0,
    "worst_score": 40.0,
    "total_attempts": 15
  },
  "learning_progress": {
    "concepts_explored": 12,
    "knowledge_gaps_detected": 3,
    "knowledge_gaps_resolved": 1
  },
  "recent_activity": [
    {
      "type": "experiment_completed",
      "description": "Completed Projectile Motion experiment",
      "entity_id": "uuid",
      "timestamp": "2026-06-12T09:45:00Z"
    }
  ]
}
```

### GET /analytics/experiments
Experiment usage breakdown over time.

Query: `?period=30d`

Response:
```json
{
  "period": "30d",
  "by_type": {
    "projectile_motion": 15,
    "newtons_laws": 8,
    "pendulum": 8,
    "circuit": 11
  },
  "by_day": [
    { "date": "2026-06-01", "count": 3 },
    { "date": "2026-06-02", "count": 5 }
  ]
}
```

### GET /analytics/quiz-performance
Quiz score trends.

Query: `?period=30d`

Response:
```json
{
  "score_trend": [
    { "date": "2026-06-01", "score": 60.0, "topic": "projectile_motion" },
    { "date": "2026-06-05", "score": 80.0, "topic": "newtons_laws" }
  ],
  "by_topic": {
    "projectile_motion": { "average": 72.0, "attempts": 5 },
    "circuit_basics": { "average": 65.0, "attempts": 3 }
  }
}
```

### GET /analytics/progress
Learning progress metrics.

Response:
```json
{
  "concepts_mastered": ["velocity", "acceleration", "force"],
  "concepts_in_progress": ["energy", "momentum"],
  "concepts_not_started": ["waves", "electric-current"],
  "mastery_by_subject": {
    "physics": 45.0,
    "chemistry": 10.0,
    "mathematics": 30.0
  },
  "progress_over_time": [
    { "date": "2026-06-01", "concepts_count": 5 },
    { "date": "2026-06-12", "concepts_count": 12 }
  ]
}
```

---

## 8. Concepts API

### GET /concepts
Get all concepts, optionally filtered.

Query: `?subject=physics&category=motion`

Response:
```json
{
  "concepts": [
    {
      "id": "uuid",
      "slug": "projectile-motion",
      "name": "Projectile Motion",
      "subject": "physics",
      "category": "motion",
      "description": "Motion of objects launched into the air...",
      "difficulty": "intermediate",
      "icon": "target",
      "color": "#3B82F6",
      "prerequisite_count": 2,
      "related_count": 4
    }
  ]
}
```

### GET /concepts/{slug}
Get concept detail with edges.

Response:
```json
{
  "id": "uuid",
  "slug": "projectile-motion",
  "name": "Projectile Motion",
  "subject": "physics",
  "category": "motion",
  "description": "...",
  "prerequisites": [
    { "slug": "velocity", "name": "Velocity", "relationship": "prerequisite" },
    { "slug": "acceleration", "name": "Acceleration", "relationship": "prerequisite" }
  ],
  "related": [
    { "slug": "circular-motion", "name": "Circular Motion", "relationship": "related" }
  ],
  "builds_into": [
    { "slug": "orbital-mechanics", "name": "Orbital Mechanics", "relationship": "builds_on" }
  ]
}
```

### POST /concepts/{slug}/explain
Get AI explanation of a concept.

Request:
```json
{
  "detail_level": "intermediate",
  "context": "I just ran a projectile motion experiment and got these results..."
}
```

Response (streaming SSE or JSON):
```json
{
  "explanation": "Projectile motion is the motion of an object...",
  "key_equations": ["R = v₀²sin(2θ)/g", "H = v₀²sin²(θ)/(2g)"],
  "real_world_examples": ["Basketball shots", "Artillery shells"],
  "common_misconceptions": ["Heavier objects fall faster (FALSE)"]
}
```

---

## 9. Knowledge Gaps API

### POST /knowledge-gaps/analyze
Analyze session data and detect gaps.

Request: `{}` (uses session_id from header automatically)

Response 200:
```json
{
  "gaps": [
    {
      "id": "uuid",
      "concept_slug": "energy",
      "concept_name": "Energy Conservation",
      "gap_type": "weak_concept",
      "severity": "high",
      "evidence": {
        "quiz_wrong_answers": 3,
        "experiment_mistakes": ["Used wrong formula for kinetic energy"]
      },
      "recommendation": "Review energy conservation laws before attempting oscillation experiments"
    }
  ],
  "learning_roadmap": [
    {
      "step": 1,
      "concept_slug": "work",
      "concept_name": "Work & Energy",
      "reason": "Prerequisite for energy conservation"
    },
    {
      "step": 2,
      "concept_slug": "energy",
      "concept_name": "Energy Conservation",
      "reason": "Currently your weakest concept"
    }
  ],
  "recommended_experiments": [
    {
      "type": "pendulum",
      "title": "Pendulum Energy Exchange",
      "reason": "Demonstrates energy conservation directly"
    }
  ]
}
```

### GET /knowledge-gaps
Get current knowledge gaps for session.

### PATCH /knowledge-gaps/{id}/resolve
Mark a gap as resolved.

---

## 10. History API

### GET /history
Combined experiment + quiz history.

Query: `?page=1&page_size=20&type=experiment`

Response:
```json
{
  "items": [
    {
      "id": "uuid",
      "item_type": "experiment",
      "title": "Projectile Motion - Run #1",
      "experiment_type": "projectile_motion",
      "status": "completed",
      "result_count": 3,
      "created_at": "...",
      "summary": { "range": 63.7, "max_height": 15.9 }
    }
  ],
  "page": 1,
  "total": 57
}
```

### GET /history/experiments/{id}/compare
Compare two experiment results side-by-side.

Query: `?result_a=uuid&result_b=uuid`

Response:
```json
{
  "result_a": { "parameters": {...}, "results": {...} },
  "result_b": { "parameters": {...}, "results": {...} },
  "differences": [
    { "field": "range", "value_a": 63.7, "value_b": 55.2, "change_pct": -13.0 }
  ]
}
```

---

## Error Codes Reference

| HTTP | Code | Meaning |
|---|---|---|
| 400 | `validation_error` | Request body validation failed |
| 404 | `not_found` | Resource does not exist |
| 422 | `simulation_error` | Physics/circuit simulation failed |
| 429 | `rate_limit` | Too many AI requests |
| 500 | `internal_error` | Unexpected server error |
| 503 | `ai_unavailable` | Gemini API unavailable |

## Rate Limits

| Endpoint Group | Limit |
|---|---|
| Physics simulations | 60/minute |
| Circuit simulations | 60/minute |
| AI chat messages | 20/minute |
| Quiz generation | 10/minute |
| Report generation | 10/minute |
| PDF export | 5/minute |
