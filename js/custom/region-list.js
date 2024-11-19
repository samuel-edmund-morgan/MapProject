// region-list.js

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

populateRegionList();