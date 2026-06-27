function drawHeatmap(data){

    // Limpiar gráfico anterior
    d3.select(".heatmap")
        .selectAll("*")
        .remove();

    // Agrupar datos

    const heatmapData = d3.rollup(

        data,

        values => d3.mean(
            values,
            d => d["CSAT Score"]
        ),

        d => d.category,

        d => d["Agent Shift"]

    );

    // Convertir a arreglo
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

    console.log(formattedData);

    // Tamaños

    const margin = {

        top:20,
        right:20,
        bottom:60,
        left:170

    };

    const containerWidth =
    document.querySelector(".heatmap").clientWidth;

    const width = containerWidth - margin.left - margin.right;

    const height = 320;

    // SVG

    const svg = d3.select(".heatmap")

        .append("svg")

        .attr(
            "width",
            width + margin.left + margin.right
        )

        .attr(
            "height",
            height + margin.top + margin.bottom
        )

        .append("g")

        .attr(
            "transform",
            `translate(${margin.left},${margin.top})`
        );

    // Categorías

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

    // Escalas

    const x = d3.scaleBand()

        .domain(shifts)

        .range([0,width])

        .padding(0.05);

    const y = d3.scaleBand()

        .domain(categories)

        .range([0,height])

        .padding(0.05);

    // Colores

    const color = d3.scaleSequential()

        .domain([

            d3.min(formattedData,d=>d.csat),

            d3.max(formattedData,d=>d.csat)

        ])

        .interpolator(d3.interpolateRdYlGn);

    // Ejes
    
    svg.append("g")

        .attr("transform", `translate(0,${height + 5})`)

        .call(d3.axisBottom(x));

    svg.selectAll(".tick text")
        .style("font-size", "12px");

    svg.append("g")

        .call(d3.axisLeft(y));

    svg.selectAll("text")

        .attr("fill","white")

        .style("font-size","12px");

    // Cuadros del heatmap

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