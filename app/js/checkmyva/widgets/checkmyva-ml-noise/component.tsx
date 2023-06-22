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

const types = [
  {
    id: "cough",
    name: "Husten",
  },
  {
    id: "sneez",
    name: "Nießen",
  },
  {
    id: "tv",
    name: "TV",
  },
  {
    id: "music",
    name: "Musik",
  },
  {
    id: "talking",
    name: "Sprechen",
  },
];

export default createWidgetComponent<ConfigInterface>(
  ({ config, context: ctx, ...context }) => {
    const t = useTranslation();

    const { width, height } = context.useContainerSize();

    const [chartConfig, error, loading] = usePromise(async () => {
      const highchartsOptions: Options = {
        title: null,
        subtitle: null,

        yAxis: {
          title: {
            text: "Tageszeit",
          },
          max: 24,
        },

        xAxis: {
          type: "datetime",
          title: {
            text: "Datum",
          },
          tickInterval: 24 * 3600 * 1000,
        },

        legend: {
          layout: "horizontal",
          align: "center",
          verticalAlign: "bottom",
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
            turboThreshold: 100000,
          },
          line: {
            marker: {
              enabled: true,
            },
          },
        },
        tooltip: {
          pointFormat: "Grund: {point.cause}<br/>Uhrzeit: {point.y} Uhr",
        },
        series: types.map(({ id, name }) => {
          return {
            id,
            name,
            type: "scatter",
            data: $ml.backgroundNoise
              .filter((noise) => noise.type === id)
              .map((noise) => {
                const x = new Date(noise.timestamp);
                const y = new Date(noise.timestamp);

                x.setHours(0);
                x.setMinutes(0);
                x.setSeconds(0);
                x.setMilliseconds(0);

                return {
                  cause: noise.cause,
                  x: x.valueOf(),
                  y: y.getHours() + y.getMinutes() / 60,
                };
              }),
          };
        }),
      };

      return highchartsOptions;
    }, []);

    context.setLoading(!chartConfig);
    context.setName(t("checkmyva:widget.ml_noise.title"));

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
