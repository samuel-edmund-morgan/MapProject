// charts.js


let pieChart, columnChart;

function updateColumnChart(sheetIndex) {
    let columnLabels = [];
    let columnData = [];
    const sheetNames = Object.keys(excelData);

    if (sheetIndex >= 0 && sheetIndex < sheetNames.length) {
        const sheetName = sheetNames[sheetIndex];
        const sheet = excelData[sheetName];
        const regionId = lastRegionId !== null ? lastRegionId : 0; // Check for null and assign 0 if null
        const regionData = sheet.regions[regionId];

        if (regionData) {
            columnLabels = regionData.values.map(valueObj => valueObj.category);
            columnData = regionData.values.map(valueObj => valueObj.value);
        }
    }

    columnChart.data.labels = columnLabels;
    columnChart.data.datasets[0].data = columnData;
    columnChart.update();
}

function initCharts() {
    const pieCtx = document.getElementById('pie-chart-canvas').getContext('2d');
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
                        return (value * 100 / sum).toFixed(2) + "%";
                    },
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 8
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length) {
                    const sheetIndex = elements[0].index; // Get clicked category index
                    updateColumnChart(sheetIndex); // Call column chart update
                }
            }
        },
        plugins: [ChartDataLabels]
    });

    const columnCtx = document.getElementById('column-chart-canvas').getContext('2d');
    columnChart = new Chart(columnCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Кількість',
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

function updatePieChart(regionId) {
    let pieLabels = [];
    let pieData = [];

    for (const sheetName in excelData) {
        const sheet = excelData[sheetName];
        pieLabels.push(sheet.mainCategory);

        const regionData = sheet.regions[regionId];
        if (regionData) {
            const totalValue = regionData.values.reduce((sum, valueObj) => sum + (parseInt(valueObj.value) || 0), 0);
            pieData.push(totalValue);
        }
    }

    pieChart.data.labels = pieLabels;
    pieChart.data.datasets[0].data = pieData;
    pieChart.update();
}

initCharts();