// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-checkmyva-category-timeseries",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  dataFetching: {
    history: true,
    historyRequired: true,
  },

  dataExplorer: {
    title: "checkmyva:widget.category_timeseries.title",
    description: "checkmyva:widget.category_timeseries.description",
    icon: "fa:chart-scatter",
    config: {},
  },

  presets: [
    {
      label: "checkmyva:widget.category_timeseries.title",
      description: "checkmyva:widget.category_timeseries.description",
      imageLink: "",
      tags: [],
      layout: [4, 4],
      widget: {
        config: {
          _history: {
            historyType: "relative",
            unit: "month",
            value: 12,
          },
        },
      },
    },
  ],
});
