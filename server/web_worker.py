from aiohttp import web

from server.view.auth import auth

d = {
"jsonrpc":"2.0", "method":"get.train.nums", "params":{
"date":"29.09.2019",
"code0":"2040000",
"code1":"2000000"
}
}


class WebWorker:

    def __init__(self, app):
        self.data_base = app.data_base
        self.web_server = web.Application(loop=app.loop)

        routes = [
            web.route('*', '/auth', auth),
        ]
        self.web_server.add_routes(routes)
        self.web_server.api = app
        self.app = app
