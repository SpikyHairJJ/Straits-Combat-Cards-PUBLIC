from flask import Flask, request, jsonify, render_template, redirect, url_for
import mysql.connector 
from mysql.connector import Error
import time

app = Flask(__name__, template_folder='templates')
app.config['SECRET_KEY'] = 'gavavnue9204hu7bnwyw034tmg'

DB_CONFIG = {
    'host': 'localhost',
    'port': 3306, # Default MySQL port
    'user': 'root',
    'password': 'dwj.sql418813', #
    'database': 'mysql' 
}


@app.route('/')
def home() :
    print("Rendering")
    return render_template('index.html')

@app.route('/auth')
def authR() :
    print("authRendering")
    return render_template('auth/auth.html')

@app.route('/api/signin', methods=['POST'])
def signIn() :
    conn = None
    cursor = None
    errorCode = 400
    eCode = "x"
    try:
        if not request.is_json:
            eCode = "xH400E009"
            raise ValueError("Request is Not JSON")
        
        # Get Data
        data = request.json
        uniPass = data.get('uniPass')
        username = data.get('username')
        password = data.get('password')
        newUser = data.get('newUser')
        rememberMe = data.get('rememberMe')
        if newUser == True:
            newUsername = data.get('newUsername')
            if not newUsername:
                eCode = "xH400E005"
                raise ValueError("Set a username")

        # Check if fields are not empty
        if not uniPass or not username or not password:
            eCode = "xH400E004"
            raise ValueError("Missing fields")        
        
        # Check Universal Password
        if uniPass != "scc88yay":
            eCode = "xH401E008"
            errorCode = 401
            raise ValueError("Wrong Universal Password")

        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():

            print("Connected to MySQL")
            cursor = conn.cursor(dictionary=True)

            # Finding User
            cursor.execute("SELECT * FROM sys.player_data WHERE player_name = %s", (username,))
            row = cursor.fetchone()
            if not row:
                cursor.execute("SELECT * FROM sys.player_data WHERE username = %s", (username,))
                row = cursor.fetchone()
                
                if not row:
                    errorCode = 404
                    eCode = "xH404E002"
                    raise ValueError("Player not found")
            
            userId = row['id']

            # Check Password
            if row['pw'] != password:
                errorCode = 401
                eCode = "xH401E003"
                raise ValueError("Wrong Password")

            # STEP 1: NEW USER
            if newUser:
                
                if row['first_time'] == 0: # If user is not new but selected new user   
                    eCode = "xH409E006"
                    errorCode = 409
                    raise ValueError("User already exists") # END POSSIBILITY 1: User not new but selected new user (returns error)
                

                return jsonify({ # END POSSIBILITY 2: User is new
                        "id": userId,
                        "newUsername": newUsername,
                        "actions": ["nu"],
                        "rememberMe": rememberMe
                    }), 200

            else:
                if row['first_time'] == 1: # If user is new but did not select new user

                    return jsonify({ # END POSSIBILITY 3: User is new but did not select new user (returns action needed s001)
                        "step": "s001",
                        "id": userId,
                        "newUsername": "",
                        "actions": [],
                        "rememberMe": rememberMe
                    }), 202
                
                else: # If user is not new

                    return jsonify({ # END POSSIBILITY 4: User is not new
                        "id": userId,
                        "newUsername": "",
                        "actions": [],
                        "rememberMe": rememberMe
                    }), 200

    # SIGN IN STEP 1 END. NOT NEEDED VARIABLES: username, password, uniPass. NEEDED VARIABLES: userId, newUsername, rememberMe            

    except ValueError as e:
        if conn:
            conn.rollback()
        
        return jsonify({
            "error": str(e),
            "code": eCode
        }), errorCode
    except mysql.connector.Error as err:
        print(f"error: {err}")

        if conn:
            conn.rollback()
        
        return jsonify({
            "error": str(e),
            "code": "xH500E001"
        }), errorCode
    except Exception as e:
        print("error:", e)
        return jsonify({
            "error": str(e),
            "code": "xH500E011"
        }), 400

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()



@app.route('/api/signin2', methods=['POST'])
def signIn2() :
    conn = None
    cursor = None
    errorCode = 400
    eCode = "x"
    try:
        if not request.is_json:
            eCode = "xH400E009"
            raise ValueError("Request is Not JSON")
        
        # Get Data
        data = request.json
        id = data.get('id')
        newUsername = data.get('newUsername')
        rememberMe = data.get('rememberMe')
        actions = data.get('actions')
        
        # Connect to mysql
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():

            print("Connected to MySQL")
            cursor = conn.cursor(dictionary=True)

            # Check sessions table if there is another session
            cursor.execute("SELECT * FROM sys.sessions WHERE user_id = %s", (id,))
            rows = cursor.fetchall()
            if rows:
                return jsonify({ # END POSSIBILITY 1: Other session(s) detected  (returns action needed s002)
                    "step": "s002",
                    "id": id,
                    "newUsername": newUsername,
                    "actions": actions,
                    "rememberMe": rememberMe
                }), 202


        

if __name__ == '__main__':
    app.run(debug=True, port=5000)


