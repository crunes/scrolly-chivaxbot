console.log({ d3 })
console.log({ topojson })

Promise.all([
    d3.json('../data/vaccinations_20210515.json'),
])
    .then(ready)
    .catch((err) => {
        console.log(err);
    });

function ready(res) {
    console.log(res[0])
    let raw = res[0]

    let zip = topojson.feature(raw, raw.objects["Boundaries - ZIP Codes"]);

    let width = 960;
    let height = 1000;

    console.log(zip)

    let svg = d3.select("body").select("#mapMay")

    //source: https://observablehq.com/@michaeltranxd/choropleth-map-of-chicago
    let chiProjection = d3.geoMercator()
      .fitSize([width, height], zip)
      // .scale(width * 90)
      // .center([-87.6298, 41.8781])
      // .translate([width / 2, height / 2])

    // let colorScheme = d3.schemeBlues[10];
    // let colorScale = d3.scaleThreshold()
    //   .domain([10, 20, 30, 40, 50, 60, 70, 80, 90])
    //   .range(colorScheme);

    // svg.append("g")
    //   .attr("class", "legendThreshold")
    //   .attr("transform", "translate(" + width * .65 + "," + height / 2 + ")");
    //   g.append("text")
    //   .attr("class", "caption")
    //   .attr("x", 0)
    //   .attr("y", -6)
    //   .text("Percent population with complete vaccine series");
    //
    // // Add labels for legend
    // let labels = ['10% or less', '11—20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', 'Over 90%'];
    //
    // // Create the legend based on colorScale and our labels
    // var legend = d3.legendColor()
    // .labels(function (d) { return labels[d.i]; })
    // .shapePadding(4)
    // .scale(colorScale);
    // svg.select(".legendThreshold")
    //   .call(legend);
    //
    //   svg.selectAll("path")
    //   .data(zip.features)
    //   .enter()
    //   .append("path")
    //   .attr("fill", function(d, i){
    //   return colorScale(d.properties['Vaccine Series Completed - Percent Population']);
    // })
    //   .attr("d", d3.geoPath(projection))

    //path function
    let path = d3.geoPath()
      .projection(chiProjection)

    svg
      .selectAll(".zips")
      .data(zip.features)
      .join("path")
      .attr("d", path)
      .attr("class", d => d.properties.zip)
      // .attr("fill", d => colorScale(d.properties['Vaccine Series Completed - Percent Population']);
      // })
      .style("fill", "#eee")
      .style("stroke", "#ffffff")
      .style("stroke-width", .2)
  }
