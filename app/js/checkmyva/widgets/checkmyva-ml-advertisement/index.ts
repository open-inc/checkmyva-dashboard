// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-ml-advertisement",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  presets: [
    {
      label: "checkmyva:widget.ml_advertisement.title",
      description: "checkmyva:widget.ml_advertisement.description",
      imageLink: "",
      tags: [],
      layout: [4, 4],
      widget: {
        config: {},
      },
    },
  ],
});
