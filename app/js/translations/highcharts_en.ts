export default {
  type_select: {
    title: "Type Settings",
    description: "Please select the type of visualisation",
  },
  explorer: {
    kpi: {
      title: "KPI",
      description: "...",
    },
    kpi_minmax: {
      title: "Progress",
      description: "...",
    },
    pattern: {
      title: "Timepattern",
      description: "...",
    },
    pattern_heatmap: {
      title: "Heatmap",
      description: "...",
    },
    pie: {
      title: "Compare",
      description: "...",
    },
    states: {
      title: "States",
      description: "...",
    },
    states_gantt: {
      title: "Gantt",
      description: "...",
    },
    timeseries: {
      title: "Timeseries",
      description: "...",
    },
    timeseries_compare: {
      title: "Timeseries Compare",
      description: "...",
    },
  },
  types: {
    line: "Line Chart",
    line_icon: "line-chart",

    spline: "Spline Chart",
    spline_icon: "line-chart",

    area: "Area Chart",
    area_icon: "area-chart",

    areaspline: "Area Spline Chart",
    areaspline_icon: "area-chart",

    scatter: "Scatter Chart",
    scatter_icon: "dot-chart",

    bar: "Bar Chart",
    bar_icon: "bar-chart",

    pie: "Pie Chart",
    pie_icon: "pie-chart",

    donut: "Donut Chart",
    donut_icon: "pie-chart",

    half_donut: "Half Donut Chart",
    half_donut_icon: "pie-chart",

    solidgauge: "Gauge Chart",
    solidgauge_icon: "dashboard",
  },
  name: {
    kpi: "KPI - {{name}}",
    kpi_minmax: "Progress - {{name}}",
    pattern: "Timepattern - {{name}}",
    pattern_heatmap: "Heatmap - {{name}}",
    pie: "Compare - {{name}}",
    states_count: "States by count - {{name}}",
    states_duration: "States by duration - {{name}}",
    states_gantt: "States - {{name}}",
    timeseries: "Timeseries - {{name}}",
    timeseries_compare: "Timeseries Compare - {{name}}",
  },
  common: {
    interaction_options: "interaction_options",
    interaction_options_description: "interaction_options_description",

    enable_legend: "Show chart legend",
    enable_tooltips: "Show tooltips on hover",
  },
  timeseries: {
    enable_zoom_x: "Enable X-axis zoom",
    enable_zoom_y: "Enable Y-axis zoom",
    enable_minimap: "Show a small overview over the chart",
    enable_minmax: "Show plot lines for min- and max- values",

    axis_options: "Axis options",
    axis_options_description: "Configurate how the axis will appear",
    yaxis_auto: "Create an Y-axis for each unit",
    xaxis_label: "X-axis label",
    yaxis_label: "Y-axis label",
  },
  kpi: {},
  compare: {
    unit: "Timerange",
    a: "Series A",
    b: "Series B",
  },
  states: {
    state: "State",
    count: "Count",
    percentage: "Percentage",
    duration: "Duration",
    unit: "Show: {{unit}}",
    current: "Current {{unit}}",
    next: "Next {{unit}}",
    prev: "Prev. {{unit}}",
    save: "Save time selection",
    unsaved: "Save time selection for later",

    settings: {
      header: "Settings",
      operation_label: "Select the type of measurement",
      operation_count: "Measurement: Count",
      operation_duration: "Measurement: Duration",
      roundto_label: "Group Numbers by steps of the given size:",
    },
  },
};
