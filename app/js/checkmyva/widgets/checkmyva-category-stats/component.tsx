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
import { Button } from "antd";
import { CreateCategoryDialog } from "../../components/CreateCategoryDialog";

export default createWidgetComponent<ConfigInterface>(
  ({ config, ...context }) => {
    const t = useTranslation();

    const { DataService } = useOpenDashServices();

    const { height, width } = context.useContainerSize();
    const [createCategory, setCreateCategory] = React.useState(false);

    const items = useDataItems();

    const [chartConfig, error, loading] = usePromise<Options>(async () => {
      const categories = items
        .filter((item) => item.meta.checkmyvaCategory)
        .map((item) => [item, 0] as [DataItemInterface, number]);

      if (categories.length === 0) {
        return null;
      }

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
            name: t("checkmyva:widget.category_stats.series_name"),
            colorByPoint: true,
            data: values.map(([item, dimension, history]) => ({
              name: `${item.name} (${
                Math.round((history[0].value / valuesCount) * 1000) / 10
              }%)`,
              color: DataService.getItemColor(item),
              y: history[0]?.value ?? 0,
            })),
          },
        ],
      } as Options;
    }, [items]);

    context.setLoading(loading);
    context.setName(t("checkmyva:widget.category_stats.title"));

    if (chartConfig === null) {
      return (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height,
              width,
              textAlign: "center",
            }}
          >
            <div>
              <p>{t("checkmyva:categories.empty")}</p>
              <Button
                type="primary"
                onClick={() => {
                  setCreateCategory(true);
                }}
                children={t("checkmyva:categories.action_create")}
              />
            </div>
          </div>
          <CreateCategoryDialog
            open={createCategory}
            setOpen={setCreateCategory}
          />
        </>
      );
    }

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
