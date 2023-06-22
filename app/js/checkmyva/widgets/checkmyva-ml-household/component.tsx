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

import { Icon } from "@opendash/icons";

import { ConfigInterface } from "../checkmyva-ml-health/types";
import { List } from "antd";
import { ListContext } from "rc-field-form";

export default createWidgetComponent<ConfigInterface>(
  ({ config, context: ctx, ...context }) => {
    const t = useTranslation();

    const { width, height } = context.useContainerSize();

    const items = useDataItems();

    const [data, error, loading] = usePromise(async () => {
      return $ml.household.map((person) => ({
        title: person.name,
        description: person.gender,
      }));
    }, [items]);

    context.setLoading(loading);
    context.setName(t("checkmyva:widget.ml_household.title"));

    if (!data) {
      return null;
    }

    return (
      <List
        dataSource={$ml.household}
        style={{ width, height, padding: 20 }}
        renderItem={(person) => {
          return (
            <List.Item>
              <List.Item.Meta
                title={person.name}
                description={`Hat den Sprachassistenten ${person.commandCount} mal benutzt.`}
                avatar={
                  <Icon
                    icon={
                      person.age === "child"
                        ? "fa:child"
                        : person.age === "adult" && person.gender === "female"
                        ? "fa:venus"
                        : person.age === "adult" && person.gender === "male"
                        ? "fa:mars"
                        : "fa:question"
                    }
                    style={{ fontSize: 32 }}
                  />
                }
              />
            </List.Item>
          );
        }}
      />
    );
  }
);
