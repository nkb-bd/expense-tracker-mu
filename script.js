class ExpenseTracker {
  constructor() {
    // DOM elements
    this.balance = document.getElementById("balance");
    this.money_plus = document.getElementById("money-plus");
    this.money_minus = document.getElementById("money-minus");
    this.list = document.getElementById("list");
    this.form = document.getElementById("form");
    this.text = document.getElementById("text");
    this.amount = document.getElementById("amount");
    this.categorySelect = document.getElementById("category");
    this.transactionTypeInputs = document.getElementsByName("transactionType");

    // Load transactions and categories from localStorage
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    this.loadCategories();

    // Initialize app
    this.init();
    this.form.addEventListener("submit", this.addTransaction.bind(this));
  }

  // Load categories from localStorage and populate the select dropdown
  loadCategories() {
    const categories = JSON.parse(localStorage.getItem("categories") || '[]');
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      this.categorySelect.appendChild(option);
    });
  }

  // Add a transaction
  addTransaction(e) {
    e.preventDefault();

    if (this.text.value.trim() === "" || this.amount.value.trim() === "") {
      alert("Please enter text and amount");
      return;
    }

    let amt = Math.abs(+this.amount.value);
    const type = this.getSelectedTransactionType();
    if (type === "expense") amt = -amt;

    const transaction = {
      id: Date.now(),
      text: this.text.value,
      amount: amt,
      category: this.categorySelect.value,
    };

    this.transactions.push(transaction); // Add transaction to array
    this.addTransactionDOM(transaction); // Add it to the DOM
    this.updateValues(); // Update the balance
    this.updateLocalStorage(); // Save transactions to localStorage

    // Reset form fields
    this.text.value = "";
    this.amount.value = "";
  }

  // Add transaction to the DOM
  addTransactionDOM(transaction) {
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
      ${transaction.text} (${transaction.category}) 
      <span>${transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="tracker.removeTransaction(${transaction.id})">x</button>
    `;
    this.list.appendChild(item);
  }

  // Update balance, income, and expense
  updateValues() {
    const amounts = this.transactions.map((t) => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

    this.balance.innerText = `$${total}`;
    this.money_plus.innerText = `+$${income}`;
    this.money_minus.innerText = `-$${expense}`;
  }

  // Get the selected transaction type (income or expense)
  getSelectedTransactionType() {
    for (const input of this.transactionTypeInputs) {
      if (input.checked) return input.value;
    }
    return "expense"; // Default to expense if none selected
  }

  // Remove transaction
  removeTransaction(id) {
    this.transactions = this.transactions.filter((transaction) => transaction.id !== id);
    this.updateLocalStorage();
    this.updateValues();
    this.list.innerHTML = ""; // Re-render list
    this.transactions.forEach(this.addTransactionDOM.bind(this));
  }

  // Update localStorage
  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  // Initialize the app (load transactions and update balance)
  init() {
    this.list.innerHTML = "";
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
  }
}

// Instantiate the tracker
const tracker = new ExpenseTracker();
