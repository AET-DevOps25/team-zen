from typing import Union
from fastapi import FastAPI, APIRouter

router = APIRouter(prefix="/api")

@router.get("/health")
async def health_check():
    return {"status": "ok"}

app = FastAPI()
app.include_router(router)