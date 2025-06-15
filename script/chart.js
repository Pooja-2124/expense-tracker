import { calculateSummary, transactions } from './transaction.js';

let chart;
let categoryChart;

export function renderChart() {
  const { income, expenses } = calculateSummary();

  const ctx = document.getElementById('expenseChart').getContext('2d');

  if (chart) chart.destroy(); // Destroy old chart before creating a new one

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        label: 'Financial Overview',
        data: [income, expenses],
        backgroundColor: ['#4CAF50', '#F44336'], // green, red
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `₹${context.raw}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount (₹)'
          }
        }
      }
    }
  });
}

// ✅ Updated function with default fallback for missing categories
function groupExpensesByCategory() {
  const categoryTotals = {};

  transactions.forEach(tx => {
    if (tx.type === 'expense' && typeof tx.amount === 'number') {
      const category = tx.category && tx.category.trim() !== '' ? tx.category : 'Uncategorized';
      categoryTotals[category] = (categoryTotals[category] || 0) + tx.amount;
    }
  });

  return categoryTotals;
}

export function renderCategoryChart() {
  const ctx = document.getElementById('categoryChart').getContext('2d');
  const data = groupExpensesByCategory();

  const labels = Object.keys(data);
  const amounts = Object.values(data);
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8BC34A'];

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Expenses by Category',
        data: amounts,
        backgroundColor: colors.slice(0, labels.length) // match color count to category count
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: context => `${context.label}: ₹${context.raw}`
          }
        }
      }
    }
  });
}


let monthlyChart;

function groupByMonth() {
  const monthlyData = {};

  transactions.forEach(tx => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }

    if (tx.type === 'income') {
      monthlyData[month].income += tx.amount;
    } else if (tx.type === 'expense') {
      monthlyData[month].expense += tx.amount;
    }
  });

  return monthlyData;
}

export function renderMonthlyChart() {
  const ctx = document.getElementById('monthlyChart').getContext('2d');
  const groupedData = groupByMonth();

  const months = Object.keys(groupedData).sort((a, b) => new Date('1 ' + a) - new Date('1 ' + b));
  const incomes = months.map(month => groupedData[month].income);
  const expenses = months.map(month => groupedData[month].expense);

  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomes,
          borderColor: '#4CAF50',
          backgroundColor: '#4CAF5090',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Expense',
          data: expenses,
          borderColor: '#F44336',
          backgroundColor: '#F4433690',
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `₹${context.raw}`
          }
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount (₹)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        }
      }
    }
  });
}
