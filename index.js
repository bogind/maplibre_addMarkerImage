var style = {
    'version': 8,
    'sources': {
    'raster-tiles': {
        'type': 'raster',
        'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        'tileSize': 256,
        'attribution':'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
    },
    'layers': [
            {
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles',
                'minzoom': 0,
                'maxzoom': 22
            }
        ]
    }
var styleUrl = "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"

let markerOptions = {
      'anchor': 'bottom', // makes the tip of the pin appear on the geometry
       'color': '#ff00ff', // purple
       'scale': 2 // double the size
    }

maplibregl.Map.prototype.addMarkerImage = function(id, markerOptions){
    let marker = new maplibregl.Marker(markerOptions)
    let svgDoc = marker._element.firstChild // for markers created with SVG elements use marker._element
    let markerSVG = new XMLSerializer().serializeToString(svgDoc)
    let markerImg = new Image(svgDoc.width.baseVal.value,svgDoc.height.baseVal.value);
    markerImg.src = 'data:image/svg+xml;base64,' + window.btoa(markerSVG);
    this.addImage(id,markerImg)
}


var map = new maplibregl.Map({
    container: 'map',
    style:style
});



map.on('load', function () {
    map.addSource('point', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [0, 0]
                    }
                }
            ]
        }
    });
    map.addSource('point2', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [10, 10]
                    }
                }
            ]
        }
    });
    map.addMarkerImage('marker', markerOptions )
    map.loadImage(
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png',
        function (error, image) {
            if (error) throw error;
            map.addImage('cat', image);
            
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point',
                'layout': {
                    'icon-image': 'cat',
                    'icon-size': 0.1,
                    'icon-allow-overlap':true
                }
            });
            map.addLayer({
                'id': 'points-marker',
                'type': 'symbol',
                'source': 'point2',
                'layout': {
                    'icon-image': 'marker',
                    'icon-size': 1,
                    'icon-allow-overlap':true
                }
            });
            
            
        }
    );
});