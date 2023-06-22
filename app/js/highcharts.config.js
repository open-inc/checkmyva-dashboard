import Highcharts from "highcharts/highstock";

require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/sunburst")(Highcharts);
require("highcharts/modules/boost")(Highcharts);
require("highcharts/modules/heatmap")(Highcharts);
require("highcharts/modules/histogram-bellcurve")(Highcharts);
require("highcharts/modules/solid-gauge")(Highcharts);
require("highcharts/modules/sankey")(Highcharts);
require("highcharts/modules/gantt")(Highcharts);

window.Highcharts = Highcharts;

window.Highcharts.setOptions({
  boost: {
    useGPUTranslations: false,
    useAlpha: false,
    enabled: false,
  },

  global: {
    useUTC: false,
  },

  series: {
    turboThreshold: 100000,
  },
});
