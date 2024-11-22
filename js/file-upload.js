// file-upload.js


const selectFileButton = document.getElementById('select-file');
const uploadFileButton = document.getElementById('upload-file');
const fileInput = document.createElement('input');
let selectedFile;
let excelData = {}; // Store parsed data

fileInput.type = 'file';
fileInput.accept = '.xlsx';
fileInput.onchange = (event) => {
    selectedFile = event.target.files[0];
    if (selectedFile) {
        uploadFileButton.disabled = false; // Enable the upload button
    }
};

selectFileButton.addEventListener('click', () => {
    fileInput.click();
});

uploadFileButton.addEventListener('click', () => {
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                const mainCategory = worksheet['C1'] ? worksheet['C1'].v : 'Unknown Category';
                const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const categoryNames = sheetData[1].slice(2);

                const sheetObj = {
                    mainCategory,
                    regions: {}
                };

                for (let i = 2; i < sheetData.length; i++) {
                    const row = sheetData[i];
                    const regionId = row[0];
                    const regionName = row[1];
                    const dataValues = row.slice(2).map((value, index) => ({
                        category: categoryNames[index],
                        value: Math.round(value)
                    }));

                    sheetObj.regions[regionId] = {
                        name: regionName,
                        values: dataValues
                    };
                }

                excelData[sheetName] = sheetObj;
            });

            document.getElementById('software-div').style.display = 'block';
            document.getElementById('study-div').style.display = 'block';
            document.getElementById('informational-div').style.display = 'block';
            document.getElementById('communication-div').style.display = 'block';
            document.getElementById('energy-div').style.display = 'block';

            document.getElementById('general-ammunition-div').style.display = 'block';

            const regionId = 0;


            // Populate the general tables with static data
            populateSoftwareTable(regionId, generalSoftwareTable, true);
            populateColumnTable(studySheet, regionId, generalStudyTable);
            populateColumnTable(informationalSheet, regionId, generalInformationalTable);
            populateColumnTable(communicationsSheet, regionId, generalCommunicationTable);
            populateColumnTable(energySheet, regionId, generalEnergyTable);
            populateColumnTable(ammunitionSheet, regionId, generalAmmunitionTable);


            // Populate the specific tables with dynamic data
            //populateColumnTable(softwareSheet, regionId, softwareTable);

            populateSoftwareTable(regionId, softwareTable, false);
            populateColumnTable(studySheet, regionId, studyTable);
            populateColumnTable(informationalSheet, regionId, informationalTable);
            populateColumnTable(communicationsSheet, regionId, communicationTable);
            populateColumnTable(energySheet, regionId, energyTable);

            // Position the communications-div relative to study-div
            const logoContainer = document.getElementById('logo-container');
            const studyDiv = document.getElementById('study-div');
            const informationalDiv = document.getElementById('informational-div');
            const communicationDiv = document.getElementById('communication-div');
            const energyDiv = document.getElementById('energy-div');

            function positionStudyDiv() {
                const logoContainerRect = logoContainer.getBoundingClientRect();
                studyDiv.style.position = 'absolute';
                studyDiv.style.top = `${logoContainerRect.bottom + 1}px`; // 10px margin
                studyDiv.style.right = `${logoContainer.right}px`;
            }
            function positionInformationalDiv() {
                const studyDivRect = studyDiv.getBoundingClientRect();
                informationalDiv.style.position = 'absolute';
                informationalDiv.style.top = `${studyDivRect.bottom + 1}px`; // 10px margin
                informationalDiv.style.right = `${studyDiv.right}px`;
            }
            function positionCommunicationDiv() {
                const informationalDivRect = informationalDiv.getBoundingClientRect();
                communicationDiv.style.position = 'absolute';
                communicationDiv.style.top = `${informationalDivRect.bottom + 1}px`; // 10px margin
                communicationDiv.style.right = `${informationalDiv.right}px`;
            }
            function positionEnergyDiv() {
                const communicationDivRect = communicationDiv.getBoundingClientRect();
                energyDiv.style.position = 'absolute';
                energyDiv.style.top = `${communicationDivRect.bottom + 1}px`; // 10px margin
                energyDiv.style.right = `${communicationDiv.right}px`;
            }

            // Initial positioning
            positionStudyDiv()
            positionInformationalDiv();
            positionCommunicationDiv();
            positionEnergyDiv();


            // Hide or show divs based on regionId
            const divsToToggle = ['software-div', 'study-div', 'informational-div', 'communication-div', 'energy-div'];
            divsToToggle.forEach(divId => {
                document.getElementById(divId).style.display = regionId === 0 ? 'none' : 'block';
            });

            // Reposition on window resize
            window.addEventListener('resize', () => {
                positionStudyDiv();
                positionInformationalDiv();
                positionCommunicationDiv();
                positionEnergyDiv();
            });

            initializeRegionSums();
            // Initialize the map and add the layer
            initializeMap();

            const layer_ukr_admbnda_adm1_sspe_20240416_0 = new L.geoJson(json_ukr_admbnda_adm1_sspe_20240416_0, {
                attribution: '',
                interactive: true,
                keepBuffer: 8,
                dataVar: 'json_ukr_admbnda_adm1_sspe_20240416_0',
                layerName: 'layer_ukr_admbnda_adm1_sspe_20240416_0',
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

            map.createPane('pane_ukr_admbnda_adm1_sspe_20240416_0');
            map.getPane('pane_ukr_admbnda_adm1_sspe_20240416_0').style.zIndex = 400;
            map.getPane('pane_ukr_admbnda_adm1_sspe_20240416_0').style['mix-blend-mode'] = 'normal';
            bounds_group.addLayer(layer_ukr_admbnda_adm1_sspe_20240416_0);
            map.addLayer(layer_ukr_admbnda_adm1_sspe_20240416_0);
            map.setMaxBounds(map.getBounds());
            //setBounds();

            initializeRegionSums();

            populateRegionList();


        };
        reader.readAsArrayBuffer(selectedFile);
        uploadFileButton.disabled = true; // Disable upload after processing
        document.getElementById('overlay').style.display = 'none';
    }
});