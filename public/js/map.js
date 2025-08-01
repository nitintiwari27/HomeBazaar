const accessToken = mapToken;
var styleJson =
  "https://tiles.locationiq.com/v3/streets/vector.json?key=" + mapToken;
const map = new ol.Map({
  target: "map",
  view: new ol.View({
    center: ol.proj.fromLonLat([77.209, 28.6139]), // Longitude, Latitude for New Delhi
    zoom: 13,
  }),
});

olms.apply(map, styleJson);

new maplibregl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(new maplibregl.Popup().setHTML("<b>New Delhi</b>"))
  .addTo(map);
