function updateDashboard() {

    updateKPIs(filteredData);
    
    drawHeatmap(filteredData);

    drawScatter(filteredData);

    drawTreemap(filteredData);

}
async function initDashboard(){

    try{

        const data = await loadData();

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
