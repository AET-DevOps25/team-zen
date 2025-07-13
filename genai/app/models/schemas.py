from pydantic import BaseModel
from typing import List, Dict


class SummaryRequest(BaseModel):
    snippetContents: List[str]


class InsightsResponse(BaseModel):
    mood: str
    suggestion: str
    achievement: str
    wellness: str


class SummaryResponse(BaseModel):
    summary: str
    analysis: str
    insights: InsightsResponse


class HealthResponse(BaseModel):
    status: str
    service: str
    port: int
    timestamp: str
    version: str


class DetailedHealthResponse(BaseModel):
    status: str
    service: str
    port: int
    timestamp: str
    version: str
    dependencies: Dict[str, str]
    configuration: Dict[str, str]