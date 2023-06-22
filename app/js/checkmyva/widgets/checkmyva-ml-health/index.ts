// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-ml-health",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  presets: [
    {
      label: "checkmyva:widget.ml_health.title",
      description: "checkmyva:widget.ml_health.description",
      imageLink: "",
      tags: [],
      layout: [4, 4],
      widget: {
        config: {},
      },
    },
  ],
});
