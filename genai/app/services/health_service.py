import os
import sys
from datetime import datetime
from app.models.schemas import HealthResponse, DetailedHealthResponse
from app.services.llm_service import check_genai_api_health, get_system_info


class HealthService:
    """Service for handling health check operations"""
    
    def __init__(self):
        self.service_name = "genai-microservice"
        self.version = "1.0.0"
    
    def get_basic_health(self) -> HealthResponse:
        """Get basic health status"""
        port = int(os.getenv("PORT", 8082))
        return HealthResponse(
            status="UP",
            service=self.service_name,
            port=port,
            timestamp=datetime.now().isoformat(),
            version=self.version
        )
    
    def get_detailed_health(self) -> DetailedHealthResponse:
        """Get detailed health status with dependencies"""
        port = int(os.getenv("PORT", 8082))
        
        # Check dependencies
        genai_api_status = check_genai_api_health()
        
        # Determine overall status
        overall_status = "UP" if genai_api_status in ["UP", "DISABLED"] else "DEGRADED"
        
        dependencies = {
            "genai-api": genai_api_status,
            "python-version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
            "langchain": "configured"
        }
        
        api_key = os.getenv("GENAI_API_KEY")
        configuration = {
            "genai-api-key": "enabled" if api_key and api_key != "dummy" else "disabled",
            "prometheus-metrics": "enabled",
            "fastapi-server": "enabled"
        }
        
        return DetailedHealthResponse(
            status=overall_status,
            service=self.service_name,
            port=port,
            timestamp=datetime.now().isoformat(),
            version=self.version,
            dependencies=dependencies,
            configuration=configuration
        )
    
    def get_debug_info(self) -> dict:
        """Get debug information"""
        return get_system_info()