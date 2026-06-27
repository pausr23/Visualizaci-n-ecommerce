function drawTreemap(data){

    d3.select(".treemap")
        .selectAll("*")
        .remove();

    const containerWidth =
        document.querySelector(".treemap").clientWidth;

    const width = containerWidth;
    const height = 260;

    const svg = d3.select(".treemap")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Agrupar datos
    const grouped = d3.rollups(

        data.filter(d => d.Product_category != null),

        v => v.length,

        d => d.Product_category

    );

    const hierarchy = {

        name: "root",

        children: grouped.map(d => ({

            name: d[0],
            value: d[1]

        }))

    };

    const root = d3.hierarchy(hierarchy)
        .sum(d => d.value);

    d3.treemap()
        .size([width, height])
        .padding(4)
        (root);

    const color = d3.scaleOrdinal()
        .domain(root.leaves().map(d => d.data.name))
        .range(d3.schemeTableau10);

    // Tooltip

    d3.select(".treemap-tooltip").remove();

    const tooltip = d3.select("body")
        .append("div")
        .attr("class","tooltip treemap-tooltip")
        .style("opacity",0)
        .style("pointer-events","none");

    // Rectángulos

    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")

        .attr("x", d => d.x0)
        .attr("y", d => d.y0)

        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)

        .attr("fill", d => color(d.data.name))

        .attr("stroke","#071526")
        .attr("stroke-width",2)

        .on("mouseover", function(event,d){

            d3.select(this)
                .attr("stroke","white")
                .attr("stroke-width",3);

            tooltip
                .style("opacity",1)
                .html(`
                    <b>${d.data.name}</b><br>
                    Casos: ${d.value}
                `);

        })

        .on("mousemove", function(event){

            const tooltipWidth = tooltip.node().offsetWidth;

            tooltip
                .style("left", (event.pageX - tooltipWidth - 15) + "px")
                .style("top", (event.pageY - 20) + "px");

        })

        .on("mouseout", function(){

            d3.select(this)
                .attr("stroke","#071526")
                .attr("stroke-width",2);

            tooltip
                .style("opacity",0);

        });

    // Texto

    svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")

        .attr("x", d => d.x0 + 8)
        .attr("y", d => d.y0 + 18)

        .text(d => {

            const w = d.x1 - d.x0;
            const h = d.y1 - d.y0;

            if(w > 80 && h > 25){
                return d.data.name;
            }

            return "";

        })

        .attr("fill","white")
        .style("font-size","12px")
        .style("font-weight","600")
        .style("pointer-events","none");

}