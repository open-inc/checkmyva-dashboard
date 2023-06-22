import * as React from "react";
import { Modal, Select } from "antd";
import { observer } from "mobx-react-lite";
import { produce, useOpenDashServices, useTranslation } from "@opendash/core";
import { useCategories } from "../hooks/useCategories";
import { $category } from "../states";

export const AddToCategoryDialog = observer(function AddToCategoryDialog() {
  const t = useTranslation();
  const { DataService } = useOpenDashServices();

  const [categories, setCategories] = useCategories();

  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const keys = Object.keys(categories);

    if ((!value || !keys.includes(value)) && keys.length > 0) {
      setValue(keys[0]);
    }
  }, [categories, value]);

  if (!$category.addWordDialog) {
    return null;
  }

  return (
    <Modal
      title={t("checkmyva:categories.add_word_to_category_title")}
      visible={true}
      onOk={() => {
        setCategories(
          produce(categories, (draft) => {
            draft[value]?.words.push($category.addWordDialog);
          })
        );

        $category.setWordToCategoryDialog(null);
      }}
      onCancel={() => {
        $category.setWordToCategoryDialog(null);
      }}
    >
      <p>{t("checkmyva:categories.add_word_to_category_description")}</p>
      <Select
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
        }}
        options={Object.entries(categories).map(([key, category]) => {
          return {
            key,
            value: key,
            label: category.name,
          };
        })}
        style={{ width: "100%" }}
      />
    </Modal>
  );
});
