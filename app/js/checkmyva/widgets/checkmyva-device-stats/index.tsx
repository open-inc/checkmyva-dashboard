// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-checkmyva-device-stats",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  dataFetching: {
    history: true,
    historyRequired: true,
  },

  dataExplorer: {
    title: "checkmyva:widget.device_stats.title",
    description: "checkmyva:widget.device_stats.description",
    icon: "fa:chart-scatter",
    config: {},
  },

  presets: [
    {
      label: "checkmyva:widget.device_stats.title",
      description: "checkmyva:widget.device_stats.description",
      imageLink: "",
      tags: [],
      layout: [4, 4],
      widget: {
        config: {
          _history: {
            historyType: "relative",
            unit: "year",
            value: 1,
          },
        },
      },
    },
  ],
});
