from fastapi import FastAPI, APIRouter

router = APIRouter(prefix="/api/genai")

@router.get("/health")
async def health_check():
    return {"status": "ok"}

app = FastAPI()
app.include_router(router)