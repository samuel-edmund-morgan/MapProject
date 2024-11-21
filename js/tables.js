// tables.js

// function populatePieTable(regionId) {
//     const tableBody = document.querySelector('#pie-table tbody');
//     tableBody.innerHTML = '';
//
//     for (const sheetName in excelData) {
//         const sheet = excelData[sheetName];
//         const regionData = sheet.regions[regionId];
//         if (regionData) {
//             const totalValue = regionData.values.reduce((sum, valueObj) => sum + (parseInt(valueObj.value) || 0), 0);
//             const row = document.createElement('tr');
//             row.innerHTML = `<td>${sheet.mainCategory}</td><td>${totalValue}</td>`;
//             tableBody.appendChild(row);
//         }
//     }
// }


function populateColumnTable(sheetIndex, regionId, tableBody) {
    tableBody.innerHTML = '';
    const sheetNames = Object.keys(excelData);
    if (sheetIndex >= 0 && sheetIndex < sheetNames.length) {
        const sheetName = sheetNames[sheetIndex];
        const sheet = excelData[sheetName];
        const regionData = sheet.regions[regionId];

        if (regionData) {
            regionData.values.forEach(valueObj => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${valueObj.category}</td><td>${valueObj.value}</td>`;
                tableBody.appendChild(row);
            });
        }
    }
}
