from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

# Import routers using absolute imports
from app.routers.health import router as health_router
from app.routers.summary import router as summary_router

# Import services for root-level endpoints using absolute imports

# Initialize FastAPI app
app = FastAPI(
    title="GenAI Microservice",
    description="LLM Summarization Service for Journal Entries",
    version="1.0.0"
)

# Include routers
app.include_router(health_router)
app.include_router(summary_router)

# Instrumentation for Prometheus metrics
Instrumentator().instrument(app).expose(app)