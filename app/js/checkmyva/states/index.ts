import { makeAutoObservable } from "mobx";
import { MachineLearningService } from "./ml";

class CategoryState {
  addWordDialog: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setWordToCategoryDialog(value: string | null) {
    this.addWordDialog = value;
  }
}

export const $category = new CategoryState();
export const $ml = new MachineLearningService();
