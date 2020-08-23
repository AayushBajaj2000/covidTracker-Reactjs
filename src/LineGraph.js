import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "./axios";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  responsive: true,
  maintainAspectRatio: true,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType = "cases") => {
  const chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        "/v3/covid-19/historical/all?lastdays=120"
      );
      const chartData = buildChartData(result.data, casesType);
      setData(chartData);
    };
    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      <br />
      <p>
        <strong>Worldwide new {casesType}</strong>
      </p>
      <br />
      <div>
        {data?.length > 0 && (
          <Line
            data={{
              datasets: [
                {
                  backgroundColor: "rgba(204,16,52, 0.3)",
                  borderColor: "#CC1034",
                  data: data,
                },
              ],
            }}
            options={options}
          />
        )}
      </div>
    </div>
  );
}

export default LineGraph;
