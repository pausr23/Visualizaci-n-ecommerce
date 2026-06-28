const currentFilters = {

    product: "Todos",

    channel: "Todos",

    city: [],

    shift: "Todos", 

     startDate: null,

    endDate: null

};

function populateFilter(filterId, values){

    const select = document.getElementById(filterId);

    // Limpiar opciones anteriores
    select.innerHTML = "";

    // Agregar "Todos"
    const defaultOption = document.createElement("option");
    defaultOption.value = "Todos";
    defaultOption.textContent = "Todos";
    select.appendChild(defaultOption);

    // Agregar opciones
    values.forEach(value =>{

        const option = document.createElement("option");

        option.value = value;

        option.textContent = value;

        select.appendChild(option);

    });

}

function initializeFilters(data){

    populateFilter(
        "product-filter",
        getUniqueValues(data,"Product_category")
    );

    populateFilter(
        "channel-filter",
        getUniqueValues(data,"channel_name")
    );

    populateFilter(
        "city-filter",
        getUniqueValues(data,"Customer_City")
    );

    populateFilter(
    "shift-filter",
    getUniqueValues(data, "Agent Shift")
    );

   new TomSelect("#city-filter", {
        plugins: ["remove_button"],

        maxItems: null,

        placeholder: "Buscar ciudades...",

        // Mostrar muchas opciones
        maxOptions: 5000,

        // Ordenar alfabéticamente
        sortField: {
            field: "text",
            direction: "asc"
        }
    });

    initializeDateRange(data);

}

function addFilterEvents() {

    document.getElementById("product-filter")
        .addEventListener("change", function () {

            currentFilters.product = this.value;

            applyFilters();

        });

    document.getElementById("channel-filter")
        .addEventListener("change", function () {

            currentFilters.channel = this.value;

            applyFilters();

        });

    document.getElementById("city-filter")
    .addEventListener("change", function () {

        currentFilters.city = Array.from(this.selectedOptions)
            .map(option => option.value)
            .filter(value => value !== "Todos");

        applyFilters();

    });

    document.getElementById("shift-filter")
        .addEventListener("change", function () {

            currentFilters.shift = this.value;

            applyFilters();

        });

    document.getElementById("start-date")
    .addEventListener("change", function(){

        currentFilters.startDate = this.value
            ? new Date(this.value)
            : null;

        applyFilters();

        });

    document.getElementById("end-date")
        .addEventListener("change", function(){

            if(this.value){
                currentFilters.endDate = new Date(this.value);
                currentFilters.endDate.setHours(23,59,59,999);
            }else{
                currentFilters.endDate = null;
            }

            applyFilters();

        });

    document.getElementById("clear-filters")
         .addEventListener("click", resetFilters);

}

function resetFilters() {

    currentFilters.product = "Todos";
    currentFilters.channel = "Todos";
    currentFilters.city = [];
    currentFilters.shift = "Todos";
    currentFilters.startDate = null;
    currentFilters.endDate = null;

    document.getElementById("product-filter").value = "Todos";
    document.getElementById("channel-filter").value = "Todos";
    document.getElementById("city-filter").tomselect.clear();
    document.getElementById("shift-filter").value = "Todos";
    document.getElementById("start-date").value = "";
    document.getElementById("end-date").value = "";

    applyFilters();

}

//Corazón del dashboard
function applyFilters() {

    filteredData = dashboardData.filter(d => {

        const productMatch =
            currentFilters.product === "Todos" ||
            d.Product_category === currentFilters.product;

        const channelMatch =
            currentFilters.channel === "Todos" ||
            d.channel_name === currentFilters.channel;

        const cityMatch =
            currentFilters.city.length === 0 ||
            currentFilters.city.includes(d.Customer_City);

        const shiftMatch =
            currentFilters.shift === "Todos" ||
            d["Agent Shift"] === currentFilters.shift;

        const reportedDate = d["Issue_reported at"]
            ? d3.timeParse("%d/%m/%Y %H:%M")(d["Issue_reported at"])
            : null;

        const dateMatch =
            !reportedDate ||
            (
                (!currentFilters.startDate || reportedDate >= currentFilters.startDate) &&
                (!currentFilters.endDate || reportedDate <= currentFilters.endDate)
            );

        return (
            productMatch &&
            channelMatch &&
            cityMatch &&
            shiftMatch &&
            dateMatch
        );

    });

    updateDashboard();

    console.log(
        "Filtros aplicados:",
        filteredData.length,
        "registros"
    );

}

function initializeDateRange(data){

    const parseDate = d3.timeParse("%d/%m/%Y %H:%M");

    const dates = data
        .map(d => parseDate(d["Issue_reported at"]))
        .filter(d => d != null);

    const minDate = d3.min(dates);
    const maxDate = d3.max(dates);

    const formatDate = d3.timeFormat("%Y-%m-%d");

    document.getElementById("start-date").min = formatDate(minDate);
    document.getElementById("start-date").max = formatDate(maxDate);

    document.getElementById("end-date").min = formatDate(minDate);
    document.getElementById("end-date").max = formatDate(maxDate);

    console.log("Fecha mínima:", formatDate(minDate));
    console.log("Fecha máxima:", formatDate(maxDate));
}