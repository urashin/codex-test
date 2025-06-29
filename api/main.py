from fastapi import FastAPI
import httpx
import os
import redis

app = FastAPI()
REDIS = redis.Redis.from_url(os.environ["REDIS_URL"])
RUNNER = os.environ["RUNNER_URL"]

@app.post("/run")
async def run_code(payload: dict):
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{RUNNER}/execute", json=payload)
        out = r.json()
        REDIS.set("last", str(out))
        return out
