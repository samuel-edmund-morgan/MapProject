// noinspection TypeScriptUMDGlobal

let highlightLayer;
const regionNameElement = document.getElementById('region-name');

// Elements for file selection
const selectFileButton = document.getElementById('select-file');
const uploadFileButton = document.getElementById('upload-file');
const fileInput = document.getElementById('file-input');

let selectedFile;

let excelData = {}; // Store parsed data



// Event listener to open file dialog
selectFileButton.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx';
    fileInput.onchange = (event) => {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            uploadFileButton.disabled = false; // Enable the upload button
        }
    };
    fileInput.click();
});

uploadFileButton.addEventListener('click', () => {
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Parse each sheet and store structured data
            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Process rows and columns as per your file structure
                const categoryNames = sheetData[1].slice(2); // Extract column names
                const sheetObj = { categories: categoryNames, regions: {} };

                for (let i = 2; i < sheetData.length; i++) {
                    const row = sheetData[i];
                    const regionId = row[0];
                    const regionName = row[1];
                    const dataValues = row.slice(2);

                    sheetObj.regions[regionId] = {
                        name: regionName,
                        values: dataValues
                    };
                }

                excelData[sheetName] = sheetObj;
            });

            //console.log("Data Parsed Successfully:", excelData);
        };
        reader.readAsArrayBuffer(selectedFile);
        uploadFileButton.disabled = true; // Disable upload after processin
    }
});
























const map = L.map('map', {
    zoomControl: false,
    maxZoom: 7,
    minZoom: 5,
    zoom: 5,  // Set initial zoom level to 5
    preferCanvas: true,  // Switch to Canvas rendering for smoother map interactions
    continuousWorld: true,
    noWrap: false
});


L.tileLayer('Tiles/{z}/{x}/{y}.png', {
    maxZoom: 7,
    minZoom: 5,
    noWrap: true,
    updateWhenIdle: true,
    keepBuffer: 400  // Higher buffer for smoother dragging
}).addTo(map);


function highlightOnHoverFeature(e) {
    // Only change style if the hovered layer is not the currently highlighted (clicked) layer
    if (e.target !== highlightLayer) {
        e.target.setStyle({
            color: 'rgba(255,223,0,1.0)',  // Border color on hover
            fillColor: '#008000',  // Fill color on hover
            fillOpacity: 0.85
        });
    }
}

function resetHoverFeature(e) {
    // Only reset style if it's not the currently highlighted (clicked) layer
    if (e.target !== highlightLayer) {
        e.target.setStyle({
            color: 'rgba(255,223,0,1.0)',  // Original border color
            fillColor: 'rgba(0,87,184,1.0)',  // Original fill color
            fillOpacity: 1  // Original fill opacity
        });
    }
}


// Define a zoom level for each region by ID
const zoomLevels = {
    "0": 5, // Unique zoom level for ID 0
    ...Array.from({ length: 24 }, (_, i) => i + 1).reduce((acc, id) => {
        acc[id] = 7;
        return acc;
    }, {})
};


function highlightFeature(e) {
    // Reset the previously highlighted region if it exists
    if (highlightLayer) {
        highlightLayer.setStyle({
            color: 'rgba(255,223,0,1.0)',  // Original border color
            fillColor: 'rgba(0,87,184,1.0)',  // Original fill color
            fillOpacity: 1  // Original fill opacity
        });
    }
    // Set the clicked region as the highlighted layer
    highlightLayer = e.target;
    highlightLayer.setStyle({
        color: 'rgba(255,223,0,1.0)',  // Highlight border color
        fillColor: '#008000',  // Highlight fill color on click
        fillOpacity: 1  // Highlight fill opacity
    });

    // Get the region's ID and use it to determine the zoom level
    const regionId = e.target.feature.properties['id'];
    const zoomLevel = zoomLevels[regionId] || 7; // Default zoom level if ID is not in the map
    // Update the region name in `top-left-div`
    const regionName = e.target.feature.properties['SSU'];

    regionNameElement.textContent = regionName || "Служба безпеки України";

    // Center and zoom the map on the selected feature with custom zoom level
    const bounds = highlightLayer.getBounds();
    map.flyToBounds(bounds, {
        maxZoom: zoomLevel,
        animate: true
    });

    for (const sheetName in excelData) {
        const sheet = excelData[sheetName];
        const regionData = sheet.regions[regionId];

        if (regionData) {
            console.log(`Data for region ${regionId} in ${sheetName}:`, regionData);
            // Here you can add data to chart update functions
        }
    }

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


function populateRegionList() {
    const regionList = document.getElementById('regions');
    layer_ukr_admbnda_adm1_sspe_20240416_0.eachLayer(function(layer) {
        const regionName = layer.feature.properties['SSU'];
        if (regionName) {
            const listItem = document.createElement('li');
            listItem.textContent = regionName;
            listItem.style.cursor = 'pointer';
            listItem.onclick = function() {
                highlightFeature({ target: layer });
            };
            regionList.appendChild(listItem);
        }
    });
}

const zoomControl = L.control.zoom({
    position: 'topleft'
});

zoomControl.addTo(map);
const bounds_group = new L.featureGroup([]);

function setBounds() {
    // if (bounds_group.getLayers().length) {
    //     map.fitBounds(bounds_group.getBounds());
    // }
    map.setMaxBounds(map.getBounds());
}

map.setView([48.3794, 31.1656], 5); // Coordinates for the center of your map, with zoom level 5


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
        color: 'rgba(255,223,0,1.0)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 5.0,
        fill: true,
        fillOpacity: 1,
        fillColor: 'rgba(0,87,184,1.0)',
        interactive: true,
    }
}
map.createPane('pane_ukr_admbnda_adm1_sspe_20240416_0');
map.getPane('pane_ukr_admbnda_adm1_sspe_20240416_0').style.zIndex = 400;
map.getPane('pane_ukr_admbnda_adm1_sspe_20240416_0').style['mix-blend-mode'] = 'normal';
bounds_group.addLayer(layer_ukr_admbnda_adm1_sspe_20240416_0);
map.addLayer(layer_ukr_admbnda_adm1_sspe_20240416_0);
setBounds();
populateRegionList();
resetLabels([layer_ukr_admbnda_adm1_sspe_20240416_0]);
map.on("layeradd", function(){
    resetLabels([layer_ukr_admbnda_adm1_sspe_20240416_0]);
});
map.on("layerremove", function(){
    resetLabels([layer_ukr_admbnda_adm1_sspe_20240416_0]);
});
