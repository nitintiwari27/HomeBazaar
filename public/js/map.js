const accessToken = mapToken;
const coords = coordinates;
const parsedCoords = typeof coords === "string" ? JSON.parse(coords) : coords;
console.log(parsedCoords);

const styleJson =
  "https://tiles.locationiq.com/v3/streets/vector.json?key=" + accessToken;

const map = new ol.Map({
  target: "map",
  view: new ol.View({
    center: ol.proj.fromLonLat(parsedCoords),
    zoom: 13,
  }),
});

olms.apply(map, styleJson).then(() => {
  if (parsedCoords && parsedCoords.length === 2) {
    const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(parsedCoords)),
      name: "User Marker",
    });

    marker.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          scale: 0.5,
          src: "https://tiles.locationiq.com/static/images/marker.png",
        }),
      })
    );

    const vectorSource = new ol.source.Vector({
      features: [marker],
    });

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      zIndex: 1,
    });

    map.addLayer(vectorLayer);
  } else {
    console.error("Invalid coordinates passed to map.js:", parsedCoords);
  }
});
