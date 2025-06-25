from flask import Flask, request, jsonify, render_template
import #tbc

app = Flask(__name__, template_folder='templates')

@app.route('/')
def home() :
    return render_template('index.html')

@app.route()

if __name__ == '__main__':
    app.run(debug=True, port=5000)