// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-ml-sentiment",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  presets: [
    {
      label: "checkmyva:widget.ml_sentiment.title",
      description: "checkmyva:widget.ml_sentiment.description",
      imageLink: "",
      tags: [],
      layout: [4, 4],
      widget: {
        config: {},
      },
    },
  ],
});
