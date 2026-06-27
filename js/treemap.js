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

    const width = 900;
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
    .padding(3)
    (root);

    d3.treemap()
    .size([width, height])
    .padding(3)
    (root);

}