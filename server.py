from flask import Flask, request, jsonify, render_template
import mysql.connector 
from mysql.connector import Error

app = Flask(__name__, template_folder='templates')
app.config['SECRET_KEY'] = 'gavavnue9204hu7bnwyw034tmg'

@app.route('/')
def home() :
    print("Rendering")
    return render_template('index.html')

@app.route('/auth')
def auth() :
    print("authRendering")
    return render_template('auth/auth.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)