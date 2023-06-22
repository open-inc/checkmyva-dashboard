// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-checkmyva-wordcount",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  dataFetching: {
    history: true,
    historyRequired: true,
  },

  presets: [
    {
      label: "checkmyva:widget.count_table.word.title",
      description: "checkmyva:widget.count_table.word.description",
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
          type: "word",
        },
      },
    },
    {
      label: "checkmyva:widget.count_table.phrase.title",
      description: "checkmyva:widget.count_table.phrase.description",
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
          type: "phrase",
        },
      },
    },
  ],
});
