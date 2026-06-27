function drawTreemap(data){

    d3.select(".treemap")
        .selectAll("*")
        .remove();

    const margin = {
        top:20,
        right:20,
        bottom:20,
        left:20
    };

    const containerWidth =
    document.querySelector(".treemap").clientWidth;

    const width = containerWidth;
    
    const height = 260;

    const svg = d3.select(".treemap")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const grouped = d3.rollups(

    data.filter(d => d.Product_category != null),

    v => v.length,

    d => d.Product_category

    );

    const hierarchy = {

    name:"root",

        children: grouped.map(d => ({

            name:d[0],

            value:d[1]

        }))

    };

    console.log(hierarchy);

    const root = d3.hierarchy(hierarchy)
    .sum(d => d.value);

    console.log(root);

    d3.treemap()
    .size([width, height])
    .padding(4)
    (root);

    console.log(root.leaves());

    const color = d3.scaleOrdinal()
    .domain(root.leaves().map(d => d.data.name))
    .range(d3.schemeTableau10);

    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")

        .attr("x", d => d.x0)
        .attr("y", d => d.y0)

        .attr("width", d => d.x1 - d.x0)

        .attr("height", d => d.y1 - d.y0)

        .attr("fill", d => color(d.data.name))

        .attr("stroke", "#071526")

        .attr("stroke-width", 2);

    svg.selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")

    .attr("x", d => d.x0 + 8)

    .attr("y", d => d.y0 + 18)

    .text(d => {

        const width = d.x1 - d.x0;

        if(width > 90){

            return d.data.name;

        }

        return "";

    })

    .attr("fill","white")

    .style("font-size","12px")

    .style("font-weight","600")

    .style("pointer-events","none");

}