import {
  Aggregation,
  DataAdapterInterface,
  DataAdapterContext,
  DataItemInterface,
  DataFetchingOptionsInterface,
  UserInterface,
  SourceInterface,
  DataItemValueInterface,
  DataItemDimensionValueInterface,
  DataItemValueTypeInterface,
  DataFetchingEvaluatedOptionsInterface,
} from "@opendash/core";

import { validateConnection, fetchItems, fetchValues } from "../extension";
import { CategoriesInterface } from "../types/Category";

function setResolution(
  start: number,
  end: number,
  mode: "minmax",
  maxValues: number,
  values: { date: number; value: number }[]
) {
  const result: { date: number; value: number }[] = [];

  if (values.length <= maxValues) {
    return values;
  }

  const bucketSize = Math.ceil(values.length / (maxValues / 2));

  if (mode === "minmax") {
    let count = 0;
    let maxVal = Number.NEGATIVE_INFINITY;
    let minVal = Number.POSITIVE_INFINITY;
    let max = null;
    let min = null;

    for (let val of values) {
      if (count == bucketSize) {
        if (max && min) {
          if (max.date > min.date) {
            result.push(min);
            result.push(max);
          } else {
            result.push(max);
            result.push(min);
          }
        }
        count = 0;
        maxVal = Number.NEGATIVE_INFINITY;
        minVal = Number.POSITIVE_INFINITY;
        max = null;
        min = null;
      }

      if (val.value > maxVal) {
        max = val;
        maxVal = val.value;
      }
      if (val.value <= minVal) {
        min = val;
        minVal = val.value;
      }
      count++;
    }
  }

  return result;
}

const valueTypes: DataItemValueTypeInterface[] = [
  {
    name: "Frage",
    type: "String",
    unit: "String",
  },
  {
    name: "Antwort",
    type: "String",
    unit: "String",
  },
  {
    name: "Gerät",
    type: "String",
    unit: "String",
  },
];

export class DataAdapter implements DataAdapterInterface {
  private context: DataAdapterContext;
  private user: UserInterface;

  private categories: CategoriesInterface = {};

  private alexaData: DataItemValueInterface[] = [];
  private googleData: DataItemValueInterface[] = [];

  constructor() {
    window.addEventListener("storage", ({ key, newValue }) => {
      if (key === "checkmyva/categories") {
        this.__initCategories();
      }
    });
  }

  onContext(context: DataAdapterContext) {
    this.context = context;

    this.__init();
  }

  onUser(user: UserInterface) {}
  onSource(source: SourceInterface, descendents: SourceInterface[]) {}

  async fetchValues(
    item: DataItemInterface,
    options: DataFetchingEvaluatedOptionsInterface
  ): Promise<DataItemValueInterface[]> {
    try {
      if (options?.aggregation) {
        throw new Error(
          "DataAdapter.fetchValues() does not support aggregation"
        );
      }

      return await this.__getData(
        item.source,
        item.id,
        options.start,
        options.end
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async fetchDimensionValues(
    item: DataItemInterface,
    dimension: number,
    options: DataFetchingEvaluatedOptionsInterface
  ): Promise<DataItemDimensionValueInterface[]> {
    try {
      const data = await this.__getData(
        item.source,
        item.id,
        options.start,
        options.end
      );

      if (options.limit && options.limit < data.length) {
        data.splice(0, data.length - options.limit);
      }

      let result = data.map((x: DataItemValueInterface) => ({
        date: x.date,
        value: x.value[dimension],
      }));

      if (options.resolution) {
        result = setResolution(
          options.start,
          options.end,
          "minmax",
          options.resolutionMaxValues,
          result
        );
      }

      if (options.aggregation) {
        result = Aggregation.aggregate(
          // @ts-ignore
          options.aggregationOperation,
          options.aggregationPots,
          result
        );
      }

      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async update(item: DataItemInterface) {}

  private async __init(): Promise<void> {
    try {
      if (!this.context) {
        return;
      }

      if (!(await validateConnection())) {
        await this.context.setLoading(false);
        return;
      }

      await this.context.reset();

      this.alexaData = await fetchValues(
        "checkmyva.alexa.takeout",
        0,
        Date.now()
      );

      this.googleData = await fetchValues(
        "checkmyva.google.takeout",
        0,
        Date.now()
      );

      // if (this.alexaData.length > 0) {
      await this.context.setItem({
        source: "checkmyva",
        id: "checkmyva.alexa.takeout",
        name: "Alexa Daten",
        meta: {
          color: "#33c5f3",
        },
        valueTypes,
      });
      // }

      // if (this.googleData.length > 0) {
      await this.context.setItem({
        source: "checkmyva",
        id: "checkmyva.google.takeout",
        name: "Google Daten",
        meta: {
          color: "#f44336",
        },
        valueTypes,
      });
      // }

      await this.__initCategories();

      await this.context.setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  private async __initCategories(): Promise<void> {
    try {
      if (!this.context) {
        return;
      }

      const previousCategories = this.categories || {};

      try {
        this.categories = JSON.parse(
          window.localStorage.getItem("checkmyva/categories")
        );
      } catch (e) {
        this.categories = {};
      }

      for (const key of Object.keys(previousCategories)) {
        try {
          if (!this.categories[key]) {
            await this.context.removeItem(
              // @ts-ignore
              {
                source: "checkmyva",
                id: "checkmyva-categories." + key,
              }
            );
          }
        } catch (error) {
          console.error("__initCategories", error);
        }
      }

      this.context.setItems(
        Object.entries(this.categories).map(
          ([key, { name, words, color }]) => ({
            source: "checkmyva",
            id: "checkmyva-categories." + key,
            name: name,
            meta: {
              checkmyvaCategory: true,
              checkmyvaCategoryWords: words,
              color: color,
            },
            valueTypes,
          })
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  private async __getData(
    source: string,
    id: string,
    start: number,
    end: number
  ): Promise<DataItemValueInterface[]> {
    try {
      if (id === "checkmyva.alexa.takeout") {
        // return await this.__getDataFromExtension(id, start, end);

        return this.alexaData.filter((x) => x.date >= start && x.date <= end);
      }

      if (id === "checkmyva.google.takeout") {
        // return await this.__getDataFromExtension(id, start, end);

        return this.googleData.filter((x) => x.date >= start && x.date <= end);
      }

      if (id.startsWith("checkmyva-categories.")) {
        return await this.__getDataForCategory(id, start, end);
      }

      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  private async __getDataForCategory(
    id: string,
    start: number,
    end: number
  ): Promise<DataItemValueInterface[]> {
    if (!this.context) {
      return;
    }

    id = id.replace("checkmyva-categories.", "");

    const meta = this.categories[id];

    if (!meta) {
      return [];
    }

    const raw = await Promise.all([
      this.__getData(null, "checkmyva.alexa.takeout", start, end),
      this.__getData(null, "checkmyva.google.takeout", start, end),
    ]);

    const logicType = meta.logicType || "or";

    const result: DataItemValueInterface[] = [];

    if (logicType === "or") {
      for (const source of raw) {
        for (const row of source) {
          const sentence = (row.value[0] || "").toLowerCase();

          for (const word of meta.words) {
            if (
              sentence === word ||
              sentence.startsWith(word + " ") ||
              sentence.endsWith(" " + word) ||
              sentence.includes(" " + word + " ")
            ) {
              result.push(row);
              break;
            }
          }
        }
      }
    }

    if (logicType === "and") {
      for (const source of raw) {
        for (const row of source) {
          let valid = true;
          const sentence = (row.value[0] || "").toLowerCase();

          for (const word of meta.words) {
            if (
              sentence === word ||
              sentence.startsWith(word + " ") ||
              sentence.endsWith(" " + word) ||
              sentence.includes(" " + word + " ")
            ) {
            } else {
              valid = false;
              break;
            }
          }

          if (valid) {
            result.push(row);
          }
        }
      }
    }

    return result;
  }
}
