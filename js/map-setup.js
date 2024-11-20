// map-setup.js

const map = L.map('map', {
    zoomControl: false,
    maxZoom: 7,
    minZoom: 5,
    zoom: 5,
    preferCanvas: true,
    continuousWorld: true,
    noWrap: false
});

L.tileLayer('Tiles/{z}/{x}/{y}.png', {
    maxZoom: 7,
    minZoom: 5,
    noWrap: true,
    updateWhenIdle: true,
    keepBuffer: 400
}).addTo(map);

const zoomControl = L.control.zoom({
    position: 'topleft'
});

zoomControl.addTo(map);
const bounds_group = new L.featureGroup([]);

function setBounds() {
    map.setMaxBounds(map.getBounds());
}

map.setView([48.3794, 31.1656], 5);