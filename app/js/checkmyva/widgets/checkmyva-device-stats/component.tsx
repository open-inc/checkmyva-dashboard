// @ts-check

import * as React from "react";
import { Options } from "highcharts";

import {
  createWidgetComponent,
  useTranslation,
  useOpenDashServices,
  usePromise,
  HighchartsChart,
  DataItemInterface,
  useDataItems,
} from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidgetComponent<ConfigInterface>(
  ({ config, ...context }) => {
    const t = useTranslation();

    const { DataService } = useOpenDashServices();

    const { height, width } = context.useContainerSize();

    const [chartConfig, error, loading] = usePromise<Options>(async () => {
      const items: [DataItemInterface, number][] = [
        [await DataService.get("checkmyva", "checkmyva.alexa.takeout"), 2],
        [await DataService.get("checkmyva", "checkmyva.google.takeout"), 2],
      ];

      const history = await DataService.fetchDimensionValuesMultiItem(
        items,
        config._history
      );

      const devices: Record<string, number> = {};

      for (const [item, dimension, values] of history) {
        for (const value of values) {
          const device = value.value || "Gerät Unbekannt";

          devices[device] = (devices[device] || 0) + 1;
        }
      }

      const devicesCount = Object.entries(devices)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      return {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
        },
        title: {
          text: null,
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.y}</b>",
        },
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
          },
        },
        series: [
          {
            name: t("checkmyva:widget.device_stats.series_name"),
            colorByPoint: true,
            data: devicesCount.map((device) => ({
              name: device.name,
              y: device.count,
            })),
          },
        ],
      } as Options;
    }, []);

    context.setLoading(loading);
    context.setName(t("checkmyva:widget.device_stats.title"));

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
