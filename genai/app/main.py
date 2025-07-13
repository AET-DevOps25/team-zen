from fastapi import FastAPI
import os
from prometheus_fastapi_instrumentator import Instrumentator

# Import routers using absolute imports
from app.routers.health import router as health_router
from app.routers.summary import router as summary_router

# Import services for root-level endpoints using absolute imports
from app.services.health_service import HealthService
from app.models.schemas import HealthResponse, DetailedHealthResponse

# Initialize FastAPI app
app = FastAPI(
    title="GenAI Microservice",
    description="LLM Summarization Service for Journal Entries",
    version="1.0.0"
)

# Include routers
app.include_router(health_router)
app.include_router(summary_router)

# Initialize health service for root endpoints
health_service = HealthService()

# Root-level health endpoints (for API Gateway compatibility)
@app.get("/health", response_model=HealthResponse)
async def root_health_check():
    """Basic health check endpoint at root level"""
    return health_service.get_basic_health()

@app.get("/health/detailed", response_model=DetailedHealthResponse)
async def root_detailed_health_check():
    """Detailed health check at root level"""
    return health_service.get_detailed_health()

@app.get("/health/status")
async def root_simple_status():
    """Simple status endpoint at root level"""
    return "OK"

@app.get("/health/debug")
async def root_debug_health():
    """Debug endpoint at root level"""
    return health_service.get_debug_info()

# Instrumentation for Prometheus metrics
Instrumentator().instrument(app).expose(app)