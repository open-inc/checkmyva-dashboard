// @ts-check

import * as React from "react";
import Highcharts, { Options } from "highcharts";
import moment from "moment";

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

      const categories: string[] = [];
      const count: Record<string, Record<string, number>> = {};

      let maxDate = Number.MIN_VALUE;
      let minDate = Number.MAX_VALUE;

      for (const [item, values] of categoryValues) {
        count[item.name] = {};

        if (values.length > 0) {
          maxDate = Math.max(maxDate, values[values.length - 1].date);
          minDate = Math.min(minDate, values[0].date);
        }
      }

      const maxMoment = moment(maxDate);
      const minMoment = moment(minDate);

      while (maxMoment.isAfter(minMoment)) {
        const key = minMoment.format("MMMM YYYY");

        categories.push(key);

        for (const categoryCount of Object.values(count)) {
          categoryCount[key] = 0;
        }

        minMoment.add(1, "month");
      }

      for (const [item, values] of categoryValues) {
        for (const value of values) {
          const key = moment(value.date).format("MMMM YYYY");

          count[item.name][key] += 1;
        }
      }

      return {
        chart: {
          type: "column",
        },
        title: {
          text: null,
        },
        subtitle: {
          text: null,
        },
        xAxis: {
          categories,
          crosshair: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: t("checkmyva:widget.category_timeseries.yaxis_label"),
          },
        },
        // tooltip: {
        //   headerFormat:
        //     '<span style="font-size:10px">{point.key}</span><table>',
        //   pointFormat:
        //     '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        //   footerFormat: "</table>",
        //   shared: true,
        //   useHTML: true,
        // },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        series: Object.entries(count).map(([name, data]) => ({
          name,
          data: categories.map((key) => data[key]),
          color: items.find((item) => item.name === name)?.meta.color,
        })),
      } as Options;
    }, []);

    context.setLoading(loading);
    context.setName(t("checkmyva:widget.category_timeseries.title"));

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
