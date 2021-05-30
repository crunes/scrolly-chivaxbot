const container = d3.select('#scrolly-overlay');
const stepSel = container.selectAll('.step');

function updateChart(index) {
    console.log("Updating with", index);
    const sel = container.select(`[data-index='${index}']`);
    stepSel.classed('is-active', (d, i) => i === index);

    if (index == "0") {
      container.select('#citywide').style("stroke-opacity", 1);
      container.select('#averages').style("stroke-opacity", 0);
      container.select("#cityLabel").style("opacity", 1);
      container.select("#pcpAvgLabel").style("opacity", 0);
      container.select('#zips').style("stroke-opacity", 0);
      container.select("#loopLabel").style("opacity", 0);
      container.select("#belmontCraginLabel").style("opacity", 0);
      container.select('#pcpZipLines').style("stroke-opacity", 0);

    } else if (index == "1") {
      container.select('#citywide').style("stroke-opacity", 1);
      container.select('#averages').style("stroke-opacity", 1);
      container.select("#cityLabel").style("opacity", 1);
      container.select("#pcpAvgLabel").style("opacity", 1);
      container.select('#zips').style("stroke-opacity", 0);
      container.select("#loopLabel").style("opacity", 0);
      container.select("#belmontCraginLabel").style("opacity", 0);
      container.select('#pcpZipLines').style("stroke-opacity", 0);

    } else if (index == "2") {
      container.select('#citywide').style("stroke-opacity", 0);
      container.select('#averages').style("stroke-opacity", 0);
      container.select("#cityLabel").style("opacity", 0);
      container.select("#pcpAvgLabel").style("opacity", 0);
      container.select('#zips').style("stroke-opacity", 0.5);
      container.select("#loopLabel").style("opacity", 1);
      container.select("#belmontCraginLabel").style("opacity", 1);
      container.select('#pcpZipLines').style("stroke-opacity", 0);

    } else {
      container.select('#citywide').style("stroke-opacity", 0);
      container.select('#averages').style("stroke-opacity", 0);
      container.select("#cityLabel").style("opacity", 0);
      container.select("#pcpAvgLabel").style("opacity", 0);
      container.select('#zips').style("stroke-opacity", 0);
      container.select("#loopLabel").style("opacity", 0);
      container.select("#belmontCraginLabel").style("opacity", 0);
      container.select('#pcpZipLines').style("stroke-opacity", 0.5);
    }
}

function init() {
    enterView({
        selector: stepSel.nodes(),
        offset: 0.5,
        enter: el => {
            console.log(el, "entering view...")
            const index = +d3.select(el).attr('data-index');
            updateChart(index);
        },
        exit: el => {
            let index = +d3.select(el).attr('data-index');
            index = Math.max(0, index - 1);
            updateChart(index);
        }
    });
}

init();

let width = 800;
let height = 500;
let margin = { top: 30, right: 10, bottom: 10, left: 30 };
let svg = d3.select("body").select("#line-chart")

// const API_LINK = "https://data.cityofchicago.org/resource/553k-3xzc.json?$limit=10000"
// const PCP_LINK = "https://data.cityofchicago.org/resource/2ns9-phjk.json?ccvi_category=HIGH"

d3.csv('data/vax_rates.csv')
  .then(function (data) {

    console.log(data)

    data.forEach(row => {
      row.date = new Date(row.date)
      row.fully_vax = +row.vaccine_series_completed_percent_population
    });

    data.sort(function(a, b) {
      return d3.ascending(a.date, b.date)
    })

    let x = d3.scaleTime()
        .domain(d3.extent(data.map(function (d) { return d.date }))) //d3 extent
        .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
        .domain(d3.extent(data.map(function (d) { return d.fully_vax })))
        .range([height - margin.bottom, margin.top])

    let yAxisSettings = d3.axisLeft(y)
        .ticks(10)
        .tickSize(-width)
        .tickFormat(d3.format(".0%"))
        .tickPadding(10)

    let xAxisSettings = d3.axisBottom(x)
        .ticks(6)
        .tickSize(10)
        .tickPadding(10)
        .tickFormat(d3.timeFormat("%B"))

    let bg = svg.append("rect")
        .attr("x", margin.left)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .style("fill", "rgba(0, 0, 0, 0)")

    let xAxisTicks = svg.append("g")
        .attr("class", "x axis")
        .call(xAxisSettings)
        .attr("transform", `translate(0,${height - margin.bottom})`)

    let yAxisTicks = svg.append("g")
        .attr("class", "y axis")
        .call(yAxisSettings)
        .attr("transform", `translate(${margin.left},0)`)

    let line = d3.line()
          .defined(d => !isNaN(d.fully_vax))
          .x(d => x(d.date) )
          .y(d => y(d.fully_vax) )
          .curve(d3.curveMonotoneX)

    let grouped_data = d3.group(data, d => d.zip_code)
    console.log(grouped_data)

    let avgGeographies = ["Citywide", "Protect Chicago Plus"]
    let pcpZipCodes = [
      "60636",
      "60623",
      "66029",
      "60621",
      "60644",
      "60651",
      "60632",
      "60609",
      "60707",
      "60639",
      "60624",
      "60628",
      "60620",
      "60617"
    ]

    let citywide = d3.filter(grouped_data, d => d[0] == "Citywide")
    let averages = d3.filter(grouped_data, d => avgGeographies.includes(d[0]))
    let zipOnly = d3.group(
                    data
                      .filter(function (d) {
                        return (!avgGeographies.includes(d.zip_code) && d.zip_code != "Non-Protect Chicago Plus")
                      }),
                    d => d.zip_code)
    console.log(zipOnly)

    // let timeParser = d3.timeParse("%d-%m-%Y");

    let city = svg.append("g")
      .attr("id", "citywide")
      .selectAll(".line")
      .data(citywide)
      .join("path")
      .attr("class", d => "line " +  d[0])
      .attr("d", d => line(d[1]))
      .style("fill", "none")
      .style("stroke", "#4d9221")
      .style("stroke-width", "1px")

    let cityLabel = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("id", "cityLabel")
      .attr("x", 745)
      .attr("y", 275)
      .style("fill", "#4d9221")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Citywide average")

    let pcpAvgLabel = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("id", "pcpAvgLabel")
      .attr("x", 700)
      .attr("y", 410)
      .style("fill", "#c51b7d")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Protect Chicago Plus average")

    let avgLines = svg.append("g")
      .attr("id", "averages")
      .selectAll(".line")
      .data(averages)
      .join("path")
      .attr("class", d => "line " + d[0])
      .attr("d", d => line(d[1]))
      .style("fill", "none")
      .style("stroke", function(d) {
        if (d[0] == "Citywide") {
          return "#4d9221"
        } else if (d[0] == "Protect Chicago Plus") {
          return "#c51b7d"
        }
      })
      .style("stroke-width", "1px")

    let zips = svg.append("g")
      .attr("id", "zips")
      .selectAll("path")
      .data(grouped_data)
      .join("path")
      .attr("class", d => "line " + d[0])
      .attr("d", d => line(d[1]))
      .style("fill", "none")
      .style("stroke", function(d) {
        if (d[0] == "60603") {
          return "#4d9221"
        } else if (d[0] == "60624") {
          return "#c51b7d"
        } else {
          return "#ccc"
        }
      })
      .style("stroke-width", function(d) {
        if (d[0] == "60603" | d[0] == "60624") {
          return "2px"
        } else {
          return "1px"
        }
      })

    let loopLabel = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("id", "loopLabel")
      .attr("x", 750)
      .attr("y", 20)
      .style("fill", "#4d9221")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("60603 (Loop)")

    let belmontCraginLabel = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("id", "belmontCraginLabel")
      .attr("x", 720)
      .attr("y", 425)
      .style("fill", "#c51b7d")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("60624 (Belmont-Cragin)")

    let pcpZipLines = svg.append("g")
      .attr("id", "pcpZipLines")
      .selectAll(".line")
      .data(grouped_data)
      .join("path")
      .attr("class", d => "line " + d[0])
      .attr("d", d => line(d[1]))
      .style("fill", "none")
      .style("stroke", function(d) {
        if (pcpZipCodes.includes(d[0])) {
          return "#c51b7d"
        } else {
          return "#ccc"
        }
      })
      .style("stroke-width", function(d) {
        if (pcpZipCodes.includes(d[0])) {
          return "2px"
        } else {
          return "1px"
        }
      })


    let baseline = svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width + margin.left)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .style("stroke", "#333")
      .style("stroke-width", "2px")


  })
