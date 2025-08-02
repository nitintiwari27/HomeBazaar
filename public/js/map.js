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
    // 🧭 Create your marker
    const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(parsedCoords)),
      name: "Exact Location will be Provided after Booking",
      id: "my-location", // 🔑 Unique ID to identify your marker
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

    // 💬 Create the popup element
    const popupEl = document.createElement("div");
    popupEl.className = "popup";
    popupEl.style.cssText = `
      background: white;
      border: 1px solid #888;
      padding: 8px 12px;
      border-radius: 6px;
    `;
    document.body.appendChild(popupEl);

    const popupOverlay = new ol.Overlay({
      element: popupEl,
      positioning: "bottom-center",
      offset: [0, -20],
    });
    map.addOverlay(popupOverlay);

    // 🖱️ Show popup only if clicked on your marker
    map.on("singleclick", function (e) {
      const feature = map.forEachFeatureAtPixel(e.pixel, function (feat) {
        return feat;
      });

      // ✅ Show popup only for your marker
      if (feature && feature.get("id") === "my-location") {
        popupOverlay.setPosition(e.coordinate);
        popupEl.innerHTML = feature.get("name");
        popupEl.style.display = "block";
      } else {
        popupEl.style.display = "none"; // ❌ Hide if clicked elsewhere
      }
    });
  } else {
    console.error("Invalid coordinates passed to map.js:", parsedCoords);
  }
});
