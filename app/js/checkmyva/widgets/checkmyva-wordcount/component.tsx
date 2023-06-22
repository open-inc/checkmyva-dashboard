// @ts-check

import * as React from "react";
import moment from "moment";

import {
  createWidgetComponent,
  useTranslation,
  useOpenDashServices,
  usePromise,
  DataItemInterface,
} from "@opendash/core";

import { ConfigInterface } from "./types";
import { Table } from "../table-common";
import { useCategories } from "../../hooks/useCategories";
import { Button, Tag } from "antd";

import { stopwords } from "./stoplist";
import { $category } from "../../states";

export default createWidgetComponent<ConfigInterface>(
  ({ config, ...context }) => {
    const t = useTranslation();

    const { DataService } = useOpenDashServices();

    const { height, width } = context.useContainerSize();

    const [categories, setCategories] = useCategories();

    const cols = React.useMemo(
      () => [
        {
          title: t(
            config.type === "word"
              ? "checkmyva:widget.count_table.cols.word"
              : "checkmyva:widget.count_table.cols.phrase"
          ),
          dataIndex: "word",
          key: "word",
          width: Math.floor(width / 3),
          sorter: (a, b) => a.word.localeCompare(b.word, "de"),

          ...(config.type === "word" && {
            filters: [
              {
                text: "Stoppworte verbergen",
                value: "stoppwords",
              },
            ],

            onFilter: (filter, record) => {
              if (filter === "stoppwords") {
                return !stopwords.includes(record.word);
              }

              return true;
            },
          }),
        },
        {
          title: t("checkmyva:widget.count_table.cols.count"),
          dataIndex: "count",
          key: "count",
          width: Math.floor(width / 3),
          sorter: (a, b) => a.count - b.count,
          defaultSortOrder: "descend",
        },
        {
          title: t("checkmyva:widget.count_table.cols.categories"),
          dataIndex: "categories",
          key: "categories",
          width: Math.floor(width / 3),
          render: (categories, row) => (
            <>
              {categories.map((category) => (
                <Tag children={category} />
              ))}

              <Button
                size="small"
                onClick={() => {
                  $category.setWordToCategoryDialog(row.word);
                }}
              >
                {t("checkmyva:categories.add_word_to_category_action")}
              </Button>
            </>
          ),
        },
      ],
      [width, t]
    );

    const [result, error, loading] = usePromise(async () => {
      const items: [DataItemInterface, number][] = [
        [await DataService.get("checkmyva", "checkmyva.alexa.takeout"), 0],
        [await DataService.get("checkmyva", "checkmyva.google.takeout"), 0],
      ];

      const values = await DataService.fetchDimensionValuesMultiItem(
        items,
        config._history
      );

      const resultRecord: Record<string, number> = {};

      if (config.type === "word") {
        for (const [item, dimension, history] of values) {
          for (const { date, value } of history) {
            const wordArray = (value as string).split(" ");

            for (const word of wordArray) {
              resultRecord[word] = (resultRecord[word] || 0) + 1;
            }
          }
        }

        delete resultRecord.alexa;
      } else {
        for (const [item, dimension, history] of values) {
          for (const { date, value } of history) {
            const phrase = value as string;

            resultRecord[phrase] = (resultRecord[phrase] || 0) + 1;
          }
        }
      }

      return (
        Object.entries(resultRecord)
          .map(([word, count]) => ({
            word: word,
            count: count,
            categories: Object.values(categories)
              .filter((category) => category.words.includes(word))
              .map((category) => category.name),
          }))
          // .filter(({ count }) => count > 1)
          .sort((a, b) => b.count - a.count)
      );
    }, []);

    context.setLoading(loading);
    context.setName(
      config.type === "word"
        ? t("checkmyva:widget.count_table.word.title")
        : t("checkmyva:widget.count_table.phrase.title")
    );

    return (
      !!result && (
        <Table cols={cols} rows={result} width={width} height={height} />
      )
    );
  }
);
