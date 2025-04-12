import os
import logging
import logging.config

LOG_FILE_PATH = "logs/app.log"
LOGGING_CONFIG = "app/logging.ini"
os.makedirs("logs", exist_ok=True)

if os.path.exists(LOGGING_CONFIG):
    logging.config.fileConfig(LOGGING_CONFIG, disable_existing_loggers=False)
else:
    print("⚠️ logging.ini NOT found! Using fallback basic logging.")
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)-8s | %(name)-15s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler = logging.FileHandler(LOG_FILE_PATH, mode="a", encoding="utf-8")
    handler.setFormatter(formatter)
    logging.basicConfig(level=logging.INFO, handlers=[handler])

logger = logging.getLogger("app")

