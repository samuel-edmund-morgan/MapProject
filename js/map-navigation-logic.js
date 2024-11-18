// noinspection TypeScriptUMDGlobal

let highlightLayer;
const regionNameElement = document.getElementById('region-name');

// Elements for file selection
const selectFileButton = document.getElementById('select-file');
const uploadFileButton = document.getElementById('upload-file');
const fileInput = document.createElement('input');
let selectedFile;
let excelData = {}; // Store parsed data

// Define chart variables
let pieChart, columnChart;

// Initialize charts once when the page loads
function initCharts() {
    const pieCtx = document.getElementById('pie-chart-canvas').getContext('2d');
    //Create pieChart variable with Chart.js that will show percentage on pie sectors
    pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                datalabels: {
                    formatter: (value, context) => {
                        let sum = 0;
                        const dataArr = context.chart.data.datasets[0].data;
                        dataArr.forEach(data => {
                            sum += data;
                        });
                        const percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    },
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 8
                    }
                }
            }
        },
        plugins: [ChartDataLabels],
        onClick: (e, elements) => {
            if (elements.length) {
                const categoryIndex = elements[0].index; // Get clicked category index
                updateColumnChart(categoryIndex); // Call column chart update
            }
        }
    });

    const columnCtx = document.getElementById('column-chart-canvas').getContext('2d');
    columnChart = new Chart(columnCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Values',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to update column chart based on selected category
function updateColumnChart(categoryIndex) {
    let columnLabels = [];
    let columnData = [];

    for (const sheetName in excelData) {
        const sheet = excelData[sheetName];
        const regionData = sheet.regions[lastRegionId];

        if (regionData) {
            // Get subcategories and their values
            console.log(sheet.categories);
            columnLabels = sheet.categories; // Assume `categories` holds subcategories
            console.log(regionData.values);
            console.log(regionData.values[categoryIndex])
            columnData = regionData.values[categoryIndex]; // Get corresponding subcategory data
        }
    }

    columnChart.data.labels = columnLabels;
    columnChart.data.datasets[0].data = columnData;
    columnChart.update();
}


// Function to update the pie chart based on selected region
function updatePieChart(regionId) {
    let pieLabels = [];
    let pieData = [];

    // Populate pie chart data from all sheets for selected region
    for (const sheetName in excelData) {
        const sheet = excelData[sheetName];
        pieLabels.push(sheet.mainCategory);

        // Sum the values for the specified regionId
        const regionData = sheet.regions[regionId];
        if (regionData) {
            const totalValue = regionData.values.reduce((sum, value) => sum + (parseInt(value) || 0), 0);
            pieData.push(totalValue);
        }
    }



    pieChart.data.labels = pieLabels;
    pieChart.data.datasets[0].data = pieData;
    pieChart.update();
}

// Function to update column chart based on selected category
function updateColumnChart(categoryIndex) {
    let columnLabels = [];
    let columnData = [];

    for (const sheetName in excelData) {
        const sheet = excelData[sheetName];
        const regionData = sheet.regions[lastRegionId];
        if (regionData) {
            columnLabels = sheet.categories;
            columnData.push(regionData.values[categoryIndex]);
        }
    }

    columnChart.data.labels = columnLabels;
    columnChart.data.datasets[0].data = columnData;
    columnChart.update();
}

fileInput.type = 'file';
fileInput.accept = '.xlsx';
fileInput.onchange = (event) => {
    selectedFile = event.target.files[0];
    if (selectedFile) {
        uploadFileButton.disabled = false; // Enable the upload button
    }
};
// Event listener to open file dialog
selectFileButton.addEventListener('click', () => {
    fileInput.click();
});


// Call initCharts once to initialize the charts
initCharts();




uploadFileButton.addEventListener('click', () => {
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Parse each sheet and store structured data
            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];



                // Extract the main category from cell C1
                const mainCategory = worksheet['C1'] ? worksheet['C1'].v : 'Unknown Category';

                const sheetObj = {
                    mainCategory, // Save main category directly
                    regions: {}
                };



                const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Process rows and columns as per your file structure
                //const categoryNames = sheetData[1].slice(2); // Extract column names
                //const sheetObj = { categories: categoryNames, regions: {} };

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


            // Display data for regionId 0 after upload
            const regionId = 0;
            updatePieChart(regionId); // Update pie chart for regionId 0 initially

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

let lastRegionId = null; // Track the last selected region

function highlightFeature(e) {

    const regionId = e.target.feature.properties['id'];

    // Check if the clicked region is the same as the last selected region
    if (regionId === lastRegionId) return;

    // Update the last selected region
    lastRegionId = regionId;


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
    //const regionId = e.target.feature.properties['id'];
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

    updatePieChart(regionId);

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
