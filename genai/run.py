#!/usr/bin/env python3
"""
Entry point for running the GenAI microservice.
This file sets up the proper Python path and imports to avoid relative import issues.
"""

import os
import sys
import uvicorn

# Add the current directory to Python path to enable absolute imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the app from the app module
from app.main import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8082))
    
    print(f"Starting GenAI Microservice on port {port}")
    print(f"API Documentation available at: http://localhost:{port}/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0", 
        port=port,
        reload=False
    )