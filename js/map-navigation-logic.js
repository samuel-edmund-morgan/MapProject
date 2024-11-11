// noinspection TypeScriptUMDGlobal

let highlightLayer;
const regionNameElement = document.getElementById('region-name');

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

    // Update the region name in `top-left-div`
    const regionName = e.target.feature.properties['SSU'];
    regionNameElement.textContent = regionName || "Ukraine";

    // Center and zoom the map on the clicked feature
    const bounds = highlightLayer.getBounds();
    map.flyToBounds(bounds, {
        maxZoom: 7,  // Adjust maxZoom as needed
        animate: true
    });

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


function zoomOutToUkraine() {
    // Reset the highlighted region if it exists
    if (highlightLayer) {
        highlightLayer.setStyle({
            color: 'rgba(255,223,0,1.0)',  // Original border color
            fillColor: 'rgba(0,87,184,1.0)',  // Original fill color
            fillOpacity: 1  // Original fill opacity
        });
        highlightLayer = null; // Clear the highlightLayer variable
    }

    map.setView([48.3794, 31.1656], 5);  // Center on Ukraine with zoom level 5
    document.getElementById('region-name').textContent = "Україна";  // Set text in top-left-div
}

function populateRegionList() {
    const regionList = document.getElementById('regions');


    // Add "Загальний" item
    const generalItem = document.createElement('li');
    generalItem.textContent = "Загальна мапа України";
    generalItem.style.cursor = 'pointer';
    generalItem.onclick = zoomOutToUkraine;  // Attach zoom-out functionality
    regionList.appendChild(generalItem);



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

function updateTooltips() {
    const currentZoom = map.getZoom();
    layer_ukr_admbnda_adm1_sspe_20240416_0.eachLayer(function(layer) {
        if (currentZoom === 8) {
            // Bind tooltip only at zoom level 8
            if (!layer.getTooltip()) {
                layer.bindTooltip(
                    layer.feature.properties['ADM1_UA'] !== null
                        ? String('<div style="color: #ffffff; font-size: 10pt; font-weight: bold; font-family: \'Montserrat\', sans-serif; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">' + layer.feature.properties['ADM1_UA']) + '</div>'
                        : '',
                    {
                        direction: "auto",
                        permanent: "true",
                        offset: [0, 0],
                        className: 'css_ukr_admbnda_adm1_sspe_20240416_0'
                    }
                );
                layer.openTooltip();
            }
        } else {
            // Unbind tooltip at other zoom levels
            if (layer.getTooltip()) {
                layer.unbindTooltip();
            }
        }
    });
}
setBounds();
populateRegionList();

// layer_ukr_admbnda_adm1_sspe_20240416_0.eachLayer(function(layer) {
//     layer.bindTooltip(
//         (layer.feature.properties['ADM1_UA'] !== null
//             ? String('<div style="color: #ffffff; font-size: 10pt; font-weight: bold; font-family: \'Montserrat\', sans-serif; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">' + layer.feature.properties['ADM1_UA']) + '</div>'
//             : ''),
//         {
//             direction: "auto",
//             //permanent: true,
//             offset: [-25, -70],
//             className: 'css_ukr_admbnda_adm1_sspe_20240416_0'
//         }
//     );
// });
resetLabels([layer_ukr_admbnda_adm1_sspe_20240416_0]);

//If want tooltips - enable
//map.on("zoomend", updateTooltips);

// Initial call to set the tooltip visibility on page load
//updateTooltips();

map.on("layeradd", function(){
    resetLabels([layer_ukr_admbnda_adm1_sspe_20240416_0]);
});
map.on("layerremove", function(){
    resetLabels([layer_ukr_admbnda_adm1_sspe_20240416_0]);
});

// Reset the region name to "Ukraine" when deselecting
map.on('click', function () {
    if (!highlightLayer) {
        regionNameElement.textContent = "Україна";
    }
});
