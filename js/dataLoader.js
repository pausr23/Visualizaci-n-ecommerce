// Variables globales

let dashboardData = [];
let filteredData = [];

// Cargar datos

async function loadData() {

    dashboardData = await d3.csv(
        "data/Customer_support_data.csv",
        d3.autoType
    );

    filteredData = [...dashboardData];

    return dashboardData;

}

function getUniqueValues(data, column){

    return [...new Set(
        data
            .map(d => d[column])
            .filter(value => value != null && value !== "")
    )].sort((a, b) => a.localeCompare(b));

}