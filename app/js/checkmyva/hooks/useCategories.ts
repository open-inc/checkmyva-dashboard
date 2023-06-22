import { useLocalStorage } from "@opendash/core";
import { CategoriesInterface } from "../types/Category";

export function useCategories() {
  return useLocalStorage<CategoriesInterface>("checkmyva/categories", {});
}
