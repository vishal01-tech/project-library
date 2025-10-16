from fastapi.responses import JSONResponse
from typing import Any, Optional

def success_response(data: Any, message: str = "Request successful", status_code: int = 200):
    """
    Standard response for successful API requests
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data
        }
    )

def error_response(message: str = "Something went wrong", status_code: int = 400, details: Optional[Any] = None):
    """
    Standard response for error API requests
    """
    content = {
        "success": False,
        "message": message
    }
    if details:
        content["details"] = details
    return JSONResponse(
        status_code=status_code,
        content=content
    )

