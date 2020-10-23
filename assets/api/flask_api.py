#!/Users/griffin/.pyenv/shims/python

from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS
import json
from flask import Response
from geojson import Feature, FeatureCollection
import geojson
from assets.api.flask_api_02 import load_data
import geocoder

from assets.api.misc_functions import haversine, bearing

app = Flask(__name__)
CORS(app)
exclusion = False
KEY = 'pk.eyJ1Ijoic2FpY2hhbmQxMTA2IiwiYSI6ImNrZmhpbWh0cDB1bWEydW81dDNhb3k0NHoifQ.vtJmmCRIquFzldFTsdJlpw'
STATE_BBOXS = load_data("./data/us_states_bbox.csv")

"""
  ____    _  _____  _      ____    _    ____ _  _______ _   _ ____
 |  _ \  / \|_   _|/ \    | __ )  / \  / ___| |/ / ____| \ | |  _ \
 | | | |/ _ \ | | / _ \   |  _ \ / _ \| |   | ' /|  _| |  \| | | | |
 | |_| / ___ \| |/ ___ \  | |_) / ___ \ |___| . \| |___| |\  | |_| |
 |____/_/   \_\_/_/   \_\ |____/_/   \_\____|_|\_\_____|_| \_|____/

Helper classes to act as our data backend.
"""

with open("./data/states.json") as f:
    data = f.read()
STATES = json.loads(data)


"""
   ____   ___  _   _ _____ _____ ____  
  |  _ \ / _ \| | | |_   _| ____/ ___| 
  | |_) | | | | | | | | | |  _| \___ \ 
  |  _ <| |_| | |_| | | | | |___ ___) |
  |_| \_\\___/ \___/  |_| |_____|____/ 
"""

@app.route("/token", methods=["GET"])
def getToken():
    """ getToken: this gets mapbox token
    """
    with open("~/mapboxtoken.txt") as f:
        tok = f.read()
    token = {'token':tok}

    print()

    return token

@app.route("/", methods=["GET"])
def getRoutes():
    """ getRoutes: this gets all the routes to display as help for developer.
    """
    routes = {}
    for r in app.url_map._rules:
        
        routes[r.rule] = {}
        routes[r.rule]["functionName"] = r.endpoint
        routes[r.rule]["help"] = formatHelp(r.endpoint)
        routes[r.rule]["methods"] = list(r.methods)

    routes.pop("/static/<path:filename>")
    routes.pop("/")

    response = json.dumps(routes,indent=4,sort_keys=True)
    response = response.replace("\n","<br>")
    return "<pre>"+response+"</pre>"


@app.route('/geo/direction/')
def get_direction():
    """ Description: Return the direction between two lat/lon points.
        Params: 
            lng1 (float) : point 1 lng
            lat1 (float) : point 1 lat
            lng2 (float) : point 1 lat
            lat2 (float) : point 1 lat

        Example: http://localhost:8080/geo/direction/?lng1=-98.4035194716&lat1=33.934640760&lng2=-98.245591004&lat2=34.0132220288
    """
    lng1 = request.args.get('lng1',None)
    lat1 = request.args.get('lat1',None)
    lng2 = request.args.get('lng2',None)
    lat2 = request.args.get('lat2',None)

    b = bearing((float(lng1),float(lat1)), (float(lng2),float(lat2)))

    return handle_response([{"bearing":b}],{'lat1':lat1,'lng1':lng1,'lat2':lat2,'lng2':lng2})


# Same API as flask_api, i copied it here because i can't run both flask_api and flask_api_02 at the same time
@app.route('/state_bbox/', methods=["GET"])
def state_bbox():
    """ Description: return a bounding box for a us state
        Params: 
            None
        Example: http://localhost:8080/state_bbox/<statename>
    """
    state = request.args.get('state',None)
    
    if not state:
        results = STATE_BBOXS
        return handle_response(results)
    
    state = state.lower()
    
    results = []
    for row in STATE_BBOXS:
        if row['name'].lower() == state or row['abbr'].lower() == state:
            row['xmax'] = float(row['xmax'])
            row['xmin'] = float(row['xmin'])
            row['ymin'] = float(row['ymin'])
            row['ymax'] = float(row['ymax'])
            results = row        

    return handle_response(results)

@app.route('/states', methods=["GET"])
def states():
    """ Description: return a list of US state names
        Params: 
            None
        Example: http://localhost:8080/states?filter=mis
    """
    filter = request.args.get('filter',None)
    
    if filter:
        results = []
        for state in STATES:
            if filter.lower() == state['name'][:len(filter)].lower():
                results.append(state)
    else:
        results = STATES

    return handle_response(results)

# Current_points_index is for naming purpose, it works as an identifier to give each shape different name 
current_points_index = 0

#This api adds coords of created object (point, polygon, LineString) and stores it in a JSON file
@app.route('/save_points', methods=['POST'])
def save_points():
    # Path of json file where you want to store the points, can be named on the user's name
    # EX: user's name is: TOTO, filename can be TOTO.json, name can be extracted from request.
    file_path = 'points.json'
    user_points = {}
    global current_points_index
    if request.method == 'POST':
        with open('points.json', 'a+') as points_file:

            # Deserialize request data (coords and shape type)
            data = json.loads(request.data)
            coords = data[0]
            geo_type = data[1]
            coords = coords if len(coords) >= 2 else coords[0]

            # Naming the key of the data based on current_points_index and shape type
            user_points[geo_type +'-'+str(current_points_index)] = []
            user_points[geo_type +'-'+str(current_points_index)].extend(coords)

            # Writing data into a JSON file

            json.dump(user_points, points_file)
            points_file.write('\n')
            current_points_index += 1

    return Response(status=201, mimetype='application/json')

# API to load user previous selected points from a JSON file
@app.route('/load_points', methods=['GET'])
def load_points():
    if request.method == 'GET':
        # FIle name depends on user, this name is just for testing and can be changed depending
        # on developer's choice (for example using username from request...)
        filename = 'points.json'
        with open(filename, 'r') as points_file:
            features = []
            for data in points_file:
                data = json.loads(data)
                for key in data:
                    coords = [data[key]] if key.split('-')[0] == "Polygon" else data[key]
                    features.append(Feature(geometry={'type':key.split('-')[0], 'coordinates': coords}))
            feature_collection = FeatureCollection(features)
        return handle_response([feature_collection])

# Getting data from one of the geojson files and send it to the frontend
@app.route('/display_points', methods=['POST'])
def display_points():
    if request.method == 'POST':
        data = json.loads(request.data)
        db_name = './data/' + data + '.json'
        db_data = load_data(db_name)

        return db_data;

# Getting geojson data inside US rails File
@app.route('/get_rails', methods=['GET'])
def get_rails():
    if request.method == 'GET':
        with open('./data/us_railroads_with_states1.geojson', 'r') as f:
            gj = geojson.load(f)
    return handle_response([gj])  
        
    
# This function is for proccessing crash_data, it was built but not used because in order to find crash location
# we need to send API calls to extract lng and lat, and it will generate a 429 error (too many requests)
# a better option would be using data with lng and lat
# We can use a local file, but again it will take alot of time to process it (more than a user can have)
def proccess_crash_data(db_data):
    for data in db_data:
        for dicts in db_data[data]:
            search_data = dicts.get('Route') if dicts.get('Route') != '?' else dicts.get('Country')
            g = geocoder.mapbox(search_data, key=KEY)


# this function is for getting lng and lat from airports file and return it as a list
def proccess_airports_data(db_data, polygon):
    selected_points = []
    for data in db_data:    
            lng = db_data[data].get('lon')
            lat = db_data[data].get('lat')
            coords = [lng, lat]
            selected_points.append(coords)
    return selected_points


"""
   ____  ____  _____     ___  _____ _____ 
  |  _ \|  _ \|_ _\ \   / / \|_   _| ____|
  | |_) | |_) || | \ \ / / _ \ | | |  _|  
  |  __/|  _ < | |  \ V / ___ \| | | |___ 
  |_|   |_| \_\___|  \_/_/   \_\_| |_____|
"""

def handle_response(data,params=None,error=None):
    """ handle_response
    """
    success = True
    if data:
        if not isinstance(data,list):
            data = [data]
        count = len(data)
    else:
        count = 0
        error = "Data variable is empty!"

    
    result = {"success":success,"count":count,"results":data,"params":params}

    if error:
        success = False
        result['error'] = error
    
    
    return jsonify(result)

def formatHelp(route):
    """ Gets the __doc__ text from a method and formats it
        for easier viewing. Whats "__doc__"? This text
        that your reading is!!
    """
    help = globals().get(str(route)).__doc__
    if help != None:
        help = help.split("\n")
        clean_help = []
        for i in range(len(help)):
            help[i] = help[i].rstrip()
            if len(help[i]) > 0:
                clean_help.append(help[i])
    else:
        clean_help = "No Help Provided."
    return clean_help

def isFloat(string):
    """ Helper method to test if val can be float
        without throwing an actual error.
    """
    try:
        float(string)
        return True
    except ValueError:
        return False

def isJson(data):
    """ Helper method to test if val can be json
        without throwing an actual error.
    """
    try:
        json.loads(data)
        return True
    except ValueError:
        return False

if __name__ == '__main__':
      app.run(host='0.0.0.0', port=8080,debug=True)
      
