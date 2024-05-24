FROM python:3.9-slim-bullseye

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY utils /workspace/utils
COPY server /workspace/server

WORKDIR /workspace

ENTRYPOINT ["uvicorn"]
CMD ["server.main:app", "--host=0.0.0.0", "--workers=1"]
