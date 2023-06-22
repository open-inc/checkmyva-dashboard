import * as React from "react";

import { Table as AntdTable } from "antd";
import { VariableSizeGrid as Grid } from "react-window";

interface Props {
  cols: any[];
  rows: any[];
  width: number;
  height: number;
}

export const Table = React.memo<Props>(function WidgetActionBar({
  cols,
  rows,
  width,
  height,
}) {
  const tableHeaderHeight = 39;
  const tableRowHeight = 34;
  const tableBodyHeight = height - tableHeaderHeight;

  return (
    <AntdTable
      size="small"
      dataSource={rows}
      columns={cols}
      scroll={{ y: tableBodyHeight }}
      pagination={false}
      components={{
        body: (rawData: object[], { scrollbarSize, ref, onScroll }: any) => (
          <Grid
            // className="virtual-grid"
            columnCount={cols.length}
            columnWidth={(i) =>
              i === cols.length - 1
                ? cols[i].width - scrollbarSize - 1
                : cols[i].width
            }
            height={tableBodyHeight}
            rowCount={rawData.length}
            rowHeight={() => tableRowHeight}
            width={width}
            onScroll={({ scrollLeft }) => {
              onScroll({ scrollLeft });
            }}
          >
            {({ columnIndex, rowIndex, style }) => (
              <div
                style={{
                  ...style,
                  background: rowIndex % 2 ? "#fafafa" : "none",
                  padding: "0 8px",
                  lineHeight: "34px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {resolveArraySelector(rawData[rowIndex], cols[columnIndex])}
              </div>
            )}
          </Grid>
        ),
      }}
    />
  );
});

function resolveArraySelector(row, col) {
  try {
    const selector = col.dataIndex;

    let value = row;

    if (Array.isArray(selector)) {
      for (const key of selector) {
        value = value[key];
      }

      return value;
    } else {
      value = value[selector];
    }

    if (col.render) {
      return col.render(value, row);
    } else {
      return value;
    }
  } catch (error) {
    return null;
  }
}
