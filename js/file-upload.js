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

            // Show the communications-div once excelData is populated
            document.getElementById('study-div').style.display = 'block';
            document.getElementById('informational-div').style.display = 'block';
            document.getElementById('communication-div').style.display = 'block';
            document.getElementById('energy-div').style.display = 'block';

            const regionId = 0;
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
                studyDiv.style.top = `${logoContainerRect.bottom + 10}px`; // 10px margin
                studyDiv.style.right = `${logoContainer.right}px`;
            }

            function positionInformationalDiv() {
                const studyDivRect = studyDiv.getBoundingClientRect();
                informationalDiv.style.position = 'absolute';
                informationalDiv.style.top = `${studyDivRect.bottom + 10}px`; // 10px margin
                informationalDiv.style.right = `${studyDiv.right}px`;
            }

            function positionCommunicationDiv() {
                const informationalDivRect = informationalDiv.getBoundingClientRect();
                communicationDiv.style.position = 'absolute';
                communicationDiv.style.top = `${informationalDivRect.bottom + 10}px`; // 10px margin
                communicationDiv.style.right = `${informationalDiv.right}px`;
            }

            function positionEnergyDiv() {
                const communicationDivRect = communicationDiv.getBoundingClientRect();
                energyDiv.style.position = 'absolute';
                energyDiv.style.top = `${communicationDivRect.bottom + 10}px`; // 10px margin
                energyDiv.style.right = `${communicationDiv.right}px`;
            }



            // Initial positioning
            positionStudyDiv()
            positionInformationalDiv();
            positionCommunicationDiv();
            positionEnergyDiv();

            // Reposition on window resize
            //window.addEventListener('resize', positionStudyDivs);

        };
        reader.readAsArrayBuffer(selectedFile);
        uploadFileButton.disabled = true; // Disable upload after processing
    }
});