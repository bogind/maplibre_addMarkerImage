let style = {
  'version': 8,
  'sources': {
  'raster-tiles': {
      'type': 'raster',
      'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      'tileSize': 256,
      'attribution':'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  "25_day_1": {
      "type": "geojson",
      "data": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
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




maplibregl.Map.prototype.addMarkerImage = function(id ,options={},callback){
  try {
      let marker = new maplibregl.Marker(options);
      let svgDoc;
      if (!options || !options.element) {
          svgDoc = marker._element.firstChild;// default marker
      }else{
          svgDoc = marker._element; // for SVG elements
      }
      let markerSVG = new XMLSerializer().serializeToString(svgDoc);
      let markerImg = new Image(svgDoc.width.baseVal.value,svgDoc.height.baseVal.value);
      markerImg.src = 'data:image/svg+xml;base64,' + window.btoa(markerSVG);
      markerImg.decode()
      .then(() => {
          if (!this.hasImage(id)) this.addImage(id,markerImg);   

          if(callback){
              callback()
              }
      })
      .catch((encodingError) => {
          console.error("Image Encoding Error")
          console.error(encodingError)
      });

  } catch (error) {
      console.error(error)
  }
}


let map = new maplibregl.Map({
  container: 'map',
  zoom:0,
  style:style
});


map.on('load', function () {

  map.addMarkerImage('marker')
  map.addMarkerImage('yellow-marker', {'anchor': 'bottom', 'scale':0.7, 'color':'yellow'} )
  map.addMarkerImage('orange-marker', {'anchor': 'bottom', 'scale':1.5, 'color':'orange'} )
  map.addMarkerImage('red-marker', {'anchor': 'bottom', 'scale':2, 'color':'red'} )
  map.addMarkerImage('black-marker', {'anchor': 'bottom', 'scale':3, 'color':'black'} )

  map.addLayer({
      'id': 'earthquakes',
      'type': 'symbol',
      'source': '25_day_1',
      'layout': {
          'icon-image': ['case',
          ['all', ['>=', ['get', 'mag'], 2], ['<', ['get', 'mag'], 3]],
          'yellow-marker',
          ['all', ['>=', ['get', 'mag'], 3], ['<', ['get', 'mag'], 4]],
          'orange-marker',
          ['all', ['>=', ['get', 'mag'], 4], ['<', ['get', 'mag'], 5]],
          'red-marker',
          ['>=', ['get', 'mag'], 5],
          'black-marker',
          'marker'
          ],
          'icon-size': 1,
          'icon-allow-overlap':true
      }
  });
          
});
