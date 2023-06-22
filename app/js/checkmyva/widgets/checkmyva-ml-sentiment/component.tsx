// @ts-check

import * as React from "react";

import { Options } from "highcharts";
import { $ml } from "../../states";

import {
  createWidgetComponent,
  HighchartsChart,
  useDataItems,
  usePromise,
  useTranslation,
} from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidgetComponent<ConfigInterface>(
  ({ config, context: ctx, ...context }) => {
    const t = useTranslation();

    const { width, height } = context.useContainerSize();

    const [chartConfig, error, loading] = usePromise(async () => {
      const highchartsOptions: Options = {
        title: null,
        subtitle: null,
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
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
              enabled: true,
              format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            },
          },
        },
        series: [
          {
            name: "Brands",
            type: "pie",
            colorByPoint: true,
            data: Object.entries($ml.sentiment).map(([key, value]) => ({
              name: t("checkmyva:widget.ml_sentiment.label", { context: key }),
              y: value,
            })),
          },
        ],
      };

      return highchartsOptions;
    }, []);

    context.setLoading(!chartConfig);
    context.setName(t("checkmyva:widget.ml_sentiment.title"));

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
