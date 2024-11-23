// js/map-setup.js
let map;
let bounds_group;

function initializeMap() {

    map = L.map('map', {
        zoomControl: false,
        maxZoom: 10,
        minZoom: 5,
        zoom: 6,
        preferCanvas: true,
        continuousWorld: true,
        noWrap: false
    });


    L.tileLayer('Tiles/{z}/{x}/{y}.png', {
        maxZoom: 10,
        minZoom: 5,
        noWrap: true,
        updateWhenIdle: false,
        keepBuffer: 100
    }).addTo(map);


    const zoomControl = L.control.zoom({
        position: 'topleft'
    });

    zoomControl.addTo(map);
    bounds_group = new L.featureGroup([]);

    map.setView([48.3794, 31.1656], 5);
    map.setMaxBounds(map.getBounds());
    map.setView([48.3794, 31.1656], 6);
}