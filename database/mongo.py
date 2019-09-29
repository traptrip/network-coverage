import os

import motor.motor_asyncio


class MongoDB:
    def __init__(self, db_name, host, port, **kwargs):
        self.db_name = db_name
        self.uri = os.getenv('DOCKER_MONGO', f"mongodb://{host}:{port}/")
        self.mongo = motor.motor_asyncio.AsyncIOMotorClient(self.uri)
        self.db = self.mongo[db_name]

    async def auth(self, name, password):
        collection_name = 'users'
        return self.db[collection_name].find({'name': name, 'password': password})

