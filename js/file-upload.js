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
            document.getElementById('bottom-right-div').style.display = 'block';
            document.getElementById('study-div').style.display = 'block';
            document.getElementById('communications-div').style.display = 'block';

            const regionId = 0;
            populateColumnTable(studySheet, regionId, studyTable);
            populateColumnTable(energySheet, regionId, energyTable);
            populateColumnTable(communicationsSheet, regionId, communicationsTable);

            // Position the communications-div relative to study-div
            const studyDiv = document.getElementById('study-div');
            const communicationsDiv = document.getElementById('communications-div');

            function positionCommunicationsDiv() {
                const studyDivRect = studyDiv.getBoundingClientRect();
                communicationsDiv.style.position = 'absolute';
                communicationsDiv.style.top = `${studyDivRect.bottom + 10}px`; // 10px margin
                communicationsDiv.style.left = `${studyDivRect.left}px`;
            }

            // Initial positioning
            positionCommunicationsDiv();

            // Reposition on window resize
            window.addEventListener('resize', positionCommunicationsDiv);

        };
        reader.readAsArrayBuffer(selectedFile);
        uploadFileButton.disabled = true; // Disable upload after processing
    }
});