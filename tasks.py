from invoke import task


@task
def start_web_worker(ctx):
    from app import WebWorkerApp
    web_worker = WebWorkerApp(ctx.config)
    web_worker.run()
