import * as Constants from '../api/Constants';

const DEFAULT_COLOR_PALETTE = [
  "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", 
  "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", 
  "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", 
  "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];

const VINTAGE_COLOR_PALETTE = ['#d87c7c','#919e8b', '#d7ab82', '#6e7074', 
  '#61a0a8','#efa18d', '#787464', '#cc7e63', '#724e58', '#4b565b'
];

const ROMA_COLOR_PALETTE = ['#E01F54','#001852','#f5e8c8','#b8d2c7','#c6b38e',
  '#a4d8c2','#f3d999','#d3758f','#dcc392','#2e4783',
  '#82b6e9','#ff6347','#a092f1','#0a915d','#eaf889',
  '#6699FF','#ff6666','#3cb371','#d5b158','#38b6b6'
];


const MACARONS_COLOR_PALETTE = [
  '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
  '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
  '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
  '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
];

const SHINE_COLOR_PALETTE = [
  '#c12e34','#e6b600','#0098d9','#2b821d',
  '#005eaa','#339ca8','#cda819','#32a487'
];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getColorPlatte = (name) => {
  if (name === Constants.VINTAGE) {
    return VINTAGE_COLOR_PALETTE;
  } else if (name === Constants.ROMA) {
    return ROMA_COLOR_PALETTE;
  } else if (name === Constants.MACARONS) {
    return MACARONS_COLOR_PALETTE;
  } else if (name === Constants.SHINE) {
    return SHINE_COLOR_PALETTE
  }
  return DEFAULT_COLOR_PALETTE;
}

export const getChartOption = (type, data, config, title) => {
  let chartOption = {};
  if (type === Constants.PIE) {
    chartOption = getPieOption(data, config);
  } else if (type === Constants.BAR) {
    chartOption = getBarOption(data, config, title);
  } else if (type === Constants.LINE) {
    chartOption = getLineOption(data, config, title);
  } else if (type === Constants.AREA) {
    chartOption = getAreaOption(data, config, title);
  } else if (type === Constants.HEATMAP) {
  } else if (type === Constants.TREEMAP) {
  }
  return chartOption;
}

/**
 * Pie chart
 */
const getPieOptionTemplate = (colorPlatte = 'default', legend, series) => {
  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      data: legend,
      right: 15,
      top: 10,
      bottom: 10
    },
    series: [
      {
        type:'pie',
        center: ['50%', '50%'],
        radius: '50%',
        data: series
      }
    ]
  }
};

const getPieOption = (data, config) => {
  const {
    key,
    value,
    colorPlatte
  } = config;
  let legend = [];
  let series = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    legend.push(row[key]);
    series.push({
      name: row[key],
      value: row[value]
    });  
  }
  return getPieOptionTemplate(colorPlatte, legend, series);
}

/**
 * Bar Chart
 */
const getBarOptionTemplate = (colorPlatte = 'default', legendData, axisData, series, isHorizontal) => {
  let xAxis = {};
  let yAxis = {};
  if (isHorizontal) {
    xAxis = {
      type: 'value'
    };
    yAxis = {
      type: 'category',
      data: axisData
    }
  } else {
    xAxis = {
      type: 'category',
      data: axisData
    };
    yAxis = {
      type: 'value'
    }
  }

  const legend = legendData !== null ? {
    data: legendData
  }: {};

  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    grid:{
      top: 30,
      bottom: 5,
      left: 10,
      right: 15,
      containLabel: true
    },
    legend: legend,
    xAxis: xAxis,
    yAxis: yAxis,
    series: series
  }
};

const getBarOption = (data, config, title) => {
  const {
    xAxis,
    legend,
    yAxis,
    hasMultiSeries = false,
    isStacked = true,
    isHorizontal = false,
    colorPlatte = 'default'
  } = config;

  const legendData = new Set();
  const xAxisData = hasMultiSeries ? new Set() : [];
  const seriesData = [];
  const type = 'bar';
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (hasMultiSeries) {
      const xAxisVal = row[xAxis];
      const legendVal = row[legend];
      const yAxisVal = row[yAxis];
      xAxisData.add(xAxisVal);
      legendData.add(legendVal);
      const index = seriesData.findIndex(s => s.name === legendVal);
      if (index === -1) {
        const series = {
          name: legendVal,
          type: type,
          data: [yAxisVal]
        };
        
        if (isStacked) {
          series.stack = title || 'Empty';
        } 
        seriesData.push(series);
      } else {
        seriesData[index].data.push(yAxisVal);
      }
    } else {
      xAxisData.push(row[xAxis]);
      seriesData.push(row[yAxis]);
    }
  }

  if (hasMultiSeries) {
    return getBarOptionTemplate(colorPlatte, Array.from(legendData), Array.from(xAxisData), seriesData, isHorizontal);
  } else {
    const series = {
      data: seriesData,
      type: type
    }
    return getBarOptionTemplate(colorPlatte, null, xAxisData, series, isHorizontal);
  }
}

/**
 * Line chart
 */
const getLineOptionTemplate = (colorPlatte = 'default', legendData, xAxisData, series) => {
  const legend = legendData !== null ? {
    data: legendData
  }: {};

  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    grid:{
      top: 30,
      bottom: 5,
      left: 10,
      right: 15,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData
    },
    yAxis: {
      type: 'value'
    },
    legend: legend,
    series: series
  }
};

const getLineOption = (data, config) => {
  const {
    xAxis,
    legend,
    yAxis,
    hasMultiSeries = false,
    isSmooth = false,
    colorPlatte = 'default'
  } = config;

  const legendData = new Set();
  const xAxisData = hasMultiSeries ? new Set() : [];
  const seriesData = [];
  const type = 'line';
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (hasMultiSeries) {
      const xAxisVal = row[xAxis];
      const legendVal = row[legend];
      const yAxisVal = row[yAxis];
      xAxisData.add(xAxisVal);
      legendData.add(legendVal);
      const index = seriesData.findIndex(s => s.name === legendVal);
      if (index === -1) {
        const series = {
          name: legendVal,
          type: type,
          data: [yAxisVal],
          smooth: isSmooth
        };
        seriesData.push(series);
      } else {
        seriesData[index].data.push(yAxisVal);
      }
    } else {
      xAxisData.push(row[xAxis]);
      seriesData.push(row[yAxis]);
    }
  }

  if (hasMultiSeries) {
    return getLineOptionTemplate(colorPlatte, Array.from(legendData), Array.from(xAxisData), seriesData);
  } else {
    const series = {
      data: seriesData,
      type: type,
      smooth: isSmooth
    }
    return getLineOptionTemplate(colorPlatte, null, xAxisData, series);
  }
}

/**
 * Area chart
 */
const getAreaOptionTemplate = (colorPlatte = 'default', legendData, xAxisData, series) => {
  const legend = legendData !== null ? {
    data: legendData
  }: {};
  return {
    color: getColorPlatte(colorPlatte),
    tooltip: {
    },
    grid:{
      top: 30,
      bottom: 5,
      left: 10,
      right: 15,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData
    },
    yAxis: {
      type: 'value'
    },
    legend: legend,
    series: series
  }
};

const getAreaOption = (data, config) => {
   const {
    xAxis,
    legend,
    yAxis,
    hasMultiSeries = false,
    isSmooth = false,
    colorPlatte = 'default'
  } = config;

  const legendData = new Set();
  const xAxisData = hasMultiSeries ? new Set() : [];
  const seriesData = [];
  const type = 'line';
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (hasMultiSeries) {
      const xAxisVal = row[xAxis];
      const legendVal = row[legend];
      const yAxisVal = row[yAxis];
      xAxisData.add(xAxisVal);
      legendData.add(legendVal);
      const index = seriesData.findIndex(s => s.name === legendVal);
      if (index === -1) {
        const series = {
          name: legendVal,
          type: type,
          data: [yAxisVal],
          areaStyle: {},
          smooth: isSmooth
        };
        seriesData.push(series);
      } else {
        seriesData[index].data.push(yAxisVal);
      }
    } else {
      xAxisData.push(row[xAxis]);
      seriesData.push(row[yAxis]);
    }
  }

  if (hasMultiSeries) {
    return getAreaOptionTemplate(colorPlatte, Array.from(legendData), Array.from(xAxisData), seriesData);
  } else {
    const series = {
      data: seriesData,
      type: type,
      areaStyle: {},
      smooth: isSmooth
    }
    return getAreaOptionTemplate(colorPlatte, null, xAxisData, series);
  }
}

/**
 * TODO: Heatmap chart
 */
const getHeatmapOptionTemplate = (min, max, xAxisData, yAxisData, seriesData) => {
  return {
    color: DEFAULT_COLOR_PALETTE,
    animation: false,
    grid: {
      y: 10
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      splitArea: {
          show: true
      }
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: min,
      max: max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      itemWidth: 12,
      bottom: 5,
      inRange: {
        // color: ['#121122', 'rgba(3,4,5,0.4)', 'red']
        color: ['#FFFFFF', '#000000']
      }
    },
    series: [{
      type: 'heatmap',
      data: seriesData,
      label: {
        normal: {
          show: true,
          color: '#FFFFFF'
        }
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
};

const buildHeatmapOption = () => {
  const xAxisData = [];
  const yAxisData = [];
  const seriesData = [];
  const row = 5;
  const column = 10;
  for (let i = 0; i < row; i++) {
    xAxisData.push('x' + i);
  }
  for (let j = 0; j < column; j++) {
    yAxisData.push('y' + j);
  }

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      const value = getRandomInt(1, 10);
      seriesData.push([i, j, value]);
    }
  }
  return getHeatmapOptionTemplate(1, 10, xAxisData, yAxisData, seriesData);
}

const getTreemapOptionTemplate = (seriesData) => {
  return {
    series: [{
      name: 'ALL',
      type: 'treemap',
      data: seriesData,
      levels: [
        {
          itemStyle: {
            normal: {
              borderColor: '#f9f9f9',
              borderWidth: 2,
              gapWidth: 2
            }
          }
        }
      ]
    }]
  }
}

const getCalendarHeatmapOptionTemplate = (min, max, seriesData) => {
  return {
    visualMap: {
      show: false,
      min: 1,
      max: 10
    },
    calendar: {
      range: '2017'
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtulData(2017)
    }
  }
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function getVirtulData(year) {
    year = year || '2017';
    var date = + new Date(year + '-01-01');
    var end = + new Date(year + '-12-31');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (let time = date; time <= end; time += dayTime) {
      const value = getRandomInt(1, 10);
      data.push([
        formatDate(new Date(time)),
        value
      ]);
    }
    
    return data;
}

const buildTreemapOption = () => {
  const seriesData = [];
  for (let i = 1; i <= 10; i++) {
    const name = 'a' + i;
    const value = getRandomInt(1, 10);
    seriesData.push({
      name: name,
      value: value
    });
  }
  return getTreemapOptionTemplate(seriesData);
}

const buildTimeLineOption = () => {
  const seriesData = [];
  for (let i = 1; i <= 10; i++) {
    const name = 'a' + i;
    const epoch = + new Date();
    const date = new Date(epoch);
    const value = getRandomInt(1, 10);
    seriesData.push({
      name: name,
      value: [
        [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/'), 
        value
      ]
    });
  }

  return getTimeLineOptionTemplate(seriesData);
}

const buildCalenarHeatmapOption = () => {
  return getCalendarHeatmapOptionTemplate();
}



/**
 * TODO: Time line chart
 */
const getTimeLineOptionTemplate = (seriesData) => {
  return {
    color: DEFAULT_COLOR_PALETTE,
    tooltip: {
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value, index) => {
          const date = new Date(value);
          return [date.getMonth() + 1, date.getDate()].join('-');
        }
      },
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'line',
        data: seriesData
      }
    ]
  }
};
