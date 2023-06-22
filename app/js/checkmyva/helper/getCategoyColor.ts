import { CategoriesInterface } from "../types/Category";

export function getCategoryColor(categories: CategoriesInterface) {
  const colors = [
    // "#f44336",
    "#ffeb3b",
    "#3f51b5",
    "#009688",
    "#e91e63",
    "#2196f3",
    "#4caf50",
    "#ff5722",
    "#9c27b0",
    "#03a9f4",
    "#8bc34a",
    "#ffc107",
    "#673ab7",
    "#00bcd4",
    "#cddc39",
    "#ff9800",
  ];

  const colorsInUse = Object.values(categories).map(
    (category) => category.color
  );

  for (const color of colors) {
    if (!colorsInUse.includes(color)) {
      return color;
    }
  }

  return "#000";
}
