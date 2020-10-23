//mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpY2hhbmQxMTA2IiwiYSI6ImNrZmhpbWh0cDB1bWEydW81dDNhb3k0NHoifQ.vtJmmCRIquFzldFTsdJlpw';
mapboxgl.accessToken = atob('cGsuZXlKMUlqb2ljblZuWW5sd2NtOW1JaXdpWVNJNkltTnBaM00xYURad2J6QXlNbkYxYzIweGNuTTRaR293WVdRaWZRLnM2Z2hzY091OThoZTIzMEZWMV83Mnc=');

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-69.0297, 7.61],
    zoom: 2,
    attributionControl: true,
    preserveDrawingBuffer: true,
});

// handles click/touch event across devices 
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
let layerID = 0;
let layers_dict = {}

// navigation controls
map.addControl(new mapboxgl.NavigationControl()); // zoom controls

// scale bar
map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 90,
    unit: 'imperial',
    position: 'bottom-right'
}));

// geolocate control
map.addControl(new mapboxgl.GeolocateControl());

//This overides the Bootstrap modal "enforceFocus" to allow user interaction with main map
$.fn.modal.Constructor.prototype.enforceFocus = function () { };

// print function
var printBtn = document.getElementById('mapboxgl-ctrl-print');
var exportView = document.getElementById('export-map');

var printOptions = {
    disclaimer: "print output disclaimer",
    northArrow: 'assets/plugins/print-export/north_arrow.svg'
}

printBtn.onclick = function (e) {
    PrintControl.prototype.initialize(map, printOptions)
}

exportView.onclick = function (e) {
    PrintControl.prototype.exportMap();
    e.preventDefault();
}


// Layer Search Event Handlers
$('#search_general').on('click', function (e) {

    var criteria = $('#general_search').val();
    var prop = $('#property-descr').text();
    var layer_mapfile = $('#json_layer').val();

    addJsonLayerFilter(layer_mapfile, prop, criteria);

});

$('#clear_general').on('click', function (e) {

    $("#general_search").val("");
    $("#property-descr").html("<br />");
    clearFilterLayer();

});

// Geocoder API
// Geocoder API
// Geocoder API
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});



var addressTool = document.getElementById('addressAppend');
addressTool.appendChild(geocoder.onAdd(map))

map.on('load', function () {
    map.addSource('geocode-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "geocode-point",
        "source": "geocode-point",
        "type": "circle",
        "paint": {
            "circle-radius": 20,
            "circle-color": "dodgerblue",
            'circle-opacity': 0.5,
            'circle-stroke-color': 'white',
            'circle-stroke-width': 3,
        }
    });

    geocoder.on('result', function (ev) {
        map.getSource('geocode-point').setData(ev.result.geometry);
    });

});

//Enter Lat Long
//Enter Lat Long
//Enter Lat Long

map.on('load', function () {

    $(document).ready(function () {


        //clear
        $('#findLLButtonClear').click(function () {

            map.removeLayer("enterLL");
            map.removeSource("enterLL");

            if (map.getLayer("enterLL")) {
                map.removeLayer("enterLL");
                map.removeSource("enterLL");
            }

        });

        //create
        $('#findLLButton').click(function () {

            var enterLng = +document.getElementById('lngInput').value
            var enterLat = +document.getElementById('latInput').value

            var enterLL = turf.point([enterLng, enterLat]);

            map.addSource('enterLL', {
                type: 'geojson',
                data: enterLL
            });

            map.addLayer({
                id: 'enterLL',
                type: 'circle',
                source: 'enterLL',
                layout: {

                },
                paint: {
                    "circle-color": 'red',
                    "circle-radius": 8,
                },
            });

            map.flyTo({
                center: [enterLng, enterLat]
            });

        });
    });
});

// Coordinates Tool
// Coordinates Tool
// Coordinates Tool
map.on(touchEvent, function (e) {
    document.getElementById('info').innerHTML =
        JSON.stringify(e.lngLat, function (key, val) { return val.toFixed ? Number(val.toFixed(4)) : val; }).replace('{"lng":', '').replace('"lat":', ' ').replace('}', '')
});

//Layer Tree
//Layer Tree
//Layer Tree

//Load Layers
// Layers that load first will be at the bottom of the root directory within the Layer Tree

var emptyGJ = {
    'type': 'FeatureCollection',
    'features': []
};

map.on('load', function () {

    //monster layers
    //Mr. Claw layer sources
    map.addSource('monster', { type: 'geojson', data: emptyGJ });
    map.addSource('mouth', { type: 'geojson', data: emptyGJ });
    map.addSource('water-line', { type: 'geojson', data: emptyGJ });
    map.addSource('eyes', { type: 'geojson', data: emptyGJ });

    map.addLayer({
        "id": "monster",
        "type": "fill",
        "source": "monster",
        "layout": {
      //"visibility": 'none'
        },
        "paint": {
            'fill-color': '#b30000',
            'fill-opacity': 1.0
        }
    });

    map.addLayer({
        "id": "mouth",
        "type": "fill",
        "source": "mouth",
        "layout": {
            //"visibility": 'none'
        },
        "paint": {
            'fill-color': 'white',
            'fill-opacity': 1.0
        }
    });

    map.addLayer({
        "id": "water-line",
        "type": "line",
        "source": "water-line",
        "layout": {
            // "visibility": 'none'
        },
        "paint": {
            'line-color': '#0099ff',
            'line-opacity': 1.0,
            "line-width": 9,
        },
    });

    map.addLayer({
        "id": "eyes",
        "type": "circle",
        "source": "eyes",
        "layout": {
            //"visibility": 'none'
        },
        "paint": {
            'circle-color': 'white',
            'circle-opacity': 1.0,
            'circle-stroke-color': 'black',
            'circle-stroke-width': 3,
            'circle-stroke-opacity': 1.0,
        }
    });

    //monster layers
    //Mr. Octo layer sources
    map.addSource('octo', { type: 'geojson', data: emptyGJ });
    map.addSource('water-line-2', { type: 'geojson', data: emptyGJ });
    map.addSource('mouth2', { type: 'geojson', data: emptyGJ });
    map.addSource('eyes2', { type: 'geojson', data: emptyGJ });

    map.addLayer({
        "id": "octo",
        "type": "fill",
        "source": "octo",
        "layout": {
            //"visibility": 'none'
        },
        "paint": {
            'fill-color': 'black',
            'fill-opacity': 1.0
        }
    });

    map.addLayer({
        "id": "water-line-2",
        "type": "line",
        "source": "water-line-2",
        "layout": {
            // "visibility": 'none'
        },
        "paint": {
            'line-color': '#0099ff',
            'line-opacity': 1.0,
            "line-width": 9,
        },
    });
    map.addLayer({
        "id": "mouth2",
        "type": "fill",
        "source": "mouth2",
        "layout": {
            //"visibility": 'none'
        },
        "paint": {
            'fill-color': 'white',
            'fill-opacity': 1.0
        }
    });

    map.addLayer({
        "id": "eyes2",
        "type": "circle",
        "source": "eyes2",
        "layout": {
            //"visibility": 'none'
        },
        "paint": {
            'circle-color': 'red',
            'circle-opacity': 1.0,
            'circle-stroke-color': 'lightblue',
            'circle-stroke-width': 4,
            'circle-stroke-opacity': 1.0,
        }
    });

    //cultural layers
    //cultural layers
    map.addSource('country', { type: 'geojson', data: emptyGJ });
    map.addLayer({
        "id": "country",
        "type": "fill",
        "source": "country",
        "layout": {
            //"visibility": 'none'
        },
        "paint": {
            'fill-color': '#595959',
            'fill-opacity': .5,
            'fill-outline-color': '#333333',
        }
    });


    map.addSource('populated', { type: 'geojson', data: emptyGJ });
    map.addLayer({
        "id": "populated",
        "type": "circle",
        "source": "populated",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'circle-color': 'white',
            'circle-opacity': 1.0,
            'circle-stroke-color': '#ff8c1a',
            'circle-stroke-width': 2,
            'circle-stroke-opacity': 1.0,
        }
    });


    //physical layers
    //physical layers
    map.addSource('ocean', { type: 'geojson', data: emptyGJ });
    map.addLayer({
        "id": "ocean",
        "type": "fill",
        "source": "ocean",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'fill-color': '#00334d',
            'fill-opacity': 0.5,
            'fill-outline-color': '#00111a',
        }
    });

    map.addSource('river', { type: 'geojson', data: emptyGJ });
    map.addLayer({
        "id": "river",
        "type": "line",
        "source": "river",
        "layout": {
            "visibility": 'none'
        },
        "paint": {
            'line-color': '#0099cc',
            'line-opacity': .8,
            "line-width": 4,
        },
    });

    //Layer Info function
    //Layer Info function
    //Layer Info function
    //Layer Info function
    map.on(touchEvent, function (e) {

        document.getElementById("layer-attribute").innerHTML = "";

    });

    map.on(touchEvent, function (e) {

        var popup = new mapboxgl.Popup();
        var feature;
        var append = document.getElementById('layer-attribute');

        //Cultural - Layer Info
        //Cultural - Layer Info

        if (map.queryRenderedFeatures(e.point, { layers: ['populated'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['populated'] })[0];

            append.innerHTML +=
                  '<h5>Populated Places</h5>' +
                  '<hr>' +
                  '<b>City: </b>' + feature.properties.name +
                  '<hr>' +
                  '<b>Country: </b>' + feature.properties.sov0name +
                  '<hr>'
        }

        if (map.queryRenderedFeatures(e.point, { layers: ['country'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['country'] })[0];

            append.innerHTML +=
              '<h5>Country</h5>' +
              '<hr>' +
              '<b>Port Name </b>' + feature.properties.admin +
              '<hr>' +
              '<b>Code: </b>' + feature.properties.adm0_a3 +
              '<hr>'
        }

        //Monster - Layer Info
        //Monster - Layer Info
        if (map.queryRenderedFeatures(e.point, { layers: ['monster'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['monster'] })[0];

            append.innerHTML +=
                  '<h5>Monster Info</h5>' +
                  '<hr>' +
                  '<b>Name: </b>' + 'Mr. Claw' +
                  '<hr>' +
                  '<b>Place of Birth: </b>' + 'Atlantic Ocean' +
                  '<hr>' +
                  '<b>Likes: </b>' + 'Birthday Parties' +
                  '<hr>' +
                  '<b>Dislikes: </b>' + 'Seafood Festivals' +
                  '<hr>'
        }

        //Monster - Layer Info
        //Monster - Layer Info
        if (map.queryRenderedFeatures(e.point, { layers: ['octo'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['octo'] })[0];

            append.innerHTML +=
                  '<h5>Monster Info</h5>' +
                  '<hr>' +
                  '<b>Name: </b>' + 'Mr. Octo' +
                  '<hr>' +
                  '<b>Place of Birth: </b>' + 'Pacific Ocean' +
                  '<hr>' +
                  '<b>Likes: </b>' + 'Big Salads' +
                  '<hr>' +
                  '<b>Dislikes: </b>' + 'Jules Verne' +
                  '<hr>'
        }


        //Physical - Layer Info
        //Physical  - Layer Info
        if (map.queryRenderedFeatures(e.point, { layers: ['ocean'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['ocean'] })[0];

            append.innerHTML +=
                  '<h5>Oceans</h5>' +
                  '<hr>' +
                  '<b>Name: </b>' + feature.properties.name +
                  '<hr>'
        }

        if (map.queryRenderedFeatures(e.point, { layers: ['river'] }).length) {

            feature = map.queryRenderedFeatures(e.point, { layers: ['river'] })[0];

            append.innerHTML +=
                  '<h5>Major Rivers</h5>' +
                  '<hr>' +
                  '<b>Name: </b>' + feature.properties.name +
                  '<hr>'
        }
    });

    //cursor = pointer on hover configuration
    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['ocean', 'river', 'country', 'populated', 'monster', 'octo']
        });
        map.getCanvas().style.cursor = (features.length) ? 'default' : '';
    });

    //Highlight Features Function
    //Highlight Features Function
    //Highlight Features Function
    //Highlight Features Function
    map.on(touchEvent, function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["populated"] });

        if (map.getLayer("populated_hl")) {
            map.removeLayer("populated_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "populated_hl",
                "type": "circle",
                "source": "populated",
                "layout": {},
                "paint": {
                    "circle-color": "cyan",
                    "circle-radius": 7
                },
                "filter": ["==", "name", features[0].properties.name],
            });
        }
    });

    map.on(touchEvent, function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["country"] });

        if (map.getLayer("country_hl")) {
            map.removeLayer("country_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "country_hl",
                "type": "line",
                "source": "country",
                "layout": {},
                "paint": {
                    "line-color": "cyan",
                    "line-width": 3
                },
                "filter": ["==", "sovereignt", features[0].properties.sovereignt],
            });
        }
    });

    //Highlight - Mr. Claw
    map.on(touchEvent, function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["monster"] });

        if (map.getLayer("monster_hl")) {
            map.removeLayer("monster_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "monster_hl",
                "type": "line",
                "source": "monster",
                "layout": {},
                "paint": {
                    "line-color": "cyan",
                    "line-width": 3
                },
                "filter": ["==", "Id", features[0].properties.Id],
            });
        }
    });

    //Highlight - Mr. Octo
    map.on(touchEvent, function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["octo"] });

        if (map.getLayer("octo_hl")) {
            map.removeLayer("octo_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "octo_hl",
                "type": "line",
                "source": "octo",
                "layout": {},
                "paint": {
                    "line-color": "cyan",
                    "line-width": 3
                },
                "filter": ["==", "Id", features[0].properties.Id],
            });
        }
    });

    //Highlight - Physical
    map.on(touchEvent, function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["river"] });

        if (map.getLayer("river_hl")) {
            map.removeLayer("river_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "river_hl",
                "type": "line",
                "source": "river",
                "layout": {},
                "paint": {
                    "line-color": "cyan",
                    "line-width": 4
                },
                "filter": ["==", "name", features[0].properties.name],
            });
        }
    });

    map.on(touchEvent, function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["ocean"] });

        if (map.getLayer("ocean_hl")) {
            map.removeLayer("ocean_hl");
        }

        if (features.length) {

            map.addLayer({
                "id": "ocean_hl",
                "type": "line",
                "source": "ocean",
                "layout": {},
                "paint": {
                    "line-color": "cyan",
                    "line-width": 3
                },
                "filter": ["==", "name", features[0].properties.name],
            });
        }
    });
});

// Directory Options
// Directory Options
// Directory Options - open or closed by defualt (true/false)
var directoryOptions =
[
    {
        'name': 'Monsters',
        'open': true
    },
    {
        'name': 'Cultural',
        'open': true
    },
    {
        'name': 'Physical',
        'open': true
    },

];

// organize layers in the layer tree
var layers =

[
    // Mr Claw LAYER TREE CONFIG
    // Mr Claw LAYER TREE CONFIG
    {
        'name': 'Mr Claw',
        'id': 'monster_group',
        'hideLabel': ['mouth', 'water-line', 'eyes', 'monster'],
        'icon': 'assets/images/layer-stack-15.svg',
        'layerGroup': [
            {
                'id': 'monster',
                'source': 'monster',
                'name': 'Mr. Claw',
                'path': 'assets/json/monster.json',
            },
            {
                'id': 'mouth',
                'source': 'mouth',
                'name': 'Mouth',
                'path': 'assets/json/mouth.json',
            },
            {
                'id': 'water-line',
                'source': 'water-line',
                'name': 'Water',
                'path': 'assets/json/water.json',
            },
            {
                'id': 'eyes',
                'source': 'eyes',
                'name': 'Eyes',
                'path': 'assets/json/eyes.json',
            },

        ],
        'directory': 'Monsters'
    },

    // Mr Octo LAYER TREE CONFIG
    // Mr Octo LAYER TREE CONFIG
    {
        'name': 'Mr. Octo',
        'id': 'monster_group_2',
        'hideLabel': ['octo', 'water-line-2', 'eyes2', 'mouth2'],
        'icon': 'assets/images/layer-stack-15.svg',
        'layerGroup': [
            {
                'id': 'octo',
                'source': 'octo',
                'name': 'Mr. Octo',
                'path': 'assets/json/octo.json',
            },
            {
                'id': 'water-line-2',
                'source': 'water-line-2',
                'name': 'Water',
                'path': 'assets/json/water2.json',
            },
            {
                'id': 'mouth2',
                'source': 'mouth2',
                'name': 'Mouth',
                'path': 'assets/json/mouth2.json',
            },
            {
                'id': 'eyes2',
                'source': 'eyes2',
                'name': 'Eyes',
                'path': 'assets/json/eyes2.json',
            },
        ],
        'directory': 'Monsters'
    },

     // Cultural LAYER TREE CONFIG
     // Cultural LAYER TREE CONFIG

    {
        'name': 'Populated Places',
        'id': 'populated',
        'source': "populated",
        'path': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places_simple.geojson',
        'directory': 'Cultural',
    },
    {
        'name': 'Countries',
        'id': 'country',
        'source': 'country',
        'path': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_map_units.geojson',
        'directory': 'Cultural',
    },


    // Physical LAYER TREE CONFIG
    // Physical LAYER TREE CONFIG

    {
        'name': 'Major Rivers',
        'id': 'river',
        'source': 'river',
        'path': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_rivers_lake_centerlines.geojson',
        'directory': 'Physical',
    },
    {
        'name': 'Oceans',
        'id': 'ocean',
        'source': 'ocean',
        'path': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_geography_marine_polys.geojson',
        'directory': 'Physical',
    },

];


var layerList = new LayerTree({ layers: layers, directoryOptions: directoryOptions, onClickLoad: true });

var layerTool = document.getElementById('menu');
layerTool.appendChild(layerList.onAdd(map))


//BOOKMARKS
//BOOKMARKS
//BOOKMARKS

document.getElementById('icelandBookmark').addEventListener('click', function () {
    map.flyTo({
        center: [-18.7457, 65.0662],
        zoom: 5,
    });
});

document.getElementById('safricaBookmark').addEventListener('click', function () {

    map.flyTo({
        center: [23.9417, -29.5353],
        zoom: 5,
    });
});

document.getElementById('japanBookmark').addEventListener('click', function () {

    map.flyTo({
        center: [138.6098, 36.3223],
        zoom: 4,
    });
});

document.getElementById('australiaBookmark').addEventListener('click', function () {

    map.flyTo({
        center: [134.1673, -25.6855],
        zoom: 3

    });
});



//TEXT TOOL
//TEXT TOOL
//TEXT TOOL

var MAP_DIV = map.getCanvasContainer();
var EDIT_NODE = document.getElementById('editTextTool');
var LABEL_NODE = document.getElementById('textTool');

//set user defined sizes/colors in palette
var TEXT_SIZES = [24, 20, 16, 12];
var TEXT_COLORS = ['#000', '#c12123', '#ee4498', '#00924d', '#00afde', '#ccbe00'];

//char count limit
var CHAR_LIMIT = 20;

//drag status
var isDragging = false;


function activateTool(el) {
    if (el.getAttribute('active') === 'true') {
        el.setAttribute('active', false);

        if (el.isEqualNode(EDIT_NODE)) {
            var activeInput = document.querySelector('.label-marker.active span');
            if (activeInput) {
                activeInput.focus();
                activeInput.blur();
            }
        }
        MAP_DIV.style.cursor = '';

    } else {
        el.isEqualNode(EDIT_NODE) ? LABEL_NODE.setAttribute('active', false) : EDIT_NODE.setAttribute('active', false);
        el.setAttribute('active', true);

        MAP_DIV.style.cursor = 'crosshair';
    }
}

//generate unique layer ids for text-labels
function generateTextID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//convert marker DOM elements to symbol layers
function markerToSymbol(e, elm) {
    if (isDragging) return;

    MAP_DIV.style.cursor = '';

    var that = this instanceof Element ? this : elm;
    var childSpan = document.querySelector('.marker-text-child');

    if (childSpan) var parent = childSpan.parentNode;

    if (that.innerText !== '' && that.innerText.length > 0) {
        parent ? parent.classList.remove('active') : that.classList.remove('active');

        var fontSize = that.style['font-size'] === '' ? TEXT_SIZES[1] : parseInt(that.style['font-size'].split('px')[0]); //textSize[1] is default
        var fontColor = that.style.color === '' ? '#000' : that.style.color;
        var coords = [that.getAttribute('lng'), that.getAttribute('lat')];

        var labelGJ = {
            "type": "FeatureCollection",
            "features": [
              {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                      "type": "Point",
                      "coordinates": coords
                  }
              }
            ]
        };

        var id = generateTextID();
        var lyrID = id + '-custom-text-label';

        map.addSource(id, { type: 'geojson', data: labelGJ });

        map.addLayer({
            "id": lyrID,
            "type": "symbol",
            "source": id,
            "layout": {
                "text-field": that.innerText,
                "text-size": fontSize,
                "symbol-placement": "point",
                "text-keep-upright": true
            },
            "paint": {
                "text-color": fontColor,
                "text-halo-color": '#FFF',
                "text-halo-width": 2,
            },
        });

        //removes text-input marker after clicking off
        LABEL_NODE.setAttribute('active', false);

        that.removeEventListener('blur', markerToSymbol);
    }

    parent ? parent.remove() : that.remove();
}

//label text limit/prevent event keys
function inputText(e) {

    //arrow keys
    if ([32, 37, 38, 39, 40, 8].indexOf(e.keyCode) > -1) {
        e.stopPropagation();
        //enter key

    } else if (e.keyCode === 13 && this.innerText.length <= CHAR_LIMIT) {
        this.blur();

        MAP_DIV.style.cursor = '';

        e.preventDefault();
        //limit
    } else if (this.innerText.length >= CHAR_LIMIT && e.keyCode !== 8) {
        e.preventDefault();
        alert(keycode);
    }
}


//pasting text into requires additional handling
//for text limit
function handlePaste(e) {
    var clipboardData, pastedData;

    e.stopImmediatePropagation();
    e.preventDefault();

    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('text/plain').slice(0, CHAR_LIMIT);

    this.innerText = pastedData;
}

function createMarker(e, el) {
    new mapboxgl.Marker(el)
        .setLngLat(e.lngLat)
        .addTo(map);

}

//populates edit palette with user defined colors/sizes
function populatePalette() {
    var palette = document.getElementById('customTextPalette');
    var textSizeDiv = document.getElementById('customTextSize');
    var textColorDiv = document.getElementById('customTextColor');

    for (var s = 0; s < TEXT_SIZES.length; s++) {
        var sElm = document.createElement('div');
        sElm.className = 'font-size-change';
        sElm.id = 'font-' + TEXT_SIZES[s];
        sElm.innerText = 'T'; //change to whatever font/image
        sElm.style['font-size'] = TEXT_SIZES[s] + 'px';
        sElm.addEventListener('mousedown', changeFontStyle);

        textSizeDiv.appendChild(sElm);
    };

    for (var c = 0; c < TEXT_COLORS.length; c++) {
        var cElm = document.createElement('div');
        cElm.className = 'font-color-change';
        cElm.id = 'font-' + TEXT_COLORS[c];
        cElm.style['background-color'] = TEXT_COLORS[c];
        cElm.addEventListener('mousedown', changeFontStyle);

        textColorDiv.appendChild(cElm);
    };
}

//update marker font styles
function changeFontStyle(e) {
    e.preventDefault();
    e.stopPropagation();

    var labelDiv = document.querySelector('.label-marker');
    var childSpan = document.querySelector('.marker-text-child');

    var mark = childSpan ? childSpan : labelDiv;

    if (mark) {
        labelDiv.classList.add('active');
        if (e.target.classList.contains('font-size-change')) {
            mark.style['font-size'] = e.target.style['font-size'];
        } else if (e.target.classList.contains('font-color-change')) {
            mark.style.color = e.target.style['background-color'];
        }

        mark.focus();
    }

    MAP_DIV.style.cursor = 'text';
}

//marker move functionality - modified GL example
//https://www.mapbox.com/mapbox-gl-js/example/drag-a-point/
function beginDrag(e) {
    e.stopImmediatePropagation();

    map.dragPan.disable();

    isDragging = true;

    MAP_DIV.style.cursor = 'cursor:-moz-grab;cursor:-webkit-grab;cursor:grab';

    map.on('mousemove', onDrag);
    map.on('touchmove', onDrag);

    map.once('mouseup', stopDrag);
    map.once('touchend', stopDrag);
}

function onDrag(e) {
    if (!isDragging) return;

    var label = document.querySelector('.label-marker');

    MAP_DIV.style.cursor = 'cursor:-moz-grabbing;cursor:-webkit-grabbing;cursor:grabbing';

    map.dragPan.disable();

    createMarker(e, label);
}

function stopDrag(e) {
    if (!isDragging) return;

    var textSpan = document.querySelector('.marker-text-child');

    textSpan.setAttribute('lng', e.lngLat.lng);
    textSpan.setAttribute('lat', e.lngLat.lat);

    isDragging = false;

    textSpan.parentNode.style.cursor = '';
    MAP_DIV.style.cursor = '';

    map.dragPan.enable();

    setTimeout(function () {
        markerToSymbol(e, textSpan);
    }, 50)

    // Unbind move events
    map.off('mousemove', onDrag);
    map.off('touchmove', onDrag);
}

function addEditLabels(e) {
    e.originalEvent.preventDefault();
    e.originalEvent.stopPropagation();

    if (isDragging) return;

    //create a large bounding box for capture
    var clickBBox = [[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]];

    //adding text
    if (LABEL_NODE.getAttribute('active') === 'true') {

        var el = document.createElement('div');
        el.className = 'label-marker';

        el.setAttribute('contenteditable', 'true');
        el.setAttribute('autocorrect', 'off');
        el.setAttribute('spellcheck', 'false');
        el.setAttribute('lng', e.lngLat.lng);
        el.setAttribute('lat', e.lngLat.lat);
        el.style['font-size'] = TEXT_SIZES[1] + 'px';  //defaulting to second size

        map.marker = createMarker(e, el);

        el.addEventListener("blur", markerToSymbol);
        el.addEventListener("keydown", inputText);
        el.addEventListener("paste", handlePaste);

        el.focus();

        //editting text
    } else if (EDIT_NODE.getAttribute('active') === 'true') {

        //filters layers for custom text labels
        function isCustomText(item) {
            return item.layer.id.indexOf('-custom-text-label') > -1
        }

        var features = map.queryRenderedFeatures(clickBBox);
        var activeInput = document.querySelector('.marker-text-child');

        if (features.length) {
            var customLabels = features.filter(isCustomText);

            if (customLabels.length) {
                //only returning the first feature
                //user is going to have to zoom in further
                var feature = customLabels[0].layer;

                var lyrID = feature.id;
                var sourceID = feature.source;
                var text = feature.layout['text-field'];
                var featureFontSize = feature.layout['text-size'] + 'px';
                var featureFontColor = feature.paint['text-color'];

                var mapSource = map.getSource(sourceID);
                var coords = mapSource._data.features[0].geometry.coordinates;

                var container = document.createElement('div');
                container.className = 'label-marker label-container active';

                var el = document.createElement('span');
                el.className = 'marker-text-child';
                el.innerText = text;

                el.style['font-size'] = featureFontSize;
                el.style.color = featureFontColor;

                el.setAttribute('lng', coords[0]);
                el.setAttribute('lat', coords[1]);
                el.setAttribute('contenteditable', 'true');
                el.setAttribute('autocorrect', 'off');
                el.setAttribute('spellcheck', 'false');

                //drag icon - using FontAwesome as an example
                var dragUI = document.createElement('i');
                dragUI.className = 'fa fa-arrows-alt fa-lg drag-icon';
                dragUI.setAttribute('aria-hidden', true);

                container.appendChild(dragUI);
                container.appendChild(el);

                map.removeSource(sourceID);
                map.removeLayer(lyrID);

                createMarker(e, container);

                dragUI.addEventListener("mousedown", beginDrag);
                dragUI.addEventListener("touchstart", beginDrag);

                el.addEventListener("blur", markerToSymbol);
                el.addEventListener("keydown", inputText);
                el.addEventListener("paste", handlePaste);

            } else if (activeInput) {
                activeInput.isEqualNode(e.originalEvent.target) ? activeInput.focus() : markerToSymbol(e, activeInput);
            }
        }
    }
}

//fire function to populate text/color custom pallete
populatePalette();

map.on('click', addEditLabels);


// custom draw styles paramaters
// custom draw styles paramaters
// custom draw styles paramaters
var drawFeatureID = '';
var newDrawFeature = false;
var trackDrawnPolygons = [];
var getLastDrawnPoly = false;

//Draw Tools function
//Draw Tools function
//Draw Tools function
var draw = new MapboxDraw({
    // this is used to allow for custom properties for styling draw features
    // it appends the word "user_" to the property
    userProperties: true,
    displayControlsDefault: false,
    controls: {
        polygon: true,
        point: true,
        line_string: true,
        trash: true,
    },
    styles: [
        // default themes provided by MB Draw
        // default themes provided by MB Draw
        // default themes provided by MB Draw
        // default themes provided by MB Draw


        {
            'id': 'gl-draw-polygon-fill-inactive',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'fill-color': '#3bb2d0',
                'fill-outline-color': '#3bb2d0',
                'fill-opacity': 0.1
            }
        },
        {
            'id': 'gl-draw-polygon-fill-active',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'true'],
                ['==', '$type', 'Polygon']
            ],
            'paint': {
                'fill-color': '#fbb03b',
                'fill-outline-color': '#fbb03b',
                'fill-opacity': 0.1
            }
        },
        {
            'id': 'gl-draw-polygon-midpoint',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'],
                ['==', 'meta', 'midpoint']
            ],
            'paint': {
                'circle-radius': 3,
                'circle-color': '#fbb03b'
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-inactive',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#3bb2d0',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-active',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'true'],
                ['==', '$type', 'Polygon']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#fbb03b',
                'line-dasharray': [0.2, 2],
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-inactive',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'static']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#3bb2d0',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-active',
            'type': 'line',
            'filter': ['all', ['==', '$type', 'LineString'],
                ['==', 'active', 'true']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#fbb03b',
                'line-dasharray': [0.2, 2],
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
            'type': 'circle',
            'filter': ['all', ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-inactive',
            'type': 'circle',
            'filter': ['all', ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 3,
                'circle-color': '#fbb03b'
            }
        },
        {
            'id': 'gl-draw-point-point-stroke-inactive',
            'type': 'circle',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-opacity': 1,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-point-inactive',
            'type': 'circle',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 3,
                'circle-color': '#3bb2d0'
            }
        },
        {
            'id': 'gl-draw-point-stroke-active',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'],
                ['==', 'active', 'true'],
                ['!=', 'meta', 'midpoint']
            ],
            'paint': {
                'circle-radius': 7,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-point-active',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'],
                ['!=', 'meta', 'midpoint'],
                ['==', 'active', 'true']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': '#fbb03b'
            }
        },
        {
            'id': 'gl-draw-polygon-fill-static',
            'type': 'fill',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'Polygon']
            ],
            'paint': {
                'fill-color': '#404040',
                'fill-outline-color': '#404040',
                'fill-opacity': 0.1
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-static',
            'type': 'line',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'Polygon']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#404040',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-static',
            'type': 'line',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'LineString']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#404040',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-point-static',
            'type': 'circle',
            'filter': ['all',
                ['==', 'mode', 'static'],
                ['==', '$type', 'Point']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': '#404040'
            }
        },

        // end default themes provided by MB Draw
        // end default themes provided by MB Draw
        // end default themes provided by MB Draw
        // end default themes provided by MB Draw




        // new styles for toggling colors
        // new styles for toggling colors
        // new styles for toggling colors
        // new styles for toggling colors

        {
            'id': 'gl-draw-polygon-fill-inactive-color-picker',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static'],
                ['has', 'user_portColor']
            ],
            'paint': {
                'fill-color': ['get', 'user_portColor'],
                'fill-outline-color': ['get', 'user_portColor'],
                'fill-opacity': 0.1
            }
        },
        {
            'id': 'gl-draw-polygon-fill-active-color-picker',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'true'],
                ['==', '$type', 'Polygon'],
                ['has', 'user_portColor']
            ],
            'paint': {
                'fill-color': ['get', 'user_portColor'],
                'fill-outline-color': ['get', 'user_portColor'],
                'fill-opacity': 0.1
            }
        },
        {
            'id': 'gl-draw-polygon-midpoint-color-picker',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'],
                ['==', 'meta', 'midpoint']
            ],
            'paint': {
                'circle-radius': 3,
                'circle-color': '#fbb03b'
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-inactive-color-picker',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static'],
                ['has', 'user_portColor']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': ['get', 'user_portColor'],
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-active-color-picker',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'true'],
                ['==', '$type', 'Polygon'],
                ['has', 'user_portColor']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': ['get', 'user_portColor'],
                'line-dasharray': [0.2, 2],
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-inactive-color-picker',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'static'],
                ['has', 'user_portColor']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': ['get', 'user_portColor'],
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-active-color-picker',
            'type': 'line',
            'filter': ['all', ['==', '$type', 'LineString'],
                ['==', 'active', 'true'],
                ['has', 'user_portColor']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': ['get', 'user_portColor'],
                'line-dasharray': [0.2, 2],
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive-color-picker',
            'type': 'circle',
            'filter': ['all', ['==', 'meta', 'vertex'],
                ['!=', 'active', 'true'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-inactive-color-picker',
            'type': 'circle',
            'filter': ['all', ['==', 'meta', 'vertex'],
                ['!=', 'active', 'true'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 3,
                'circle-color': '#fbb03b'
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-stroke-active-color-picker',
            'type': 'circle',
            'filter': ['all', ['==', 'meta', 'vertex'],
                ['==', 'active', 'true'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 7,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-polygon-and-line-vertex-active-color-picker',
            'type': 'circle',
            'filter': ['all', ['==', 'meta', 'vertex'],
                ['==', 'active', 'true'],
                ['==', '$type', 'Point'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': '#fbb03b'
            }
        },
        {
            'id': 'gl-draw-point-point-stroke-inactive-color-picker',
            'type': 'circle',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['!=', 'mode', 'static'],
                ['has', 'user_portColor']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-opacity': 1,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-point-inactive-color-picker',
            'type': 'circle',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Point'],
                ['==', 'meta', 'feature'],
                ['!=', 'mode', 'static'],
                ['has', 'user_portColor']
            ],
            'paint': {
                'circle-radius': 3,
                'circle-color': ['get', 'user_portColor']
            }
        },
        {
            'id': 'gl-draw-point-stroke-active-color-picker',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'],
                ['==', 'active', 'true'],
                ['!=', 'meta', 'midpoint'],
                ['has', 'user_portColor']
            ],
            'paint': {
                'circle-radius': 7,
                'circle-color': '#fff'
            }
        },
        {
            'id': 'gl-draw-point-active-color-picker',
            'type': 'circle',
            'filter': ['all', ['==', '$type', 'Point'],
                ['!=', 'meta', 'midpoint'],
                ['==', 'active', 'true'],
                ['has', 'user_portColor']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': ['get', 'user_portColor']
            }
        },
        {
            'id': 'gl-draw-polygon-fill-static-color-picker',
            'type': 'fill',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'Polygon'],
                ['has', 'user_portColor']
            ],
            'paint': {
                'fill-color': ['get', 'user_portColor'],
                'fill-outline-color': ['get', 'user_portColor'],
                'fill-opacity': 0.1
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-static-color-picker',
            'type': 'line',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'Polygon'],
                ['has', 'user_portColor']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': ['get', 'user_portColor'],
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-static-color-picker',
            'type': 'line',
            'filter': ['all', ['==', 'mode', 'static'],
                ['==', '$type', 'LineString'],
                ['has', 'user_portColor']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': ['get', 'user_portColor'],
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-point-static-color-picker',
            'type': 'circle',
            'filter': ['all',
                ['==', 'mode', 'static'],
                ['==', '$type', 'Point'],
                ['has', 'user_portColor']
            ],
            'paint': {
                'circle-radius': 5,
                'circle-color': ['get', 'user_portColor']
            }
        }
    ]
});

var drawTool = document.getElementById('drawAppend');
drawTool.appendChild(draw.onAdd(map)).setAttribute("style", "display: inline-flex;", "border: 0;");

// create draw palette
function populateDrawPalette() {
    var drawFeatureColor = document.getElementById('customDrawColor');

    for (var c = 0; c < TEXT_COLORS.length; c++) {
        var cElm = document.createElement('div');
        cElm.className = 'draw-color-change';
        cElm.id = 'draw-' + TEXT_COLORS[c];
        cElm.style['background-color'] = TEXT_COLORS[c];
        cElm.addEventListener('mousedown', changeDrawColor);

        drawFeatureColor.appendChild(cElm);
    };
}

function handlePolygonOrder(clickedFeats) {
    if (clickedFeats.length > 1) {
        var tempTrack = trackDrawnPolygons.filter(function (p) {
            return clickedFeats.indexOf(p) > -1;
        });

        var lastPoly = tempTrack[tempTrack.length - 1];
        draw.changeMode('direct_select', { featureId: lastPoly });

        var feat = draw.get(lastPoly);
        var c = feat.properties.portColor ? feat.properties.portColor : '#fbb03b';
        handleVerticesColors(c);

    } else if (clickedFeats.length === 1) {

        var feat = draw.get(clickedFeats[0]);
        var c = feat.properties.portColor ? feat.properties.portColor : '#fbb03b';
        handleVerticesColors(c);
    }

    getLastDrawnPoly = false;
}


// vertices and midpoints don't inherit their parent properties
// so we need to handle those edge cases
function handleVerticesColors(color) {
    // midppoints
    map.setPaintProperty('gl-draw-polygon-midpoint-color-picker.hot', 'circle-color', color);
    map.setPaintProperty('gl-draw-polygon-midpoint-color-picker.cold', 'circle-color', color);

    // vertices
    map.setPaintProperty('gl-draw-polygon-and-line-vertex-inactive-color-picker.cold', 'circle-color', color);
    map.setPaintProperty('gl-draw-polygon-and-line-vertex-inactive-color-picker.hot', 'circle-color', color);

    //active vertex
    map.setPaintProperty('gl-draw-polygon-and-line-vertex-active-color-picker.cold', 'circle-color', color);
    map.setPaintProperty('gl-draw-polygon-and-line-vertex-active-color-picker.hot', 'circle-color', color);
}

// color change function of draw features
var changeDrawColor = function (e) {

    if (e.target.id && e.target.id.indexOf('draw-') === -1) return;

    var color = e.target.id.replace(/draw-/, '');

    if (drawFeatureID !== '' && typeof draw === 'object') {
        draw.setFeatureProperty(drawFeatureID, 'portColor', color);
        var feat = draw.get(drawFeatureID);
        draw.add(feat);

        // race conditions exist between events
        // and draw's transitions between .hot and .cold layers
        setTimeout(function () {
            handleVerticesColors(color);
        }, 50);
    }

};

// callback for draw.update and draw.selectionchange
var setDrawFeature = function (e) {
    if (e.features.length && e.features[0].type === 'Feature') {
        var feat = e.features[0];
        drawFeatureID = feat.id;

        if (feat.geometry.type === 'Polygon' && trackDrawnPolygons.length > 1 && draw.getMode() !== 'draw_polygon' &&
            feat.id !== trackDrawnPolygons[trackDrawnPolygons.length - 1]) {
            getLastDrawnPoly = true;
        } else {
            var c = feat.properties.portColor ? feat.properties.portColor : '#fbb03b';

            // race conditions exist between events
            // and draw's transitions between .hot and .cold layers
            setTimeout(function () {
                handleVerticesColors(c);
            }, 50);
        }
    }
};

// Event Handlers for Draw Tools
// This event is triggered for creating a draw
map.on('draw.create', function (e) {
    newDrawFeature = true;

    if (e.features.length && e.features[0].geometry.type === 'Polygon') {
        trackDrawnPolygons.push(e.features[0].id);
    }
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/save_points",
        headers: {"Content-Type": "application/json"},
        data: JSON.stringify([e.features[0].geometry.coordinates, e.features[0].geometry.type]),
        success: function() { console.log('Success!');},
        done: function() { console.log("Done");}
    });

    if((enabled || min_area) && db_name != null && db_name != "" && e.features[0].geometry.type === 'Polygon') {
            // Contact backend api to extract data
            polygon_coords = e.features[0].geometry.coordinates
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/display_points",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(db_name),
            success: function(e) { 
                let polygon = turf.polygon(polygon_coords);
                let feature_list = [];
                if (db_name == 'airports'){
                    for(elements in e){
                        let lng = e[elements]['lon'];
                        let lat = e[elements]['lat'];
                        let coords = [lng, lat];
                        let point = turf.point(coords);
                        if(turf.inside(point,polygon)) {
                            feature_list.push(point)
                        }
                    }
                } else {
                    /*
                    *Checking crash_data costs alot of time and ressource, we can do it with 2 options
                    * Option 1: do it in the backend using geocoder, wich takes alot of time and ressource
                    * Option 2: API calls using javascript, since javascript is faster than python, it will 
                    * give a fast result, but we need to make many API calls wich will cause 429 ERROR (Too many requests)
                    * So it's better to find a dataset with existant coords, or simply use python to create a new file 
                    * that contains coords and display it when needed
                    */ 
                    alert("No data found");
                }

                // Chosing a source name that increments each time to make it unique
                let featureCollection = turf.featureCollection(feature_list);
                let sourceName = "FILE-COLLECTION-" + layerID;
                layerID += 1;
                drawFolderFeatureCollection(featureCollection, sourceName)
                addToMenu(sourceName);

                // checking if minimum area is checked
                if(min_area) {

                    var hull = turf.convex(featureCollection);
                    sourceName = 'MIN-AREA-' + layerID;
                    layerID += 1;
                    addToMenu(sourceName);
                    drawFolderFeatureCollection(hull, sourceName)              
                 }
                        },
            done: function() { console.log("Done");}
        });
    }
});

// track handling for polygon features
map.on('draw.delete', function (e) {
    if (e.features.length) {
        var feats = e.features;
        var featsToRemove = []; 

        for (var i = feats.length - 1; i >= 0; i--) {
            featsToRemove.push(feats[i].id);
        }

        var tempTrack = trackDrawnPolygons.filter(function (p) {
            return featsToRemove.indexOf(p) < 0;
        });

        trackDrawnPolygons = tempTrack;
    }
});

map.on('draw.update', setDrawFeature);
map.on('draw.selectionchange', setDrawFeature);

map.on('click', function (e) {
    if (getLastDrawnPoly) {
        var clickedFeats = draw.getFeatureIdsAt(e.point);
        handlePolygonOrder(clickedFeats);
    } else if (!newDrawFeature) {

        handleVerticesColors('#fbb03b');
        var drawFeatureAtPoint = draw.getFeatureIdsAt(e.point);

        //if another drawFeature is not found - reset drawFeatureID
        drawFeatureID = drawFeatureAtPoint.length ? drawFeatureAtPoint[0] : '';
    }

    newDrawFeature = false;
});


//// Turf Area Calc
var selectedUnits = '';
var selectedMeasuredFeature = '';
var measurementActive = false;


function removeMeasurementValues() {
    $('#calculated-area p').remove();
    $('#calculated-length p').remove();
}

function calculateDimensions(data) {
    if (!data.id) return;

    var area, rounded_area, areaAnswer, length, rounded_length, lineAnswer;
    //FEET
    if (selectedUnits === 'feet') {

        area = turf.area(data) / 0.09290304;
        // restrict to 2 decimal points
        rounded_area = Math.round(area * 100) / 100;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' ft<sup>2</sup></p>';

        length = turf.lineDistance(data, 'meters') / 0.3048;
        // restrict to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' ft</p>';

        //METER
    } else if (selectedUnits === 'meter') {

        area = turf.area(data);
        // restrict to 2 decimal points
        rounded_area = Math.round(area * 100) / 100;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' m<sup>2</sup></p>';

        length = turf.lineDistance(data, 'meters');
        // restrict to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' m</p>';

        //MILE
    } else if (selectedUnits === 'mile') {

        area = turf.area(data) / 2589988.11;
        // restrict to 4 decimal points
        rounded_area = Math.round(area * 10000) / 10000;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' mi<sup>2</sup></p>';

        length = turf.lineDistance(data, 'meters') / 1609.344;
        // restrict  to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' mi</p>';

        //KILOMETER
    } else if (selectedUnits === 'kilometer') {

        area = turf.area(data) / 1000000;
        // restrict to 4 decimal points
        rounded_area = Math.round(area * 10000) / 10000;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' km<sup>2</sup></p>';

        length = turf.lineDistance(data, 'meters') / 1000;
        // restrict to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' km</p>';

        //ACRE
    } else if (selectedUnits === 'acre') {

        area = turf.area(data) / 4046.85642;
        // restrict  to 4 decimal points
        rounded_area = Math.round(area * 10000) / 10000;
        areaAnswer = document.getElementById('calculated-area');
        areaAnswer.innerHTML = '<p>' + rounded_area + ' acres</p>';

        length = turf.lineDistance(data, 'meters') / 0.3048;
        // restrict to 2 decimal points
        rounded_length = Math.round(length * 100) / 100;
        lineAnswer = document.getElementById('calculated-length');
        lineAnswer.innerHTML = '<p>' + rounded_length + ' ft</p>';

    }
}

var exclusion = false;
// callback fires on the events listed below and fires the
// above calculateDimensions function
var calculateCallback = function (e) {
        if (e.features.length && (e.features[0].geometry.type === 'Polygon' || e.features[0].geometry.type === 'LineString')) {
            measurementActive = true;
            selectedMeasuredFeature = e.features[0].id;
            calculateDimensions(e.features[0]);
        }
}
map.on('draw.create', calculateCallback);
map.on('draw.update', calculateCallback);
map.on('draw.selectionchange', calculateCallback);

map.on('draw.delete', function (e) {
    selectedMeasuredFeature = '';
    measurementActive = false;
    removeMeasurementValues();
    pointList= [];
});

// apparently there's no method to track/watch a drag or vertex
// of a newly instantiated feature that has yet to be 'created'
// or perhaps it's not documented anywhere in GL Draw
// so we have to make our own
map.on('mousemove', function (e) {
    if (draw.getMode() === 'draw_line_string' || draw.getMode() === 'draw_polygon') {
        var linePts = draw.getFeatureIdsAt(e.point);

        if (linePts.length) {
            // some draw features return back as undefined
            var activeID = linePts.filter(function (feat) {
                return typeof feat === 'string';
            })

            if (activeID.length) {
                measurementActive = true;
                selectedMeasuredFeature = activeID[0];

                var fc = draw.get(selectedMeasuredFeature);
                calculateDimensions(fc);
            }
        }
    } else if (draw.getMode() === 'direct_select' && selectedMeasuredFeature !== '') {
        var fc = draw.get(selectedMeasuredFeature);

        if (fc.geometry.type === 'LineString' || fc.geometry.type === 'Polygon') {
            calculateDimensions(fc);
        }

    }
});
var pointList = [];
// remove measurements from input
map.on('click', function (e) {
    
    if (measurementActive) {
        var measuredFeature = draw.getFeatureIdsAt(e.point);
        pointList.push(e.point);  

        if (measuredFeature.length) {
            // some draw features return back as undefined
            var mF = measuredFeature.filter(function (feat) {
                return typeof feat === 'string';
            })

            selectedMeasuredFeature = mF.length ? mF[0] : '';

        } else {

            removeMeasurementValues();
        }
    } else {
        pointList = [e.point];
        removeMeasurementValues();
    }

    measurementActive = false;
});

$(function () {
    // set unit value
    selectedUnits = $('input[type=radio][name=unit]:checked').val();

    $('input[type=radio][name=unit]').change(function () {
        selectedUnits = this.value;

        //update values based on new units
        if (selectedMeasuredFeature !== '' || measurementActive) {
            var gj = draw.get(selectedMeasuredFeature);
            calculateDimensions(gj);
        }
    })

    populateDrawPalette();
});


// Added code
// Loading the file that contains user drawn shapes
function loadFile(filename){
    $.ajax({
            method: "GET",
            url: "http://localhost:8080/load_points",
            headers: {"Content-Type": "application/json"},
            success: function(data) {
                let sourceName = 'PREVIOUS-SHAPES-' + layerID;
                layerID += 1; 
                drawFolderFeatureCollection(data.results[0], sourceName);
                addToMenu(sourceName);
            },
            error: function() { alert("An error has occured");},
            done: function() { console.log("Done");}
        });
}


// Draw a line between 2 points and get the distance between them
function drawLine() {
    const baseLng = $("#baselngInput");
    const baseLat = $("#baselatInput");
    const destLng = $("#destlngInput");
    const destLat = $("#destlatInput");

    const baseLngVal = parseFloat(baseLng.val());
    const baseLatVal = parseFloat(baseLat.val());
    const destLngVal = parseFloat(destLng.val());
    const destLatVal = parseFloat(destLat.val());

    // check if all fields are filled
    if(!baseLngVal || !baseLatVal || !destLngVal || !destLatVal) {
        alert("Please fill all necessary fields");
    } else {
        const baseCoords = [baseLngVal, baseLatVal];
        const destCoords = [destLngVal, destLatVal];
        const coordinates = [baseCoords, destCoords];

        draw.add(turf.point(baseCoords));
        draw.add(turf.point(destCoords));
        
        /* Getting the DISTANCE IN km
        * Uncomment this and add it to turf.distance to calculate distance in miles, 
        * it won't work here because of turf version used
        * var options = {units: 'miles'}
        */
        let distance = turf.distance(turf.point(baseCoords), turf.point(destCoords))
        $("#calculated-distance").val(distance + " km");
        let sourceName = 'POINTS-LINK-' + layerID;
        layerID += 1;
        // Drawing line on the map
        map.addSource(sourceName, {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coordinates
                }
            }
        });

        map.addLayer({
            'id': 'ROUTE-' + sourceName,
            'type': 'line',
            'source': sourceName,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#0CBBEC',
                'line-width': 2
            },
        });
        layers_dict[sourceName] = ['ROUTE-' + sourceName,];  
        addToMenu(sourceName)

    }
}


// Variables used in different functionnalities
/*
* enabled: if true, we display points within a polygon
* min_area: if true, creates a polygon that fits points within another polygon
* db_name: a variable containing name of json file, it's used 
* search_db_name: used as path to data for getting the nearest neighbors of a point
* selected_us_state: used for showing railroads within a selected state
*/

let enabled = false;
let min_area = false;
let db_name = null;
let search_db_name = null;
let selected_us_state = null

// getting dataset name that we want to display
$('#selected-dataset').on('change', function () {
    var optionSelected = $("option:selected", this);
    db_name = this.value;
});

// getting dataset name that we want to search (used in nrearest neighbor)
$('#searchSelected-dataset').on('change', function () {
    var optionSelected = $("option:selected", this);
    search_db_name = this.value;
});

// getting selected us state
$('#selected-us-state').on('change', function() {
    var optionSelected = $("option:selected", this);
    selected_us_state = this.value;

})

// changing boolean enabled that will control points within polygon
$('#show-points').on('change', function () {
    if($('#show-points').is(':checked')){
        $("#selected-dataset").attr("disabled", false);
        enabled = true;
    } else {
        $("#selected-dataset").attr("disabled", true);
        enabled = false;
    }
});

// Boolean that enable minimum area display
$('#min-area').on('change', function () {
    if($('#min-area').is(':checked')){
        min_area = true;
    } else {
        min_area = false;
    }
});


// this function is for adding layers and source of a given feature collection
function drawFolderFeatureCollection(featureCollection, sourceName) {
    map.addSource(sourceName, {
        'type': 'geojson',
        'data': featureCollection
    });
 
    var location_layer = map.addLayer({
        'id': 'LOCATION-' + sourceName,
        'type': 'circle',
        'source': sourceName,
        'paint': {
            'circle-radius': 3,
            'circle-color': '#B42332'
        },
        'filter': ['==', '$type', 'Point']
    });

    var route_layer =  map.addLayer({
        'id': 'ROUTE-' + sourceName ,
        'type': 'line',
        'source': sourceName,
        'layout': {
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': '#000080',
        'line-width': 0.5
        },
        'filter': ['==', '$type', 'LineString']
    });

    var area_layer = map.addLayer({
        'id': 'AREA-' + sourceName,
        'type': 'fill',
        'source': sourceName,
        'paint': {
            'fill-color': ' #000080',
            'fill-opacity': 0.7
        },
        'filter': ['==', '$type', 'Polygon']
    });

    layers_dict[sourceName] = ['LOCATION-' + sourceName, 'ROUTE-' + sourceName, 'AREA-' + sourceName];
}


// remove source and all child layers from the map
function removeAllLayers(sourceName) {

    for(layer in layers_dict[sourceName]) {
        layerId = layers_dict[sourceName][layer]
        if(map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    }
    map.removeSource(sourceName);
}

// remove a specific layer from the map
function removeSpecificLayer(layerID) {
    if(map.getLayer(layerID)){
        map.removeLayer(layerID);    
    }
    
}


// remove a draw by its id
function removeDraw(e) {
    let parent = e.parentNode;
    let drawId = e.previousElementSibling.textContent;
    draw.delete(drawId);
    parent.remove();

}

// remove a layer from the map and its tag from the DOM (From side menu)
function removeLayer(e){
    let parent = e.parentNode;
    let layerId = e.previousElementSibling.textContent;
    removeSpecificLayer(layerId);
    parent.remove();
}

// remove a source and its layers from the map and its tag from the DOM (From side menu)
function removeSource(e) {
    let parent = e.parentNode;
    let sourceId = e.previousElementSibling.textContent
    removeAllLayers(sourceId);
    parent.remove();
}

// create a sidebar menu that tracks changes and enable us to delet them
function addToMenu(sourceName) {
    $('.layers-container').append("<div class='removable'><span id='" + 
                    sourceName  + "' class='name' style='font-size:0.7em'>" + sourceName +
                    "</span><button type='button' class='btn btn-sm btn-danger' style='margin-left:15px;' onclick='removeSource(this)'><i class='far fa-trash-alt'></i></button></div>"); 
}




// getting nearest N neighbors to a given point
function getNearest() {
    const lng = $("#searchBaselngInput");
    const lat = $("#searchBaselatInput");
    const numberNearPoitnsTag = $("#near_points_number");

    const lngVal = parseFloat(lng.val());
    const latVal = parseFloat(lat.val());
    let numberNearPoints = parseInt(numberNearPoitnsTag.val());


    // check if all fields are filled
    if(!lngVal || !latVal || !search_db_name) {
        alert("Please fill all necessary fields");
    } else {
        const baseCoords = [lngVal, latVal];
        const targetPoint = turf.point(baseCoords);

        $.ajax({
            method: "POST",
            url: "http://localhost:8080/display_points",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(search_db_name),
            success: function(e) { 
                let feature_list = [];
                let distance_dict = {}

                /*
                * Turf has compatibility issues, so i created my own function to calculate
                * the nearest points, we calculate first distance between all points, then
                * store it (as dict key) with the current point (value) in a dict and then sort
                * it, finaly we get the n selected value
                */
                if (search_db_name == 'airports'){
                    // Looping throw 
                    for(elements in e){
                        let lng = e[elements]['lon'];
                        let lat = e[elements]['lat'];
                        let coords = [lng, lat];
                        let point = turf.point(coords);
                        let distance = turf.distance(targetPoint,point);
                        distance_dict[distance] = point
                        feature_list.push(point);
                    }

                    key_list = Object.keys(distance_dict);
                    // converting key_list into float list
                    key_list = key_list.map(Number)
                    key_list.sort(function(a, b){return a - b})
                    let neighbour_list = []
                    if(numberNearPoints > key_list.length) numberNearPoints = key_list.length;
                    for(let i =0; i<numberNearPoints; i++) {
                        neighbour_list.push(distance_dict[key_list[i]])
                    }


                let featureCollection = turf.featureCollection(neighbour_list);
                // displaying it on the map
                let sourceName = 'NEAREST-' + layerID;
                layerID += 1;
                draw.add(targetPoint);
                addToMenu(sourceName);
                drawFolderFeatureCollection(featureCollection, sourceName)


                } else {
                 alert('data not found');
                }
            },
            done: function() { console.log("Done");}
        });
    }
}


// showing all railroads within a selected state
function showRails() {
    // requesting data from the back
    $.ajax({
            method: "GET",
            url: "http://localhost:8080/get_rails",
            headers: {"Content-Type": "application/json"},
            success: function(e) { 
                let sourceName = 'RAILS-' + layerID;
                let featureCollection = e.results[0];
                // fitering our feature list based on state name
                var matchingFeatures = featureCollection.features.filter(function(feature) {
                    return feature.properties.states.includes(selected_us_state)
                })
                layerID += 1;

                // Drawing filtered features
                addToMenu(sourceName);
                drawFolderFeatureCollection(turf.featureCollection(matchingFeatures), sourceName);
            },
            done: function() { console.log("Done");}
        });
}