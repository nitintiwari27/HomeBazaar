const accessToken = mapToken;
const coords = coordinates;
const parsedCoords = typeof coords === "string" ? JSON.parse(coords) : coords;

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
    //  Create marker
    const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(parsedCoords)),
      name: `For Exact Location Contact: <strong>${contactNumber}</strong>`,
      id: "my-location",
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

    //  Popup DOM
    const popupEl = document.createElement("div");
    popupEl.className = "popup";
    popupEl.style.cssText = `
      background: white;
      border: 1px solid #888;
      padding: 8px 12px;
      border-radius: 6px;
      display: none;
      font-weight: 500;
    `;
    document.body.appendChild(popupEl);

    const popupOverlay = new ol.Overlay({
      element: popupEl,
      positioning: "bottom-center",
      offset: [0, -20],
    });

    map.addOverlay(popupOverlay);

    //  Track popup toggle state
    let popupVisible = false;

    //  Hover: show popup temporarily
    map.on("pointermove", (e) => {
      if (popupVisible) return; // Don't show on hover if already toggled on

      const feature = map.forEachFeatureAtPixel(e.pixel, (feat) => feat);

      if (feature && feature.get("id") === "my-location") {
        popupOverlay.setPosition(e.coordinate);
        popupEl.innerHTML = feature.get("name");
        popupEl.style.display = "block";
      } else {
        popupEl.style.display = "none";
      }
    });

    //  Click: toggle popup on marker, hide elsewhere
    map.on("singleclick", (e) => {
      const feature = map.forEachFeatureAtPixel(e.pixel, (feat) => feat);

      if (feature && feature.get("id") === "my-location") {
        if (popupVisible) {
          popupEl.style.display = "none";
          popupVisible = false;
        } else {
          popupOverlay.setPosition(e.coordinate);
          popupEl.innerHTML = feature.get("name");
          popupEl.style.display = "block";
          popupVisible = true;
        }
      } else {
        popupEl.style.display = "none";
        popupVisible = false;
      }
    });
  } else {
    console.error("Invalid coordinates passed to map.js:", parsedCoords);
  }
});
