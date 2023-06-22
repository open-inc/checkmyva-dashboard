// @ts-check

import * as React from "react";

import {
  createWidgetComponent,
  useTranslation,
  useOpenDashServices,
  usePromise,
  produce,
  useLocalStorage,
  uuid,
  DataItemInterface,
  useDataItems,
} from "@opendash/core";

import { Button, Select, Table } from "antd";
import { ConfigInterface } from "./types";
import { useCategories } from "../../hooks/useCategories";
import { CreateCategoryDialog } from "../../components/CreateCategoryDialog";

export default createWidgetComponent<ConfigInterface>(
  ({ config, ...context }) => {
    const t = useTranslation();

    const { DataService } = useOpenDashServices();

    const { height, width } = context.useContainerSize();

    const [createCategory, setCreateCategory] = React.useState(false);

    const [categories, setCategories] = useCategories();

    const [result, error, loading] = usePromise(async () => {
      const items: [DataItemInterface, number][] = [
        [await DataService.get("checkmyva", "checkmyva.alexa.takeout"), 0],
        [await DataService.get("checkmyva", "checkmyva.google.takeout"), 0],
      ];

      const values = await DataService.fetchDimensionValuesMultiItem(
        items,
        config._history
      );

      const words: Record<string, number> = {};

      const special = ["unbekannter sprachbefehl", "data not available"];

      for (const [item, dimension, history] of values) {
        for (const { date, value } of history) {
          const wordArray = (value as string).split(" ");

          for (const word of special) {
            if (value.includes(word)) {
              words[word] = (words[word] || 0) + 1;
            }
          }

          for (const word of wordArray) {
            words[word] = (words[word] || 0) + 1;
          }
        }
      }

      delete words.alexa;

      return (
        Object.entries(words)
          .map(([word, count]) => ({
            word: word,
            count: count,
          }))
          // .filter(({ count }) => count > 1)
          .sort((a, b) => b.count - a.count)
      );
    }, []);

    context.setLoading(loading);
    context.setName(t("checkmyva:widget.categories.title"));

    if (Object.values(categories).length === 0) {
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

    return (
      <>
        <p style={{ padding: "0 16px" }}>
          {t("checkmyva:widget.categories.description")}
        </p>
        <Table
          rowKey="key"
          pagination={false}
          scroll={{ y: height - 55 - 64 }}
          dataSource={Object.entries(categories).map(([key, value]) => ({
            key,
            ...value,
          }))}
          footer={() => (
            <Button
              onClick={() => {
                setCreateCategory(true);
              }}
              children={t("checkmyva:categories.action_create")}
            />
          )}
          columns={[
            {
              title: t("checkmyva:categories.cols.name"),
              dataIndex: "name",
              key: "name",
              width: "20%",
            },
            {
              title: t("checkmyva:categories.cols.color"),
              dataIndex: "color",
              key: "color",
              width: "10%",
              render: (color, row) => {
                return (
                  <input
                    type="color"
                    style={{ width: "100%" }}
                    value={color}
                    onChange={(e) => {
                      const nextColor = e.target.value;
                      setCategories(
                        produce(categories, (draft) => {
                          draft[row.key].color = nextColor;
                        })
                      );
                    }}
                  />
                );
                // return (
                //   <ColorPicker
                //     // style={{ width: "100%" }}
                //     color={color}
                //     onChange={(nextColor) => {
                //       setCategories(
                //         produce(categories, (draft) => {
                //           draft[row.key].color = nextColor;
                //         })
                //       );
                //     }}
                //   />
                // );
              },
            },
            {
              title: t("checkmyva:categories.cols.words"),
              dataIndex: "words",
              key: "words",
              width: "50%",
              render: (words, row) => {
                return (
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder={t("checkmyva:categories.word_placeholder")}
                    value={words}
                    onChange={(nextWords) => {
                      setCategories(
                        produce(categories, (draft) => {
                          draft[row.key].words = nextWords;
                        })
                      );
                    }}
                    children={(result || []).map((x) => (
                      <Select.Option
                        key={x.word}
                        value={x.word}
                        children={
                          <span>
                            {x.word} <i>({x.count} mal)</i>
                          </span>
                        }
                      />
                    ))}
                  />
                );
              },
            },
            {
              title: (
                <Button
                  type="primary"
                  onClick={() => {
                    setCreateCategory(true);
                  }}
                  children={t("checkmyva:categories.action_create_short")}
                />
              ),
              dataIndex: "key",
              key: "key",
              width: "20%",
              render: (key) => {
                return (
                  <Button
                    danger
                    onClick={() => {
                      setCategories(
                        produce(categories, (draft) => {
                          delete draft[key];
                        })
                      );
                    }}
                  >
                    {t("checkmyva:categories.action_delete")}
                  </Button>
                );
              },
            },
          ]}
        />
        <CreateCategoryDialog
          open={createCategory}
          setOpen={setCreateCategory}
        />
      </>
    );
  }
);
