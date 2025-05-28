from typing import Union
from fastapi import FastAPI, APIRouter

router = APIRouter(prefix="/api/genai")

@router.get("/")
async def read_root():
    return {"Hello": "World"}

@router.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

app = FastAPI()
app.include_router(router)