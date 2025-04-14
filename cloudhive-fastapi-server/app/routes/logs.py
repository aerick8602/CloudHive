from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
import os
import re


router = APIRouter(prefix="/logs", tags=["Server Logs"])


@router.get("/", response_class=JSONResponse)
async def get_app_logs():
    """Fetch and return the application logs from the log file"""

    LOG_FILE_PATH = "logs/app.log"
    if not os.path.exists(LOG_FILE_PATH):
        raise HTTPException(status_code=404, detail="Log file not found.")

    log_entries = []

    # Example log line format:
    # 2025-04-12 10:05:36 | INFO     | app | Some log message
    pattern = re.compile(r"^(?P<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \| (?P<level>\w+)\s+\| app \| (?P<message>.+)$")

    with open(LOG_FILE_PATH, "r", encoding="utf-8") as file:
        for line in file:
            match = pattern.match(line)
            if match:
                log_entries.append({
                    "timestamp": match.group("timestamp"),
                    "level": match.group("level"),
                    "message": match.group("message"),
                })

    return log_entries
