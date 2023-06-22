export interface CategoryInterface {
  name: string;
  color: string;
  words: string[];
  fromSuggestion?: string;
  logicType?: "or" | "and";
}

export type CategoriesInterface = Record<string, CategoryInterface>;
