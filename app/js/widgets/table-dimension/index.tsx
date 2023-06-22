// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-table-dimension",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  dataItems: {
    select: "dimension",
    min: 1,
    max: 1,
    types: ["Number", "Boolean", "String"],
  },

  dataFetching: {
    live: true,
    history: true,
    historyRequired: true,
  },

  dataExplorer: {
    title: "table:explorer.dimension.title",
    description: "table:explorer.dimension.description",
    icon: "fa:table",
    config: {},
  },

  presets: [
    {
      label: "Lastspitzen-Tabelle / Peak-Load Table",
      description:
        "Übersicht über die Lastspitzen (höchsten 10%) / Overview of the load peaks (highest 10%)",
      imageLink: "",
      tags: [],
      layout: [4, 4],
      widget: {
        config: {
          percentile: 0.9,
        },
      },
    },
  ],
});
