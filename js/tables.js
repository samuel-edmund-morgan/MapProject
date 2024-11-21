// tables.js
function populateColumnTable(sheetIndex, regionId, tableBody) {
    tableBody.innerHTML = '';

    const sheetNames = Object.keys(excelData);

    if (sheetIndex >= 0 && sheetIndex < sheetNames.length) {
        const sheetName = sheetNames[sheetIndex];
        const sheet = excelData[sheetName];
        const regionData = sheet.regions[regionId];
        console.log(excelData[sheetName].mainCategory);

        // Assign the mainCategory to the table header
        const tableHeader = tableBody.closest('table').querySelector('th');
        tableHeader.textContent = excelData[sheetName].mainCategory;

        if (regionData) {
            regionData.values.forEach(valueObj => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${valueObj.category}</td><td>${valueObj.value}</td>`;
                tableBody.appendChild(row);
            });
        }
    }
}