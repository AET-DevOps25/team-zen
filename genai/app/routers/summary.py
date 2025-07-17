from fastapi import APIRouter
from app.models.schemas import SummaryRequest
from app.services.summary_service import SummaryService
from app.services.insights_service import InsightsService

router = APIRouter(prefix="/api/genai")
summary_service = SummaryService()
insights_service = InsightsService()


@router.post("/summary", response_model=dict)
async def get_summary(request: SummaryRequest):
    """Get only the summary from journal snippets"""
    return summary_service.process_summary(request)


@router.post("/insights", response_model=dict)
async def get_insights(request: SummaryRequest):
    """Get only the insights and analysis from journal snippets"""
    return insights_service.process_insights(request)