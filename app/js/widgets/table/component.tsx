// @ts-check

import * as React from "react";
import moment from "moment";

import {
  createWidgetComponent,
  FormatRelativeDates,
  useTranslation,
  useOpenDashServices,
} from "@opendash/core";

import { ConfigInterface } from "./types";
import { Table } from "../table-common";

export default createWidgetComponent<ConfigInterface>(
  ({ config, ...context }) => {
    const t = useTranslation();

    const { DataService } = useOpenDashServices();

    context.setLoading(false);
    context.setName(
      t("table:name.item", {
        name: context
          .useItemConfig()
          .map((item) => DataService.getItemName(item))
          .join(", "),
      })
    );

    const values = context.useFetchValues();
    const { height, width } = context.useContainerSize();

    const [cols, rows] = React.useMemo(() => {
      try {
        const [[item, rows]] = values;

        const colWidth = Math.floor(width / (item.valueTypes.length + 1));

        const cols = [
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
          ...item.valueTypes.map((valueType, dimension) => {
            return {
              title: `${valueType.name} (${valueType.unit})`,
              dataIndex: ["value", dimension],
              key: `dim_${dimension}`,
              width: colWidth,
            };
          }),
        ];

        return [cols, [...rows].sort((a, b) => b.date - a.date)];
      } catch (error) {
        return [[], []];
      }
    }, [values, width]);

    return <Table cols={cols} rows={rows} width={width} height={height} />;
  }
);
