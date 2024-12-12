// tables.js


function populateColumnTable(sheetIndex, regionId, tableBody) {

    tableBody.innerHTML = '';

    const sheetNames = Object.keys(excelData);

    if (sheetIndex >= 0 && sheetIndex < sheetNames.length) {
        const sheetName = sheetNames[sheetIndex];
        const sheet = excelData[sheetName];
        const regionData = sheet.regions[regionId];

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

function populateSoftwareTable(regionId, tableBody, isGeneral) {
    tableBody.innerHTML = '';

    const sheetNamesAllPrograms = Object.keys(excelData);
    const sheetNameAllPrograms = sheetNamesAllPrograms[allSoftwareSheet];
    const sheetAllPrograms = excelData[sheetNameAllPrograms];
    const regionDataAllPrograms = sheetAllPrograms.regions[regionId];

    // Assign the mainCategory to the table header
    const tableHeader = tableBody.closest('table').querySelector('th');
    tableHeader.textContent = sheetAllPrograms.mainCategory;


    if (regionDataAllPrograms) {
        // Filter out elements where value is zero
        regionDataAllPrograms.values = regionDataAllPrograms.values.filter(valueObj => valueObj.value !== 0);
        console.log(regionDataAllPrograms);

        // Row of different software products in one ROW
// Determine categoriesString based on isGeneral
        const categoriesString = isGeneral
            ? "Програмні продукти (Microsoft Windows-273, Microsoft Office 365 E5-1788, i2 Analyst Notebook-100, Hunchly-36, NexusXplore-9, Sayari-3, ClearView AI-5, ClarityProject-3, Shodan-2, Marine Traffic-2, Flight Radar-2, Osavul-43, MindManager-53, Adobe Creative Cloud-80)"
            : "Програмні продукти (" + regionDataAllPrograms.values.map(valueObj => `${valueObj.category} - ${valueObj.value}`).join(', ') + ")";
        const totalValue = regionDataAllPrograms.values.reduce((acc, valueObj) => acc + valueObj.value, 0);
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `<td>${categoriesString}</td><td>${totalValue}</td>`;
        tableBody.appendChild(totalRow);
    }

    const sheetNamesSpecificPrograms = Object.keys(excelData);
    const sheetNameSpecificPrograms = sheetNamesSpecificPrograms[specificSoftwareSheet];
    const sheetSpecificPrograms = excelData[sheetNameSpecificPrograms];
    const regionDataSpecificPrograms = sheetSpecificPrograms.regions[regionId];

    if (regionDataSpecificPrograms) {
        regionDataSpecificPrograms.values.forEach(valueObj => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${valueObj.category}</td><td>${valueObj.value}</td>`;
            tableBody.appendChild(row);
        });
    }

}