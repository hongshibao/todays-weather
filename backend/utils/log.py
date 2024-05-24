import os

if "LOGURU_FORMAT" not in os.environ:
    os.environ["LOGURU_FORMAT"] = (
        "{time:YYYY-MM-DDTHH:mm:ss:SSS!UTC} - {level} - {process}:{thread} - {extra} "
        "- {name}:{function}:{line} - {message}"
    )
if "LOGURU_LEVEL" not in os.environ:
    os.environ["LOGURU_LEVEL"] = "DEBUG"


import loguru

logger = loguru.logger

logger.configure(extra={"correlation_id": None})
