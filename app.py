import asyncio
import logging

from aiohttp import web

from server.web_worker import WebWorker
from database.mongo import MongoDB



logging.getLogger().setLevel(logging.INFO)
logging.basicConfig(format='%(levelname)s:%(message)s',
                    datefmt='%d:%m:%Y|%H:%M:%S')


class WebWorkerApp:
    def __init__(self, config):
        self.config = config
        self.data_base = MongoDB(config.mongo.db, config.mongo.url, config.mongo.port)

        self.host = config.web_worker.host
        self.port = config.web_worker.port
        self.loop = asyncio.get_event_loop()
        self.web_worker = WebWorker(self)

    def run(self):
        web.run_app(self.web_worker.web_server, host=self.host, port=self.port)
