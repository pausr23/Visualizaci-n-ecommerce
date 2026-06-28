function drawScatter(data){

    d3.select(".scatter")
        .selectAll("*")
        .remove();

    const container = d3.select(".scatter");
    const containerWidth = container.node().clientWidth || 520;

    const margin = {
        top: 10,
        right: 15,
        bottom: 40,
        left: 45
    };

    const width = containerWidth - margin.left - margin.right;
    const height = 260;

    const wrapper = container
        .append("div")
        .style("width", "100%")
        .style("height", "100%")
        .style("overflow", "hidden")
        .style("position", "relative");

    const controls = d3.select(".scatter")
        .style("position", "relative")
        .insert("div", ":first-child")
        .attr("class", "scatter-controls")
        .style("position", "absolute")
        .style("top", "-52px")
        .style("right", "0")
        .style("display", "flex")
        .style("gap", "8px")
        .style("z-index", "10");

    controls.append("button")
        .text("+")
        .attr("class", "zoom-in");

    controls.append("button")
        .text("-")
        .attr("class", "zoom-out");

    controls.append("button")
        .text("Reset")
        .attr("class", "zoom-reset");

    const svgHeight = height + margin.top + margin.bottom;

    const svg = wrapper
        .append("svg")
        .attr("width", "100%")
        .attr("height", svgHeight)
        .attr("viewBox", `0 0 ${containerWidth} ${svgHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const svgBackground = svg.append("rect")
        .attr("width", containerWidth)
        .attr("height", svgHeight)
        .attr("fill", "transparent");

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const scatterData = data.filter(d =>
        d.connected_handling_time != null &&
        d["CSAT Score"] != null &&
        d.connected_handling_time !== "" &&
        d["CSAT Score"] !== ""
    ).map(d => ({
        ...d,
        connected_handling_time: +d.connected_handling_time,
        "CSAT Score": +d["CSAT Score"]
    })).filter(d =>
        !isNaN(d.connected_handling_time) &&
        !isNaN(d["CSAT Score"])
    );

    if(scatterData.length === 0){

    const x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0.5, 5.5])
        .range([height, 0]);

    const xAxisGroup = g.append("g")
        .attr("transform", `translate(0,${height})`);

    const yAxisGroup = g.append("g");

    xAxisGroup.call(
        d3.axisBottom(x)
            .ticks(5)
    );

    yAxisGroup.call(
        d3.axisLeft(y)
            .tickValues([1,2,3,4,5])
    );

    g.append("text")
        .attr("x", width / 2)
        .attr("y", height + 42)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#C7D1E0")
        .text("Tiempo de atención conectado");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -36)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#C7D1E0")
        .text("CSAT Score");

    g.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#C7D1E0")
        .style("font-size", "15px")
        .style("font-weight", "500")
        .text("No hay datos de tiempo para esta selección");

        return;
    }

    const sortedTimes = scatterData
        .map(d => d.connected_handling_time)
        .sort(d3.ascending);

    const maxX = d3.quantile(sortedTimes, 0.95) || d3.max(sortedTimes) || 1;

    const x = d3.scaleLinear()
        .domain([0, maxX])
        .nice()
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0.5, 5.5])
        .range([height, 0]);

    const xAxisGroup = g.append("g")
        .attr("transform", `translate(0,${height})`);

    const yAxisGroup = g.append("g");

    xAxisGroup.call(
        d3.axisBottom(x)
            .ticks(6)
    );

    yAxisGroup.call(
        d3.axisLeft(y)
            .tickValues([1, 2, 3, 4, 5])
    );

    g.append("text")
        .attr("x", width / 2)
        .attr("y", height + 42)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#C7D1E0")
        .text("Tiempo de atención conectado");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -36)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#C7D1E0")
        .text("CSAT Score");

    const color = d3.scaleOrdinal()
        .domain([
            "Morning",
            "Afternoon",
            "Evening",
            "Night",
            "Split"
        ])
        .range([
            "#2D7EF7", // Morning - Azul
            "#4CAF50", // Afternoon - Verde
            "#F39C12", // Evening - Naranja
            "#E53935", // Night - Rojo
            "#FFFFFF"  // Split - Blanco
        ]);

    d3.select(".scatter-tooltip").remove();

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip scatter-tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none");

    const jitterX = () => (Math.random() - 0.5) * 10;
    const jitterY = () => (Math.random() - 0.5) * 18;

    const clipId = "scatter-clip";

    svg.append("defs")
        .append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    const pointsGroup = g.append("g")
        .attr("clip-path", `url(#${clipId})`);

    const points = pointsGroup.selectAll("circle")
        .data(scatterData)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.connected_handling_time) + jitterX())
        .attr("cy", d => y(d["CSAT Score"]) + jitterY())
        .attr("r", 3)
        .attr("fill", d => color(d["Agent Shift"]))
        .attr("opacity", 0.35)
        .on("mouseover", function(event, d){

            d3.select(this)
                .transition()
                .duration(150)
                .attr("r", 7)
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .attr("opacity", 1);

            tooltip
                .style("opacity", 1)
                .html(`
                    <b>${d.category}</b><br>
                    CSAT: ${d["CSAT Score"]}<br>
                    Tiempo: ${d.connected_handling_time} min<br>
                    Turno: ${d["Agent Shift"]}
                `);

        })
        .on("mousemove", function(event){

            tooltip
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 20) + "px");

        })
        .on("mouseout", function(){

            d3.select(this)
                .transition()
                .duration(150)
                .attr("r", 3)
                .attr("stroke", "none")
                .attr("opacity", 0.35);

            tooltip.style("opacity", 0);

        });

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    svgBackground
        .style("pointer-events", "all")
        .call(zoom);

    function zoomed(event){

        const newX = event.transform.rescaleX(x);

        xAxisGroup.call(
            d3.axisBottom(newX)
                .ticks(6)
        );

        points
            .attr("cx", d => newX(d.connected_handling_time) + jitterX())
            .attr("cy", d => y(d["CSAT Score"]) + jitterY());

    }

    wrapper.select(".zoom-in").on("click", function(){
        svg.transition()
            .duration(300)
            .call(zoom.scaleBy, 1.5);
    });

    wrapper.select(".zoom-out").on("click", function(){
        svg.transition()
            .duration(300)
            .call(zoom.scaleBy, 0.75);
    });

    wrapper.select(".zoom-reset").on("click", function(){
        svg.transition()
            .duration(300)
            .call(zoom.transform, d3.zoomIdentity);
    });

}