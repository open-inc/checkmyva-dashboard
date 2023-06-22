// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-checkmyva-timeseries",
  meta: {},
  displayComponent: () => import("./component"),
  // settingsComponent: () => import("./settings"),
  settingsComponent: null,

  // dataItems: {
  //   select: "dimension",
  //   min: 1,
  //   max: 3,
  //   types: ["Boolean"],
  // },

  dataFetching: {
    history: true,
    historyRequired: true,
  },

  dataExplorer: {
    title: "checkmyva:widget.timeseries.title",
    description: "checkmyva:widget.timeseries.description",
    icon: "fa:chart-scatter",
    config: {},
  },

  presets: [
    {
      label: "checkmyva:widget.timeseries.title",
      description: "checkmyva:widget.timeseries.description",
      imageLink: "",
      tags: [],
      layout: [4, 4],
      widget: {
        config: {},
      },
    },
  ],
});
