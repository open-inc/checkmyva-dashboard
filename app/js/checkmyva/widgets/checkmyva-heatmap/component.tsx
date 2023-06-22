// @ts-check

import * as React from "react";
import moment from "moment";

import {
  createWidgetComponent,
  HighchartsChart,
  stringToColor,
  useTranslation,
  useOpenDashServices,
} from "@opendash/core";

import { ConfigInterface } from "./types";
import Highcharts from "highcharts";

import { getCurrentLanguageSync } from "@opendash/i18n";

export default createWidgetComponent<ConfigInterface>(
  ({ config, ...context }) => {
    const t = useTranslation();

    const { DataService } = useOpenDashServices();
    const { width, height } = context.useContainerSize();

    context.setLoading(false);
    context.setName(
      t("checkmyva:widget.heatmap.title_name", {
        name: context
          .useItemConfig()
          .map((item) => DataService.getItemName(item))
          .join(", "),
      })
    );

    const chartConfig: Highcharts.Options = context.useFetchValues(
      {},
      ([[item, values]]) => {
        const xUnitCount = 24;
        const xLabels = new Array(xUnitCount)
          .fill(null)
          .map((v, i) => "" + i + "-" + (i + 1));

        const yUnitCount = 7;
        const yLabels = new Array(yUnitCount).fill(null).map((v, i) =>
          new Intl.DateTimeFormat(getCurrentLanguageSync(), {
            weekday: "long",
          }).format(new Date(Date.UTC(2021, 5, i)))
        );

        // Count Aggregation

        const count = [];

        for (let x = 0; x < xUnitCount; x++) {
          count[x] = [];

          for (let y = 0; y < yUnitCount; y++) {
            count[x][y] = 0;
          }
        }

        for (const value of values) {
          const date = moment(value.date);

          const weekday = date.get("weekday");
          const hour = date.get("hour");

          count[hour][weekday] += 1;
        }

        const data: [number, number, number][] = [];

        for (let x = 0; x < xUnitCount; x++) {
          for (let y = 0; y < yUnitCount; y++) {
            data.push([x, y, count[x][y]]);
          }
        }

        // Calculate Min and Max values for color scaling
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;

        for (const [x, y, value] of data) {
          if (value < min) {
            min = value;
          }

          if (value > max) {
            max = value;
          }
        }

        // Return Highcharts.Options

        const highchartsOptions: Highcharts.Options = {
          chart: {
            type: "heatmap",
          },

          title: null,

          xAxis: {
            categories: xLabels,
          },

          yAxis: {
            categories: yLabels,
            title: null,
            reversed: true,
          },

          colorAxis: {
            min: min,
            minColor: "#FFFFFF",
            maxColor: DataService.getItemColor(item),
          },

          legend: {
            align: "right",
            layout: "vertical",
            margin: 0,
            verticalAlign: "top",
            y: 25,
            symbolHeight: 280,
          },

          series: [
            {
              type: "heatmap",
              name: `${item.name}`,
              data,
            },
          ],
        };

        return highchartsOptions;
      }
    );

    React.useEffect(() => {
      context.setLoading(!chartConfig);
    }, [chartConfig]);

    return (
      <HighchartsChart options={chartConfig} width={width} height={height} />
    );
  }
);

function round(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
