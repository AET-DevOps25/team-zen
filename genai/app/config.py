import os
from datetime import datetime

# Configuration constants
SERVICE_NAME = "genai-microservice"
SERVICE_VERSION = "1.0.0"
DEFAULT_PORT = 8082

# Environment variables
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
GENAI_API_URL = os.getenv("GENAI_API_URL", "https://gpu.aet.cit.tum.de/api/chat/completions")
PORT = int(os.getenv("PORT", DEFAULT_PORT))


def get_service_info() -> dict:
    """Get basic service information"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "port": PORT,
        "timestamp": datetime.now().isoformat()
    }