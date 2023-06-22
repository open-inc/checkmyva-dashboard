import Parse from "parse";

export interface CMVAWordCategoryAttributes {
  name: string;
  words?: any[];
}

export class CMVAWordCategory extends Parse.Object<CMVAWordCategoryAttributes> {
  constructor(data: CMVAWordCategoryAttributes) {
    super("CMVAWordCategory", data);
  }
}

Parse.Object.registerSubclass("CMVAWordCategory", CMVAWordCategory);
