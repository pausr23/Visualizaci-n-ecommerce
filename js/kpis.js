function updateKPIs(data){

    const totalIncidencias = data.length;

    const promedioCSAT = d3.mean(
        data.filter(d => d["CSAT Score"] != null),
        d => d["CSAT Score"]
    );

    const tiempoPromedio = d3.mean(
        data.filter(d => d.connected_handling_time != null),
        d => d.connected_handling_time
    );

    const totalCiudades = [
        ...new Set(
            data
                .map(d => d.Customer_City)
                .filter(city => city != null && city !== "")
        )
    ].length;

    document.getElementById("total-incidencias").textContent =
        totalIncidencias.toLocaleString();

    document.getElementById("csat-promedio").textContent =
        promedioCSAT !== undefined ? promedioCSAT.toFixed(2) : "0.00";

    document.getElementById("tiempo-promedio").textContent =
        tiempoPromedio !== undefined ? tiempoPromedio.toFixed(1) + " min" : "Sin datos";

    document.getElementById("ciudades-analizadas").textContent =
        totalCiudades;
}