const currentFilters = {

    product: "Todos",

    channel: "Todos",

    city: "Todos",

    shift: "Todos"

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

            currentFilters.city = this.value;

            applyFilters();

        });

    document.getElementById("shift-filter")
        .addEventListener("change", function () {

            currentFilters.shift = this.value;

            applyFilters();

        });

    document.getElementById("clear-filters")
         .addEventListener("click", resetFilters);

}

function resetFilters() {

    currentFilters.product = "Todos";
    currentFilters.channel = "Todos";
    currentFilters.city = "Todos";
    currentFilters.shift = "Todos";

    document.getElementById("product-filter").value = "Todos";
    document.getElementById("channel-filter").value = "Todos";
    document.getElementById("city-filter").value = "Todos";
    document.getElementById("shift-filter").value = "Todos";

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
            currentFilters.city === "Todos" ||
            d.Customer_City === currentFilters.city;

        const shiftMatch =
            currentFilters.shift === "Todos" ||
            d["Agent Shift"] === currentFilters.shift;

        return (
            productMatch &&
            channelMatch &&
            cityMatch &&
            shiftMatch
        );

    });

    updateDashboard();

    console.log(
        "Filtros aplicados:",
        filteredData.length,
        "registros"
    );

}