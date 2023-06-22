// @ts-check

import * as React from "react";
import Highcharts, { Options } from "highcharts";

import {
  createWidgetComponent,
  useTranslation,
  useOpenDashServices,
  usePromise,
  HighchartsChart,
  useDataItems,
} from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidgetComponent<ConfigInterface>(
  ({ config, ...context }) => {
    const t = useTranslation();

    const { DataService } = useOpenDashServices();

    const { height, width } = context.useContainerSize();

    const items = useDataItems();

    const [chartConfig, error, loading] = usePromise<Options>(async () => {
      const categoryItems = items.filter((item) => item.meta.checkmyvaCategory);

      const categoryValues = await DataService.fetchValuesMultiItem(
        categoryItems,
        config._history
      );

      const count: Record<string, Record<string, number>> = {};

      for (const [item, values] of categoryValues) {
        for (const value of values) {
          const category = item.name;
          const device = value.value[2] || "Gerät Unbekannt";

          const a = config.invert ? device : category;
          const b = config.invert ? category : device;

          if (!count[a]) {
            count[a] = {};
          }

          count[a][b] = (count[a][b] || 0) + 1;
        }
      }

      const data: {
        id: string;
        parent: string;
        name: string;
        value?: number;
      }[] = [
        {
          id: "root",
          parent: "",
          name: "",
          // value: 0,
        },
      ];

      for (const [outerKey, values] of Object.entries(count)) {
        let outerCount = 0;
        const children = [];

        for (const [innerKey, count] of Object.entries(values)) {
          outerCount += count;

          children.push({
            id: outerKey + "." + innerKey,
            parent: outerKey,
            name: innerKey,
            value: count,
          });
        }

        data.push({
          id: outerKey,
          parent: "root",
          name: outerKey,
          // value: outerCount,
        });

        data.push(...children);
      }

      return {
        chart: {
          // plotBackgroundColor: null,
          // plotBorderWidth: null,
          // plotShadow: false,
        },
        colors: ["transparent"].concat(Highcharts.getOptions().colors),
        title: {
          text: null,
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.y}</b>",
        },
        series: [
          {
            type: "sunburst",
            name: config.invert
              ? t("checkmyva:widget.category_device_stats.series_name_inverted")
              : t("checkmyva:widget.category_device_stats.series_name"),
            colorByPoint: true,
            data: data,
            cursor: "pointer",
            dataLabels: {
              format: "{point.name}",
              filter: {
                property: "innerArcLength",
                operator: ">",
                value: 16,
              },
              rotationMode: "circular",
            },
            levels: [
              {
                level: 1,
                levelIsConstant: false,
                dataLabels: {
                  filter: {
                    property: "outerArcLength",
                    operator: ">",
                    value: 64,
                  },
                },
              },
              {
                level: 2,
                colorByPoint: true,
              },
              {
                level: 3,
                colorVariation: {
                  key: "brightness",
                  to: -0.5,
                },
              },
              {
                level: 4,
                colorVariation: {
                  key: "brightness",
                  to: 0.5,
                },
              },
            ],
          },
        ],
      } as Options;
    }, []);

    context.setLoading(loading);
    context.setName(
      config.invert
        ? t("checkmyva:widget.category_device_stats.title_inverted")
        : t("checkmyva:widget.category_device_stats.title")
    );

    if (!chartConfig) {
      return null;
    }

    return (
      <HighchartsChart
        options={chartConfig}
        width={width}
        height={height}
        catchError={true}
      />
    );
  }
);
