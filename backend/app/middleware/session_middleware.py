import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

SESSION_COOKIE = "stemlab_session"
SESSION_HEADER = "X-Session-ID"


class SessionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        session_id = (
            request.headers.get(SESSION_HEADER)
            or request.cookies.get(SESSION_COOKIE)
            or str(uuid.uuid4())
        )
        request.state.session_id = session_id
        response = await call_next(request)
        response.set_cookie(
            SESSION_COOKIE,
            session_id,
            max_age=60 * 60 * 24 * 365,
            httponly=True,
            samesite="lax",
        )
        response.headers[SESSION_HEADER] = session_id
        return response
