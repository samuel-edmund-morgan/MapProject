// noinspection TypeScriptUMDGlobal
// map-interactions.js

//Testing
// Calculate the sum of category integers for each region, excluding regionId = 0
let regionSums = {};
let minSum = 0;
let maxSum = 0;
let highlightLayer;
const regionNameElement = document.getElementById('region-name');
let lastRegionId = null; // Track the last selected region
const zoomLevels = {
    "0": 6,
    "1": 8,
    "25": 9,
    ...Array.from({length: 24}, (_, i) => i + 1).reduce((acc, id) => {
        if (id !== 1) {
            acc[id] = 7;
        }
        return acc;
    }, {})
};

function highlightOnHoverFeature(e) {

    if (e.target !== highlightLayer) {
        e.target.setStyle({
            color: 'rgb(212,143,121)',
            fillOpacity: 0.8
        });
    }

}

function resetHoverFeature(e) {

    if (e.target !== highlightLayer) {
        e.target.setStyle({
            color: 'rgb(212,143,121)',
            fillOpacity: 1,
            weight: 1,
        });
    }

}

function highlightFeature(e) {

    const regionId = e.target.feature.properties['id'];
    if (regionId === lastRegionId) return;
    lastRegionId = regionId;

    if (highlightLayer) {
        highlightLayer.setStyle({
            color: 'rgb(212,143,121)',
            fillOpacity: 1,
            weight: 1,
        });
    }

    highlightLayer = e.target;
    highlightLayer.setStyle({
        color: 'rgb(212,143,121)',
        fillOpacity: 1,
        weight: 3,
    });

    const zoomLevel = zoomLevels[regionId] || 7;
    const regionName = e.target.feature.properties['SSU'];
    regionNameElement.textContent = regionName || "Служба безпеки України";

    const bounds = highlightLayer.getBounds();
    map.flyToBounds(bounds, {
        maxZoom: zoomLevel,
        animate: true
    });

    populateSoftwareTable(regionId, softwareTable, false);
    populateColumnTable(studySheet, regionId, studyTable);
    populateColumnTable(informationalSheet, regionId, informationalTable);
    populateColumnTable(communicationsSheet, regionId, communicationTable);
    populateColumnTable(energySheet, regionId, energyTable);


    // Hide or show divs based on regionId
    const divsToToggle = ['software-div', 'study-div', 'informational-div', 'communication-div', 'energy-div'];
    divsToToggle.forEach(divId => {
        document.getElementById(divId).style.display = regionId === '0' ? 'none' : 'block';
    });

}

function calculateRegionSums() {
    Object.keys(excelData).forEach(sheetName => {
        const sheet = excelData[sheetName];
        Object.keys(sheet.regions).forEach(regionId => {
            if (regionId === '0') return; // Skip regionId = 0
            const region = sheet.regions[regionId];
            const sum = region.values.reduce((acc, valueObj) => acc + valueObj.value, 0);
            if (!regionSums[regionId]) {
                regionSums[regionId] = 0;
            }
            regionSums[regionId] += sum;
        });
    });

    // Remove any undefined keys
    delete regionSums.undefined;
    return regionSums;
}

function initializeRegionSums() {
    regionSums = calculateRegionSums();
    if (Object.keys(regionSums).length > 0) {
        minSum = Math.min(...Object.values(regionSums));
        maxSum = Math.max(...Object.values(regionSums));
    }
}

function interpolateBlueColor(value, min, max) {

    const ratio = (value - min) / (max - min);
    const blue = Math.round(255 * (1 - ratio));
    const lightBlue = 120; // Adjust this value to set the lightest blue

    return `rgba(0,0,${lightBlue + blue},1.0)`;
}

function style_ukr_admbnda_adm1_sspe_20240416_0_0(feature) {

    const regionId = feature.properties['id'];
    const sum = regionSums[regionId] || '0';
    const fillColor = interpolateBlueColor(sum, minSum, maxSum);

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
        fillColor: fillColor,
        interactive: true
    }
}

function pop_ukr_admbnda_adm1_sspe_20240416_0(feature, layer) {

    layer.on({
        click: highlightFeature,
        mouseover: highlightOnHoverFeature,
        mouseout: resetHoverFeature
    });
}

