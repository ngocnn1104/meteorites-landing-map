const tooltip = d3.select("#tooltip");

const projection = d3.geoMercator();

const zoom = d3.zoom()
  .scaleExtent([1,10])
  .on("zoom", zoomed);

const svg = d3.select("#map").append("svg")
  .attr("width", 950)
  .attr("height", 600)
  .call(zoom);

function zoomed() {
  svg.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
}

const path = d3.geoPath()
  .projection(projection);

d3.json("https://d3js.org/world-50m.v1.json", function(json) {
  let g = svg.append("g");
  g.selectAll("path")
    .data(topojson.object(json, json.objects.countries).geometries)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "rgba(255,255,255,0.5)");

    d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json", function(response) {
      const list = response.features.sort((a, b) => b.properties.mass - a.properties.mass);

      for (let i in list) {
        let circle = svg.append("circle")
          .attr("r", function() {
            let mass = list[i].properties.mass;
            if (mass < 2000) {
              return 1;
            } else if (mass < 5000) {
              return 2;
            } else if (mass < 10000) {
              return 3;
            } else if (mass < 50000) {
              return 5;
            } else if (mass < 100000) {
              return 10;
            } else if (mass < 500000) {
              return 17;
            } else if (mass < 1000000) {
              return 25;
            } else if (mass < 1500000) {
              return 30;
            } else if (mass < 2000000) {
              return 50;
            } else {
              return 70;
            }
          })
          .attr("cx", projection([list[i].properties.reclong, list[i].properties.reclat])[0])
          .attr("cy", projection([list[i].properties.reclong, list[i].properties.reclat])[1])
          .attr("stroke", "rgba(255,255,255,0.7)")
          .attr("fill", function() {
            let mass = list[i].properties.mass;
            if (mass < 2000) {
              return "navy";
            } else if (mass < 3000) {
              return "LightSeaGreen";
            } else if (mass < 4000) {
              return "purple";
            } else if (mass < 5000) {
              return "sienna";
            } else if (mass < 100000) {
              return "teal";
            } else if (mass < 500000) {
              return "Salmon";
            } else if (mass < 1000000) {
              return "LimeGreen";
            } else if (mass < 1500000) {
              return "Gold";
            } else if (mass < 2000000) {
              return "DarkOrange";
            } else {
              return "crimson";
            }
          })
          .attr("fill-opacity", 0.7)
          .on("mouseover", function() {
            tooltip.transition()
              .duration(0)
              .style("opacity", 1);
            tooltip .html("<p><strong>Name</strong>: " + list[i].properties.name + "</p>" +
                          "<p><strong>Year</strong>: " + list[i].properties.year.slice(0,4) + "</p>" +
                          "<p><strong>Mass</strong>: " + list[i].properties.mass + "</p>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 30) + "px");
          })
          .on("mouseout", function() {
            tooltip.transition()
              .duration(0)
              .style("opacity", 0)
          });
      }
    });
});
