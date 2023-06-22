// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-pattern-heatmap",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: () => import("./settings"),

  dataItems: {
    select: "item",
    min: 1,
    max: 1,
  },

  dataFetching: {
    history: true,
    historyRequired: true,
  },

  presets: [
    {
      label: "checkmyva:widget.heatmap.title",
      description: "checkmyva:widget.heatmap.description",
      imageLink: "",
      tags: [],
      widget: {
        config: {
          _history: {
            historyType: "relative",
            value: 2,
            unit: "week",
            aggregation: true,
            aggregationOperation: "mean",
          },
        },
      },
    },
  ],
});
