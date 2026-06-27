function updateDashboard() {

    updateKPIs(filteredData);
    
    drawHeatmap(filteredData);

    drawScatter(filteredData);

    drawTreemap(filteredData);

}
async function initDashboard(){

    try{

        const data = await loadData();

        const ciudadesConTiempo = d3.rollups(
            data.filter(d =>
                d.Customer_City != null &&
                d.Customer_City !== "" &&
                d.connected_handling_time != null &&
                d.connected_handling_time !== "" &&
                d["CSAT Score"] != null
            ),
            v => v.length,
            d => d.Customer_City
        )
        .sort((a, b) => b[1] - a[1]);

        console.log("Ciudades con tiempo de atención:", ciudadesConTiempo);

        console.log(data);

        console.log(data[0]);

        initializeFilters(data);

        addFilterEvents();

        updateDashboard();

    }

    catch(error){

        console.error(error);

    }

}

initDashboard();
