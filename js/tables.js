// tables.js

function populatePieTable(regionId) {
    const tableBody = $('#pie-table tbody');
    tableBody.empty();

    for (const sheetName in excelData) {
        const sheet = excelData[sheetName];
        const regionData = sheet.regions[regionId];
        if (regionData) {
            const totalValue = regionData.values.reduce((sum, valueObj) => sum + (parseInt(valueObj.value) || 0), 0);
            tableBody.append(`<tr><td>${sheet.mainCategory}</td><td>${totalValue}</td></tr>`);
        }
    }

    $('#pie-table').DataTable();
}

function populateColumnTable(sheetIndex) {
    const tableBody = $('#column-table tbody');
    tableBody.empty();

    const sheetNames = Object.keys(excelData);
    if (sheetIndex >= 0 && sheetIndex < sheetNames.length) {
        const sheetName = sheetNames[sheetIndex];
        const sheet = excelData[sheetName];
        const regionId = lastRegionId !== null ? lastRegionId : 0;
        const regionData = sheet.regions[regionId];

        if (regionData) {
            regionData.values.forEach(valueObj => {
                tableBody.append(`<tr><td>${valueObj.category}</td><td>${valueObj.value}</td></tr>`);
            });
        }
    }

    $('#column-table').DataTable();
}

// Call these functions with appropriate parameters to populate the tables
populatePieTable(0);
populateColumnTable(0);