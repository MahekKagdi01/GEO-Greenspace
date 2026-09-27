document.addEventListener("DOMContentLoaded", function () {

    const mapContainer =
        document.getElementById("map") ||
        document.getElementById("liveMap") ||
        document.getElementById("analysisMap") ||
        document.getElementById("dashboardMap");

    if (!mapContainer) return;

    window.map = L.map(mapContainer).setView([20.5937, 78.9629], 5);

    // Base Map (OpenStreetMap)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    // 🔥 FUNCTION TO LOAD MAP FROM BACKEND (UPDATED)
    const loadMapLayer = () => {

        const stateElement = document.getElementById("stateSelector");
        const layerElement = document.getElementById("layerSelector");

        const state = stateElement ? stateElement.value : "Maharashtra";
        const layer = layerElement ? layerElement.value : "Temperature";

        fetch(`http://127.0.0.1:8000/get-map?state_name=${state}&layer=${layer}`)
            .then(response => response.json())
            .then(data => {

                const tileUrl = data.tile_url;

                // Remove previous layer if exists
                if (window.eeLayer) {
                    map.removeLayer(window.eeLayer);
                }

                // Add new Earth Engine layer
                window.eeLayer = L.tileLayer(tileUrl, {
                    attribution: "Earth Engine",
                    opacity: 0.7
                }).addTo(map);

                console.log(`✅ Layer Loaded: ${layer} | State: ${state}`);

            })
            .catch(error => console.error("❌ Error:", error));
    };

    // 🔥 INITIAL LOAD
    loadMapLayer();

    // 🔥 EVENT LISTENERS (DROPDOWN CHANGE)
    const stateSelector = document.getElementById("stateSelector");
    const layerSelector = document.getElementById("layerSelector");

    if (stateSelector) {
        stateSelector.addEventListener("change", loadMapLayer);
    }

    if (layerSelector) {
        layerSelector.addEventListener("change", loadMapLayer);
    }

    // hide skeleton loader
    const skeleton = document.getElementById("map-skeleton");
    if (skeleton) {
        setTimeout(() => {
            skeleton.classList.add("hidden");
        }, 1000);
    }

    // force render after layout
    const fixMapSize = () => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    };

    fixMapSize();

    // Also fix on window resize to ensure responsiveness
    window.addEventListener('resize', fixMapSize);
});