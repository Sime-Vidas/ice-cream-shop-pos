from fastapi import FastAPI

app = FastAPI(title="Ice Cream Shop POS")


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Ice Cream Shop POS backend is running"
    }