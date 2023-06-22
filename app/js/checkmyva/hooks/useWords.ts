import {
  DataItemInterface,
  useOpenDashServices,
  usePromise,
} from "@opendash/core";

export function useWords() {
  const { DataService } = useOpenDashServices();

  return usePromise(async () => {
    const items: [DataItemInterface, number][] = [
      [await DataService.get("checkmyva", "checkmyva.alexa.takeout"), 0],
      [await DataService.get("checkmyva", "checkmyva.google.takeout"), 0],
    ];

    const values = await DataService.fetchDimensionValuesMultiItem(items, {
      historyType: "relative",
      value: 1,
      unit: "year",
    });

    const words: Record<string, number> = {};

    for (const [item, dimension, history] of values) {
      for (const { date, value } of history) {
        const wordArray = (value as string).toString().toLowerCase().split(" ");

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
}
