// @ts-check

import * as React from "react";
import moment from "moment";

import {
  createWidgetComponent,
  FormatRelativeDates,
  useTranslation,
  useOpenDashServices,
} from "@opendash/core";

import { quantile } from "simple-statistics";

import { ConfigInterface } from "./types";
import { Table } from "../table-common";

export default createWidgetComponent<ConfigInterface>(
  ({ config, ...context }) => {
    const t = useTranslation();

    const { DataService } = useOpenDashServices();

    context.setLoading(false);
    context.setName(
      t("table:name.dimension", {
        name: context
          .useItemDimensionConfig()
          .map(([item, dimension]) => DataService.getItemName(item, dimension))
          .join(", "),
      })
    );

    const history = context.useFetchDimensionValues();
    const { height, width } = context.useContainerSize();

    const cols = React.useMemo(() => {
      const colWidth = Math.floor(width / 5);

      return [
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
          width: colWidth,
          render: (value) => {
            return (
              <span>
                <span>{moment(value).format("YYYY-DD-MM HH:mm:ss")} </span>
                (<FormatRelativeDates start={value} />)
              </span>
            );
          },
        },
        {
          title: "Weekday",
          dataIndex: "weekday",
          key: "weekday",
          width: colWidth,
        },
        {
          title: `Item`,
          dataIndex: "item",
          key: `item`,
          width: colWidth,
        },
        {
          title: `Dimension`,
          dataIndex: "dimension",
          key: `dimension`,
          width: colWidth,
        },
        {
          title: "Value",
          dataIndex: "value",
          key: `value`,
          width: colWidth,
        },
      ];
    }, [width]);

    const percentile = React.useMemo(() => {
      if (!config.percentile) {
        return null;
      }

      const values = history.flatMap(([, , values]) => {
        return values.map(({ value }) => value);
      });

      if (values.length === 0) {
        return null;
      }

      return quantile(values, config.percentile);
    }, [history]);

    const rows = React.useMemo(() => {
      return history.flatMap(([item, dimension, values]) => {
        const valueType = item.valueTypes[dimension];

        let result = values;

        if (percentile) {
          result = result.filter((row) => row.value >= percentile);
        }

        return result
          .map(({ date, value }) => ({
            date,
            weekday: moment(date).format("dddd"),
            item: item.name,
            dimension: `${valueType.name} (${valueType.unit})`,
            value,
          }))
          .sort((a, b) => b.date - a.date);
      });
    }, [history]);

    return <Table cols={cols} rows={rows} width={width} height={height} />;
  }
);
