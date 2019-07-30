import React from 'react';
import PropTypes from 'prop-types';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js';
import moment from 'moment';
const Plot = createPlotlyComponent(Plotly);

function TimeProfile(props) {
  const { data } = props;
  const rows = [];
  const colors = [
    '#4D80CC',
    '#009900',
    '#FEBC4F',
    '#b32d00',
    '#996633',
    '#E6331A',
    '#FFFF99',
    '#1AB399',
    '#CC80CC',
    '#00B3E6',
    '#CC9999',
    '#E6B333',
    '#3366E6',
    '#0033CC',
    '#FEBC4F',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4DB3FF',
    '#FF6633',
    '#CCFF1A',
    '#FF1A66',
    '#E666FF',
    '#6680B3',
    '#E666B3',
    '#99FF99',
    '#B34D4D',
    '#809900',
    '#E6B3B3',
    '#66991A',
    '#FF99E6',
    '#33991A',
    '#999966',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#66664D',
    '#991AFF',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
  ];

  const formatHid = hid => hid.split('.')[hid.split('.').length - 1];

  const sortedData = data.map(line => {
    return {
      id: line.id,
      displayName: line.displayName,
      moduleName: line.moduleName,
      jobs: line.jobs.sort((a, b) =>
        moment(a.startTime) > moment(b.startTime) ? 1 : -1
      ),
    };
  });

  sortedData.forEach((line, i) => {
    rows.push({
      name: line.displayName,
      x: [line.jobs[0].startTime, line.jobs[line.jobs.length - 1].endTime],
      y: [formatHid(line.jobs[0].hid), formatHid(line.jobs[0].hid)],
      type: i === 0 ? 'line' : 'scatter',
      mode: 'lines+markers',
      marker: {
        color: colors[i],
      },
      line: {
        color: colors[i.length - i],
      },
      legendgroup: line.moduleName,
    });
    if (line.jobs.length > 1) {
      line.jobs.forEach(job => {
        const duration = moment
          .duration(moment(job.endTime).diff(moment(job.startTime)))
          .asSeconds();

        rows.push({
          name: formatHid(job.hid),
          duration: duration,
          x: [job.startTime, job.endTime],
          y: [formatHid(job.hid), formatHid(job.hid)],
          legendgroup: line.moduleName,
          type: 'scatter',
          mode: 'lines+markers',
          marker: {
            color: colors[i],
          },
          line: {
            color: colors[i.length - i],
          },
          showlegend: false,
          hoverinfo: 'name+duration',
        });
      });
    }
  });

  rows.sort((a, b) => (moment(a.x[0]) > moment(b.x[0]) ? 1 : -1));
  return (
    <Plot
      data={rows}
      layout={{
        width: 800,
        height: 600,
        title: 'Time Profiler',
        xaxis: {
          title: 'Execution Time',
          automargin: true,
          autorange: true,
        },
        yaxis: {
          title: 'HID 1.#',
          automargin: true,
          autorange: true,
        },
      }}
      config={{
        scrollZoom: true,
      }}
    />
  );
}

TimeProfile.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TimeProfile;
