FROM python:3.6

ARG APP_DIR=/simple_server
WORKDIR "$APP_DIR"

COPY . $APP_DIR/
RUN pip install -r requirements.txt
