// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-checkmyva-category-device-stats",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  dataFetching: {
    history: true,
    historyRequired: true,
  },

  dataExplorer: {
    title: "checkmyva:widget.category_device_stats.title",
    description: "checkmyva:widget.category_device_stats.description",
    icon: "fa:chart-scatter",
    config: {},
  },

  presets: [
    {
      label: "checkmyva:widget.category_device_stats.title",
      description: "checkmyva:widget.category_device_stats.description",
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
          invert: false,
        },
      },
    },
    {
      label: "checkmyva:widget.category_device_stats.title_inverted",
      description:
        "checkmyva:widget.category_device_stats.description_inverted",
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
          invert: true,
        },
      },
    },
  ],
});
