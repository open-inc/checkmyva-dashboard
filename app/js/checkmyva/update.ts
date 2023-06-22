import { produce } from "@opendash/core";
import { CategoriesInterface } from "./types/Category";
import { getCategoryColor } from "./helper/getCategoyColor";

export async function runUpdate() {
  if (window.localStorage.getItem("checkmyva/categories")) {
    const categories: CategoriesInterface = JSON.parse(
      window.localStorage.getItem("checkmyva/categories")
    );

    window.localStorage.setItem(
      "checkmyva/categories",
      JSON.stringify(
        produce(categories, (draft) => {
          for (const [id, category] of Object.entries(categories)) {
            if (!category.color) {
              category.color = getCategoryColor(categories);
            }
          }
        })
      )
    );
  } else {
    window.localStorage.setItem("checkmyva/categories", JSON.stringify({}));
  }
}
