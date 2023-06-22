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

    const items = useDataItems();

    const [chartConfig, error, loading] = usePromise(async () => {
      $ml;

      const max = Math.max(...Object.values($ml.advertisement));

      const highchartsOptions: Options = {
        title: null,
        subtitle: null,
        chart: {
          type: "packedbubble",
        },
        tooltip: {
          useHTML: true,
          pointFormat:
            "Die Marke <b>{point.name}</b> wurde {point.value} mal genannt.",
        },
        plotOptions: {
          packedbubble: {
            minSize: "30%",
            maxSize: "120%",
            zMin: 1,
            zMax: max,
            layoutAlgorithm: {
              splitSeries: false,
              gravitationalConstant: 0.02,
            },
            dataLabels: {
              enabled: true,
              format: "{point.name}",
              filter: {
                property: "y",
                operator: ">",
                value: 1,
              },
              style: {
                color: "black",
                textOutline: "none",
                fontWeight: "normal",
              },
            },
          },
        },
        series: [
          {
            name: "Marken",
            type: "packedbubble",
            data: Object.entries($ml.advertisement).map(([key, value]) => {
              return {
                name: key,
                value,
              };
            }),
          },
        ],
      };

      return highchartsOptions;
    }, [items]);

    context.setLoading(!chartConfig);
    context.setName(t("checkmyva:widget.ml_advertisement.title"));

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
