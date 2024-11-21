// noinspection TypeScriptUMDGlobal
// map-interactions.js

let highlightLayer;
const regionNameElement = document.getElementById('region-name');
let lastRegionId = null; // Track the last selected region

function highlightOnHoverFeature(e) {
    if (e.target !== highlightLayer) {
        e.target.setStyle({
            color: 'rgb(212,143,121)',
            fillColor: 'rgba(0,87,184,1.0)',
            fillOpacity: 0.5
        });
    }
}

function resetHoverFeature(e) {
    if (e.target !== highlightLayer) {
        e.target.setStyle({
            color: 'rgb(212,143,121)',
            fillColor: 'rgba(14,107,191,1.0)',
            fillOpacity: 1
        });
    }
}

const zoomLevels = {
    "0": 5,
    "25": 10,
    ...Array.from({ length: 24 }, (_, i) => i + 1).reduce((acc, id) => {
        acc[id] = 6;
        return acc;
    }, {})
};

function highlightFeature(e) {
    const regionId = e.target.feature.properties['id'];
    if (regionId === lastRegionId) return;

    lastRegionId = regionId;

    if (highlightLayer) {
        highlightLayer.setStyle({
            color: 'rgb(212,143,121)',
            fillColor: 'rgba(14,107,191,1.0)',
            fillOpacity: 1
        });
    }

    highlightLayer = e.target;
    highlightLayer.setStyle({
        color: 'rgb(212,143,121)',
        fillColor: 'rgba(0,87,184,1.0)',
        fillOpacity: 1
    });

    const zoomLevel = zoomLevels[regionId] || 7;
    const regionName = e.target.feature.properties['SSU'];
    regionNameElement.textContent = regionName || "Служба безпеки України";

    const bounds = highlightLayer.getBounds();
    map.flyToBounds(bounds, {
        maxZoom: zoomLevel,
        animate: true
    });

    populateColumnTable(energySheet, regionId, energyTable);
    populateColumnTable(communicationsSheet, regionId, communicationsTable);

}

const layer_ukr_admbnda_adm1_sspe_20240416_0 = new L.geoJson(json_ukr_admbnda_adm1_sspe_20240416_0, {
    attribution: '',
    interactive: true,
    keepBuffer: 4,
    dataVar: 'json_ukr_admbnda_adm1_sspe_20240416_0',
    layerName: 'layer_ukr_admbnda_adm1_sspe_20240416_0',
    pane: 'pane_ukr_admbnda_adm1_sspe_20240416_0',
    onEachFeature: pop_ukr_admbnda_adm1_sspe_20240416_0,
    style: style_ukr_admbnda_adm1_sspe_20240416_0_0,
});

function pop_ukr_admbnda_adm1_sspe_20240416_0(feature, layer) {
    layer.on({
        click: highlightFeature,
        mouseover: highlightOnHoverFeature,
        mouseout: resetHoverFeature
    });
}

function style_ukr_admbnda_adm1_sspe_20240416_0_0() {
    return {
        pane: 'pane_ukr_admbnda_adm1_sspe_20240416_0',
        opacity: 1,
        color: 'rgba(212,143,121,1.0)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 2.0,
        fill: true,
        fillOpacity: 1,
        fillColor: 'rgba(14,107,191,1.0)',
        interactive: true,
    }
}

map.createPane('pane_ukr_admbnda_adm1_sspe_20240416_0');
map.getPane('pane_ukr_admbnda_adm1_sspe_20240416_0').style.zIndex = 400;
map.getPane('pane_ukr_admbnda_adm1_sspe_20240416_0').style['mix-blend-mode'] = 'normal';
bounds_group.addLayer(layer_ukr_admbnda_adm1_sspe_20240416_0);
map.addLayer(layer_ukr_admbnda_adm1_sspe_20240416_0);
setBounds();