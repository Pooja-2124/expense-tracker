export let transactions = [];

export function calculateSummary() {
  let income = 0;
  let expenses = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === 'income') {
      income += transaction.amount;
    } else if (transaction.type === 'expense') {
      expenses += transaction.amount;
    }
  });

  const balance = income - expenses;

  return { income, expenses, balance };
}
