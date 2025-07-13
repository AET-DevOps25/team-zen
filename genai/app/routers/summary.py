from fastapi import APIRouter
from app.models.schemas import SummaryRequest, SummaryResponse
from app.services.summary_service import SummaryService

router = APIRouter(prefix="/api/genai")
summary_service = SummaryService()


@router.post("/summary", response_model=SummaryResponse)
async def summarize(request: SummaryRequest):
    """Summarize journal snippets and provide insights"""
    return summary_service.process_summary(request)