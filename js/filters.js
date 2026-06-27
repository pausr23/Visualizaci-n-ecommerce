const currentFilters = {

    product: "Todos",

    channel: "Todos",

    city: [],

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

    document.getElementById("clear-filters")
         .addEventListener("click", resetFilters);

}

function resetFilters() {

    currentFilters.product = "Todos";
    currentFilters.channel = "Todos";
    currentFilters.city = [];
    currentFilters.shift = "Todos";

    document.getElementById("product-filter").value = "Todos";
    document.getElementById("channel-filter").value = "Todos";
    document.getElementById("city-filter").tomselect.clear();
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
            currentFilters.city.length === 0 ||
            currentFilters.city.includes(d.Customer_City);

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