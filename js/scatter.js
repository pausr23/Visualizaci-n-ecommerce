function drawScatter(data){

    d3.select(".scatter")
        .selectAll("*")
        .remove();

    const margin = {
        top: 20,
        right: 20,
        bottom: 50,
        left: 60
    };

    const width = 520;
    const height = 320;

    const svg = d3.select(".scatter")
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

    console.log(svg);

    const scatterData = data.filter(d =>

    d.connected_handling_time != null &&
    d["CSAT Score"] != null

);

console.log(scatterData);

//Ejes

const x = d3.scaleLinear()

    .domain(d3.extent(
        scatterData,
        d => d.connected_handling_time
    ))

    .range([0, width]);

const y = d3.scaleLinear()

    .domain([0, 5])

    .range([height, 0]);

    svg.append("g")

    .attr("transform", `translate(0,${height})`)

    .call(d3.axisBottom(x));

    svg.append("g")
    .call(
        d3.axisLeft(y)
            .tickValues([0,1,2,3,4,5]) 
            //Si quieres agregar medio punto 
            // en el eje pon ejemplo: 0.5
    );

//Dibujar puntos

console.log(
    d3.extent(
        scatterData,
        d => d.connected_handling_time
    )
);

const color = d3.scaleOrdinal()
    .domain([...new Set(scatterData.map(d => d.category))])
    .range(d3.schemeTableau10);

//Tooltip

d3.select(".tooltip").remove();

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("pointer-events", "none");

svg.selectAll("circle")
    .data(scatterData)
    .enter()
    .append("circle")

    .attr("cx", d => x(d.connected_handling_time))
    .attr("cy", d => y(d["CSAT Score"]))

    .attr("r", 4)

    .attr("fill", d => color(d.category))

    .attr("opacity", 0.75)

//Eventos

.on("mouseover", function(event, d){

    d3.select(this)
        .transition()
        .duration(150)
        .attr("r",7)
        .attr("stroke","white")
        .attr("stroke-width",2);

    tooltip
        .style("opacity",1)
        .html(`
            <b>${d.category}</b><br>
            CSAT: ${d["CSAT Score"]}<br>
            Tiempo: ${d.connected_handling_time} min<br>
            Turno: ${d["Agent Shift"]}
        `);

})

.on("mousemove", function(event){

    tooltip
        .style("left",(event.pageX+15)+"px")
        .style("top",(event.pageY-20)+"px");

})

.on("mouseout", function(){

    d3.select(this)
        .transition()
        .duration(150)
        .attr("r",4)
        .attr("stroke","none");

    tooltip.style("opacity",0);

});

    
}