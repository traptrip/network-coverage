from aiohttp import web


async def auth(request):
    data_base = request.app.api.data_base
    data = await request.post()
    name = data['name']
    password = data['password']
    is_user_in_database = await data_base.auth(name, password)
    if is_user_in_database is not None:
        return web.Response(status=201, body=name)
    return web.Response(status=404)


