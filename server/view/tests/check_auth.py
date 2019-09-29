# async def test_check_user(test_client, create_app):
#     client = await test_client(create_app)
#     resp = await client.post('/auth', data={
#                                             'name': 'test',
#                                             'password': 'test'
#                                              })
#     assert resp.status == 201 or resp.status == 400

import asyncio

import aiohttp


async def check_auth():
    async with aiohttp.ClientSession() as session:
        resp = await session.post('http://0.0.0.0:8000/auth', data={
                                                'name': 'test',
                                                'password': 'test'
                                                 })
        print(resp.status)
        print(await resp.text())


loop = asyncio.get_event_loop()
loop.run_until_complete(check_auth())