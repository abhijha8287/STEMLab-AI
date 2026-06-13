from typing import Generic, TypeVar
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    items: list[T]
    page: int
    page_size: int
    total: int
    pages: int


class ErrorResponse(BaseModel):
    error: str
    message: str
    details: dict = {}


class SuccessResponse(BaseModel):
    message: str = "Success"


def paginate(items: list[T], page: int, page_size: int, total: int) -> PaginatedResponse[T]:
    import math
    return PaginatedResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        pages=math.ceil(total / page_size) if page_size > 0 else 0,
    )
