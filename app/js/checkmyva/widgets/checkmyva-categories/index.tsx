// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-checkmyva-categories",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  presets: [
    {
      label: "checkmyva:widget.categories.title",
      description: "checkmyva:widget.categories.description",
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
