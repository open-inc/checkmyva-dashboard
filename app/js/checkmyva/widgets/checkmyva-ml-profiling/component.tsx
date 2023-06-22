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
          polar: true,
          type: "line",
        },
        pane: {
          size: "80%",
        },

        xAxis: {
          categories: Object.keys($ml.profiling).map((cat) =>
            t("checkmyva:widget.ml_profiling.cat", { context: cat })
          ),
          tickmarkPlacement: "on",
          lineWidth: 0,
        },

        yAxis: {
          gridLineInterpolation: "polygon",
          lineWidth: 0,
          min: 0,
          max: 5,
        },

        tooltip: {
          shared: true,
          pointFormat:
            '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>',
        },

        legend: {
          align: "right",
          verticalAlign: "middle",
          layout: "vertical",
        },

        series: [
          {
            name: "",
            type: "line",
            data: Object.values($ml.profiling),
            pointPlacement: "on",
          },
        ],
      };

      return highchartsOptions;
    }, []);

    context.setLoading(!chartConfig);
    context.setName(t("checkmyva:widget.ml_profiling.title"));

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
