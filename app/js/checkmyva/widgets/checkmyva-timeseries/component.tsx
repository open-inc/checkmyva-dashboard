// @ts-check

import * as React from "react";

import { Chart, Options } from "highcharts";

import {
  createWidgetComponent,
  HighchartsChart,
  useTranslation,
  useOpenDashServices,
  useDataItems,
  usePromise,
  DataItemInterface,
} from "@opendash/core";

import { ConfigInterface } from "./types";

export default createWidgetComponent<ConfigInterface>(
  ({ config, context: ctx, ...context }) => {
    const t = useTranslation();

    const { DataService } = useOpenDashServices();

    const { width, height } = context.useContainerSize();

    const items = useDataItems();

    const [chartConfig, error, loading] = usePromise(async () => {
      const history = await DataService.fetchValuesMultiItem(
        items,
        config._history
      );

      const categories = items
        .filter((item) => item.meta.checkmyvaCategory)
        .map((item) => [item, 0] as [DataItemInterface, number]);

      const values = await DataService.fetchDimensionValuesMultiItem(
        categories,
        {
          ...config._history,

          aggregation: true,
          aggregationSplits: 1,
          aggregationOperation: "count",
        }
      );

      let valuesCount = 0;

      for (const [item, dimension, history] of values) {
        history[0].value = history[0]?.value ?? 0;
        valuesCount += history[0].value;
      }

      const intl = new Intl.DateTimeFormat("de-DE", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

      const highchartsOptions: Options = {
        title: null,
        subtitle: null,

        chart: {
          zoomType: "xy",
        },

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
          layout: "vertical",
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
          formatter: function () {
            // @ts-ignore
            const date = this.point._date;
            // @ts-ignore
            const request = this.point._request;
            // @ts-ignore
            const response = this.point._response;
            // @ts-ignore
            const device = this.point._device;

            const requestLabel = t("checkmyva:common.request");
            const responseLabel = t("checkmyva:common.response");
            const deviceLabel = t("checkmyva:common.device");

            return `${intl.format(
              date
            )} <br><b>${requestLabel}: ${request}</b><br>${deviceLabel}: ${device}<br>${responseLabel}: ${response}`;
          },
        },

        series: history.map(([item, values]) => {
          let name = item.name;

          if (item.meta.checkmyvaCategory) {
            const percent =
              Math.round((values.length / valuesCount) * 1000) / 10;

            name += ` (${percent}%)`;
          }

          return {
            name,
            color: DataService.getItemColor(item),
            type: "scatter",
            data: values.map((row) => {
              const [request, response, device] = row.value;

              const date = new Date(row.date);

              const x = new Date(row.date);

              x.setHours(0);
              x.setMinutes(0);
              x.setSeconds(0);
              x.setMilliseconds(0);

              return {
                _request: request,
                _response: response || "-",
                _device: device,
                _date: date,
                x: x.valueOf(),
                y: date.getHours() + date.getMinutes() / 60,
              };
            }),
          };
        }),
      };

      return highchartsOptions;
    }, [items]);

    context.setLoading(!chartConfig);
    context.setName(t("checkmyva:widget.timeseries.title"));

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
