function updateKPIs(data){

    // Total de incidencias
    const totalIncidencias = data.length;

    // CSAT promedio
    const promedioCSAT = d3.mean(data, d => d["CSAT Score"]);

    // Tiempo promedio de atención
    const tiempoPromedio = d3.mean(data, d => d.connected_handling_time);

    // Registros analizados
    const totalCiudades = getUniqueValues(
        data,
        "Customer_City"
    ).length;

    // Actualizar HTML

    document.getElementById("total-incidencias").textContent =
        totalIncidencias.toLocaleString();

    document.getElementById("csat-promedio").textContent =
        promedioCSAT.toFixed(2);

    document.getElementById("tiempo-promedio").textContent =
        tiempoPromedio.toFixed(1) + " min";

    document.getElementById("ciudades-analizadas").textContent =
        totalCiudades;

}