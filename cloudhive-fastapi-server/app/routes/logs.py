from fastapi import APIRouter
from fastapi.responses import JSONResponse
import os
import re
from datetime import datetime

router = APIRouter(prefix="/logs", tags=["Server Logs"])

@router.get("", response_class=JSONResponse)
async def get_app_logs():
    """Fetch and return application logs from app.log and backups like app.log.1, sorted by timestamp"""

    LOG_DIR = "logs"
    LOG_FILES = ["app.log.1", "app.log"] 

    line_pattern = re.compile(
        r"^(?P<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \| (?P<level>\w+)\s+\| app \| (?P<message>.+)$"
    )

    log_entries = []
    for log_file in LOG_FILES:
        path = os.path.join(LOG_DIR, log_file)
        if not os.path.exists(path):
            continue

        with open(path, "r", encoding="utf-8") as file:
            for line in file:
                match = line_pattern.match(line)
                if match:
                    log_entries.append({
                        "timestamp": match.group("timestamp"),
                        "level": match.group("level"),
                        "message": match.group("message"),
                    })

    log_entries.sort(key=lambda x: datetime.strptime(x["timestamp"], "%Y-%m-%d %H:%M:%S"),reverse=True)

    return log_entries
 