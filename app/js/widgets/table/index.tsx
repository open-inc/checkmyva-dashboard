// @ts-check

import { createWidget } from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidget<ConfigInterface>({
  type: "opendash-widget-table",
  meta: {},
  displayComponent: () => import("./component"),
  settingsComponent: null,

  dataItems: {
    select: "item",
    min: 1,
    max: 1,
  },

  dataFetching: {
    live: true,
    history: true,
    historyRequired: true,
  },

  dataExplorer: {
    title: "table:explorer.item.title",
    description: "table:explorer.item.description",
    icon: "fa:table",
    config: {},
  },

  presets: [
    {
      label: "Table Widget",
      description: "...",
      imageLink: "",
      tags: [],
      layout: [4, 4],
      widget: {
        config: {},
      },
    },
  ],
});
