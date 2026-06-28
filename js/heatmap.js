function drawHeatmap(data){

    d3.select(".heatmap")
        .selectAll("*")
        .remove();

    const container = d3.select(".heatmap");

    const wrapper = container
        .append("div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("overflow", "hidden");

    wrapper.append("p")
        .attr("class", "chart-description")
        .style("margin", "0 0 8px 0")
        .style("font-size", "13px")
        .style("color", "#C7D1E0")
        .style("line-height", "1.4")
        .style("flex", "0 0 auto")
        .text("Este mapa de calor muestra el promedio de satisfacción del cliente (CSAT) según la categoría del caso y el turno del agente.");

    const legend = wrapper
        .append("div")
        .style("display", "flex")
        .style("gap", "16px")
        .style("align-items", "center")
        .style("margin", "0 0 10px 0")
        .style("font-size", "12px")
        .style("color", "#C7D1E0")
        .style("flex", "0 0 auto");

    legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "6px")
        .html(`
            <span style="width:12px;height:12px;background:#D73027;display:inline-block;border-radius:3px;"></span>
            Menos satisfacción
        `);

    legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "6px")
        .html(`
            <span style="width:12px;height:12px;background:#1A9850;display:inline-block;border-radius:3px;"></span>
            Más satisfacción
        `);

    const heatmapData = d3.rollup(
        data,
        values => d3.mean(values, d => d["CSAT Score"]),
        d => d.category,
        d => d["Agent Shift"]
    );

    const formattedData = [];

    heatmapData.forEach((shiftMap, category)=>{
        shiftMap.forEach((csat, shift)=>{
            formattedData.push({
                category: category,
                shift: shift,
                csat: csat
            });
        });
    });

    const margin = {
        top: 20,
        right: 25,
        bottom: 45,
        left: 135
    };

    const containerWidth = container.node().clientWidth;
    const containerHeight = container.node().clientHeight;

    const descriptionSpace = 70;

    const width = containerWidth - margin.left - margin.right - 20;
    const height = containerHeight - margin.top - margin.bottom - descriptionSpace;

    const svg = wrapper
        .append("svg")
        .style("flex", "1 1 auto")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const categories = [...new Set(
        formattedData.map(d => d.category)
    )];

    const shifts = [
        "Morning",
        "Afternoon",
        "Evening",
        "Night",
        "Split"
    ];

    const x = d3.scaleBand()
        .domain(shifts)
        .range([0,width])
        .padding(0.05);

    const y = d3.scaleBand()
        .domain(categories)
        .range([0,height])
        .padding(0.05);

    const color = d3.scaleSequential()
        .domain([
            d3.min(formattedData,d=>d.csat),
            d3.max(formattedData,d=>d.csat)
        ])
        .interpolator(d3.interpolateRdYlGn);

    svg.append("g")
        .attr("transform", `translate(0,${height + 5})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("text")
        .attr("fill","white")
        .style("font-size","12px");

    svg.selectAll("rect")
        .data(formattedData)
        .enter()
        .append("rect")
        .attr("x",d=>x(d.shift))
        .attr("y",d=>y(d.category))
        .attr("width",x.bandwidth())
        .attr("height",y.bandwidth())
        .attr("fill",d=>color(d.csat));

}