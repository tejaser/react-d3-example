import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class Chart extends Component {
  state = {
    bars: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};
    const min = d3.min(data, d => d.date);
    const max = d3.max(data, d => d.date);
    const xScale = d3
      .scaleTime()
      .domain([min, max])
      .range([0, width]);

    //3. get min and max of the high temprature
    const [yMin, yMax] = d3.extent(data, d => d.high);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(yMin, 0), yMax])
      .range([height, 0]);
    // console.log(yExtent)
    // 4. Fill based on avg color
    const colorExtent = d3.extent(data, d => d.avg).reverse();
    // console.log(colorExtent)
    const colorScale = d3
      .scaleSequential()
      .domain(colorExtent)
      .interpolator(d3.interpolateRdYlBu);
    //5. return array of objects with x, y and height attribute
    const bars = data.map(d => {
      return {
        x: xScale(d.date),
        y: yScale(d.high),
        height: yScale(d.low) - yScale(d.high),
        fill: colorScale(d.avg)
      };
    });
    return { bars };
  }

  render() {
    // console.log(this.state.bars);
    return (
      <svg width={width} height={height}>
        {this.state.bars.map((d, i) => (
          <rect
            key={i}
            x={d.x}
            y={d.y}
            width={2}
            height={d.height}
            fill={d.fill}
          />
        ))}
      </svg>
    );
  }
}

export default Chart;
