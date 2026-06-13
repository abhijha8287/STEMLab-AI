"""
Gemini streaming client for the AI STEM Instructor.

Uses google-genai async API: client.aio.models.generate_content_stream()
Streams text chunks as an async generator.
"""
from __future__ import annotations

from typing import AsyncGenerator

from google import genai
from google.genai import types

from app.core.config import get_settings

SYSTEM_PROMPT = """You are STEMLab AI — an expert STEM tutor embedded in an interactive virtual laboratory. You help students deeply understand Physics and Circuit concepts through clear explanations, step-by-step problem solving, and insights drawn from their own experiment results.

## Your capabilities
- Explain Physics concepts: projectile motion, Newton's laws, simple pendulum, wave mechanics, energy conservation
- Explain Circuit concepts: Ohm's law, series/parallel networks, RC circuits, KVL/KCL, capacitors, inductors
- Walk through mathematical derivations step by step
- Interpret experiment results and explain what they mean
- Suggest follow-up experiments or parameter changes to explore a concept further
- Answer "what if" questions about simulations

## Formatting rules
- Use **bold** for key terms and important values
- Use `code` for equations and variable names
- Use numbered lists for step-by-step derivations
- Keep answers focused — don't pad with unnecessary text
- For math, write equations clearly: e.g. `F_net = ma`, `τ = RC`, `V = IR`
- If the student shares experiment results, reference the actual numbers in your explanation

## Tone
Be encouraging, precise, and conversational. You're a knowledgeable tutor, not a textbook.
"""


def _make_client() -> genai.Client:
    settings = get_settings()
    return genai.Client(api_key=settings.GEMINI_API_KEY)


async def stream_response(
    messages: list[dict[str, str]],
    experiment_context: str = "",
) -> AsyncGenerator[str, None]:
    """
    Async generator that yields text chunks from Gemini.

    messages: list of {"role": "user"|"model", "content": "..."}
    experiment_context: optional summary of the student's recent experiment results
    """
    client = _make_client()

    system = SYSTEM_PROMPT
    if experiment_context:
        system += f"\n\n## Student's current experiment context\n{experiment_context}"

    # Build Gemini contents format
    contents: list[types.Content] = []
    for msg in messages:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(
            types.Content(role=role, parts=[types.Part(text=msg["content"])])
        )

    async for chunk in await client.aio.models.generate_content_stream(
        model="models/gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system,
            max_output_tokens=2048,
            temperature=0.7,
        ),
    ):
        if chunk.text:
            yield chunk.text
