from fastapi import APIRouter
from app.models.schemas import HealthResponse, DetailedHealthResponse
from app.services.health_service import HealthService

router = APIRouter(prefix="/api/genai")
health_service = HealthService()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Basic health check endpoint"""
    return health_service.get_basic_health()


@router.get("/health/detailed", response_model=DetailedHealthResponse)
async def detailed_health_check():
    """Detailed health check with dependencies"""
    return health_service.get_detailed_health()


@router.get("/health/status")
async def simple_status():
    """Simple status endpoint"""
    return "OK"


@router.get("/health/debug")
async def debug_health():
    """Debug endpoint to check configuration"""
    return health_service.get_debug_info()