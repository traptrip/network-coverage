from flask import Flask, request, render_template, url_for, redirect

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/train', methods=['GET', 'POST'])
def upload():
    return render_template('index_train.html')


@app.route('/index_train', methods=['GET', 'POST'])
def index_func():
    if request.method == 'POST':
        # do stuff when the form is submitted
        # redirect to end the POST handling
        # the redirect can be to the same route or somewhere else
        return redirect(url_for('index.html'))
    # show the form, it wasn't submitted
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=3434)

