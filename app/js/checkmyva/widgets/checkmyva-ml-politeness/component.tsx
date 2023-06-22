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
import { FitText } from "@opendash/ui";

export default createWidgetComponent<ConfigInterface>(
  ({ config, context: ctx, ...context }) => {
    const t = useTranslation();

    const { width, height } = context.useContainerSize();

    const items = useDataItems();

    const [chartConfig, error, loading] = usePromise(async () => {
      $ml;

      const highchartsOptions: Options = {
        title: null,
        subtitle: null,
      };

      return highchartsOptions;
    }, [items]);

    context.setLoading(!chartConfig);
    context.setName(t("checkmyva:widget.ml_politeness.title"));

    return (
      <FitText
        height={height}
        width={width}
        children={t("checkmyva:widget.ml_politeness.label", {
          context: $ml.politeness,
        })}
        style={{
          color:
            $ml.politeness === "positive"
              ? "green"
              : $ml.politeness === "negative"
              ? "red"
              : undefined,
        }}
      />
    );
  }
);
