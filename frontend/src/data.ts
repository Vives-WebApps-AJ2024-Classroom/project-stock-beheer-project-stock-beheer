export const financialData = [
  { year: "2015", profit: 4.0, expenses: 1.5 },
  { year: "2016", profit: 4.5, expenses: 1.6 },
  { year: "2017", profit: 5.0, expenses: 1.7 },
  { year: "2018", profit: 5.5, expenses: 1.8 },
  { year: "2019", profit: 4.2, expenses: 1.8 },
  { year: "2020", profit: 2.8, expenses: 2.5 },
  { year: "2021", profit: 3.2, expenses: 2.7 },
  { year: "2022", profit: 6.2, expenses: 2.5 },
  { year: "2023", profit: 7.1, expenses: 2.8 },
  { year: "2024", profit: 8.0, expenses: 3.0 },
].map((item, index, array) => ({
  ...item,
  revenue:
    item.profit - item.expenses + (index > 0 ? array[index - 1].profit : 0), // Add last year's profit
}));
