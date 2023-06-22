// @ts-check

import * as React from "react";

import {
  useTranslation,
  useOpenDashServices,
  usePromise,
  produce,
  uuid,
} from "@opendash/core";

import {
  Alert,
  Button,
  Divider,
  Input,
  List,
  Modal,
  Radio,
  Select,
} from "antd";
import { useCategories } from "../hooks/useCategories";
import { CMVAWordCategory } from "../parse";

import Parse from "parse";
import { useWords } from "../hooks/useWords";
import { CategoryInterface } from "../types/Category";
import { getCategoryColor } from "../helper/getCategoyColor";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const CreateCategoryDialog = React.memo<Props>(
  function CreateCategoryDialog({ open, setOpen }) {
    const t = useTranslation();
    const { DataService } = useOpenDashServices();

    const [categories, setCategories] = useCategories();

    const [input, setInput] = React.useState<CategoryInterface>({
      name: "",
      words: [],
      color: getCategoryColor(categories),
      logicType: "or",
    });

    React.useEffect(() => {
      if (!open) {
        setInput({
          name: "",
          words: [],
          color: getCategoryColor(categories),
          logicType: "or",
        });
      }
    }, [open]);

    const [
      categorySuggestions,
      categorySuggestionsError,
      categorySuggestionsLoading,
    ] = usePromise(async () => {
      return await new Parse.Query(CMVAWordCategory).find();
    }, []);

    const [wordSuggestions, wordSuggestionsError, wordSuggestionsLoading] =
      useWords();

    return (
      <Modal
        title={t("checkmyva:categories.create_title")}
        visible={open}
        onOk={() => {
          setOpen(false);

          setCategories(
            produce(categories, (draft) => {
              draft[uuid()] = input;
            })
          );
        }}
        okButtonProps={{ disabled: !input.name }}
        onCancel={() => {
          setOpen(false);
        }}
        okText={t("checkmyva:categories.action_create_confirm")}
      >
        <p>{t("checkmyva:categories.create_description")}</p>

        <Input
          placeholder={t("checkmyva:categories.create_placeholder")}
          value={input.name}
          onChange={(e) => {
            const value = e.target.value;
            setInput(
              produce((draft) => {
                draft.name = value;
              })
            );
          }}
          style={{ marginBottom: 20 }}
        />

        {input.name && (
          <>
            <p>{t("checkmyva:categories.word_placeholder")}</p>

            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%", marginBottom: 20 }}
              placeholder={t("checkmyva:categories.word_placeholder")}
              value={input.words}
              onChange={(nextWords) => {
                setInput(
                  produce((draft) => {
                    draft.words = nextWords;
                  })
                );
              }}
              children={(wordSuggestions || []).map((x) => (
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

            <p>{t("checkmyva:categories.logic_description")}</p>

            <Radio.Group
              value={input.logicType}
              onChange={(nextWords) => {
                const v = nextWords.target.value;

                setInput(
                  produce((draft) => {
                    draft.logicType = v;
                  })
                );
              }}
            >
              <Radio value="or">{t("checkmyva:categories.or")}</Radio>
              <Radio value="and">{t("checkmyva:categories.and")}</Radio>
            </Radio.Group>
          </>
        )}

        {!input.name && (
          <>
            <Divider />

            <p>{t("checkmyva:category_suggestion.description")}</p>

            {categorySuggestionsError && (
              <Alert
                type="error"
                message={t("checkmyva:category_suggestion.fetching_error")}
              />
            )}
            {!categorySuggestionsError && (
              <List
                dataSource={categorySuggestions}
                loading={categorySuggestionsLoading}
                renderItem={(suggestion) => (
                  <List.Item
                    actions={[
                      <Button
                        key="subscribe"
                        // disabled={!!categories[suggestion.id]}
                        type="primary"
                        children={t(
                          "checkmyva:category_suggestion.action_subscribe"
                        )}
                        onClick={() => {
                          setInput(
                            produce((draft) => {
                              draft.name = suggestion.get("name");
                              draft.words = suggestion.get("words");
                              draft.fromSuggestion = suggestion.id;
                            })
                          );
                        }}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      title={suggestion.get("name")}
                      description={suggestion.get("words")?.join(", ")}
                    />
                  </List.Item>
                )}
              />
            )}
          </>
        )}
      </Modal>
    );
  }
);
