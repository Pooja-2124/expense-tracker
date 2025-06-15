import {transactions,calculateSummary} from "./transaction.js";

import { renderChart } from './chart.js';

import { renderCategoryChart } from './chart.js'; 


import { renderMonthlyChart } from './chart.js';


window.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  const { income, expenses, balance } = calculateSummary();
  updateSummary(income, expenses, balance);
  renderTransactionList();
  renderChart();
  renderCategoryChart();
  renderMonthlyChart();
});


const descriptionInput=document.querySelector('.js-description');
const amountInput = document.querySelector('.js-amount');
const typeInput=document.querySelector('.js-type');
const dateInput=document.querySelector('.js-date');
const categoryInput = document.querySelector('.js-category');
let description;
let amount;
let type;
let date;
let category;

// Show/Hide category dropdown based on type
const categoryContainer = document.getElementById('category-container');

typeInput.addEventListener('change', () => {
  if (typeInput.value === 'expense') {
    categoryContainer.style.display = 'block';
  } else {
    categoryContainer.style.display = 'none';
  }
});

// Ensure correct display on page load
window.addEventListener('DOMContentLoaded', () => {
  if (typeInput.value === 'expense') {
    categoryContainer.style.display = 'block';
  } else {
    categoryContainer.style.display = 'none';
  }
});



document.querySelector('.js-submit-button').addEventListener('click',()=>{
description=descriptionInput.value;
amount = parseFloat(amountInput.value);
type=typeInput.value;
date=dateInput.value;
 category = categoryInput.value;
console.log(description);
console.log(amount);
console.log(type);
console.log(date);


const  newTransaction={
    description,
    amount,
    type,
    date,
     category: type === 'expense' ? category : '' 
}
console.log(newTransaction);

  if (type === 'expense') {
    const { income, expenses } = calculateSummary();
    const projectedExpenses = expenses + amount;
    const projectedBalance = income - projectedExpenses;

    if (projectedBalance < 0) {
      alert(`⚠️ Warning: Your expenses have exceeded your balance! \n ❌ Cannot add this expense. `);
      return;
    }
  }

transactions.push(newTransaction);

console.log(transactions);

const {income,expenses,balance}=calculateSummary();

// updateSummary(income,expenses,balance);
saveToStorage(income,expenses,balance);

updateSummary(income, expenses, balance);

renderChart();

renderCategoryChart();

renderMonthlyChart();

renderTransactionList();

resetInputValues();


});

function updateSummary(income,expenses,balance) {
document.querySelector('#income').innerHTML=income;

document.querySelector('#expenses').innerHTML=expenses;

document.querySelector('#balance').innerHTML=balance;  

}


function resetInputValues() {
descriptionInput.value = '';
amountInput.value = '';
typeInput.value = 'income'; // reset to default option
}

function saveToStorage(income,expenses,balance) {
    localStorage.setItem('income',income);
    localStorage.setItem('expenses',expenses);
    localStorage.setItem('balance',balance);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    // updateSummary(income,expenses,balance);
}


function renderTransactionList() {
     const list = document.querySelector('#transaction-list');
  list.innerHTML = ''; // Clear old items

  transactions.forEach((transaction,index) => {
    const li = document.createElement('li');
    li.innerHTML = `
     <div class="transaction-details">
    <div class="transaction-description">
      ${transaction.description} - ₹${transaction.amount}
      <span style="color:${transaction.type === 'income' ? 'green' : 'red'}">
        (${transaction.type})
      </span>
    </div>
    <div class="transaction-meta">
      ${transaction.date}
    </div>
  </div>
  <div class="transaction-actions">
    <button class="js-edit" data-index="${index}">Update</button>
    <button class="js-delete" data-index="${index}">Remove</button>
  </div>
    `;
    list.appendChild(li);
  });

  // Attach event listeners to delete buttons
  document.querySelectorAll('.js-delete').forEach(button => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      removeTransaction(index);
    });
  });


  document.querySelectorAll('.js-edit').forEach((button)=>{
    button.addEventListener('click',(event)=>{
        const index=event.target.dataset.index;
        editTransaction(index);
    });
});
}



function loadFromStorage() {
  const savedTransactions = JSON.parse(localStorage.getItem('transactions'));
  if (savedTransactions) {
    transactions.length = 0; // clear current array
    transactions.push(...savedTransactions); // load stored transactions
  }
}



function removeTransaction(index) {
// Remove from array
  transactions.splice(index, 1);

  // Save updated list to storage
  localStorage.setItem('transactions', JSON.stringify(transactions));

  // Recalculate and save new summary
  const { income, expenses, balance } = calculateSummary();
  saveToStorage(income, expenses, balance);

  // Re-render everything
  updateSummary(income, expenses, balance);

  renderChart();

  renderCategoryChart();

  renderMonthlyChart();

  renderTransactionList();
}



function editTransaction(index) {
    
     const transaction = transactions[index];

    descriptionInput.value=transaction.description;
    amountInput.value=transaction.amount;
    typeInput.value=transaction.type;
    dateInput.value=transaction.date;


    // Remove the old transaction
  transactions.splice(index, 1);


  // Recalculate and save new summary
  const { income, expenses, balance } = calculateSummary();
  saveToStorage(income, expenses, balance);

  // Re-render everything
  updateSummary(income, expenses, balance);

  renderChart();

  renderCategoryChart();

  renderMonthlyChart();

  renderTransactionList();
}



// DARK MODE TOGGLE FUNCTIONALITY
const toggleBtn = document.getElementById('darkModeToggle');

// Load dark mode preference on page load
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  toggleBtn.textContent = '☀️ Light Mode';
}

// Toggle on click
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});
