from flask import Flask, request, jsonify, render_template
import mysql.connector 
from mysql.connector import Error

app = Flask(__name__, template_folder='templates')

@app.route('/')
def home() :
    print("Rendering")
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)