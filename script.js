class ExpenseTracker {
    constructor() {
      // UI Elements
      this.balance = document.getElementById("balance");
      this.money_plus = document.getElementById("money-plus");
      this.money_minus = document.getElementById("money-minus");
      this.list = document.getElementById("list");
      this.form = document.getElementById("form");
      this.text = document.getElementById("text");
      this.amount = document.getElementById("amount");
      this.transactionTypeInputs = document.getElementsByName("transactionType");
      this.categorySelect = document.getElementById("category");
  
      // Data from localStorage
      this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  
      // Event Listener for form submission
      this.form.addEventListener("submit", this.addTransaction.bind(this));
  
      // Initialize app
      this.init();
    }
  
    init() {
      this.list.innerHTML = '';
      this.transactions.forEach(this.addTransactionDOM.bind(this));
      this.updateValues();
    }
  
    addTransaction(e) {
      e.preventDefault();
  
      const text = this.text.value.trim();
      const amount = parseFloat(this.amount.value);
      const type = this.getSelectedTransactionType();
      const category = this.categorySelect.value;
  
      if (text === "" || isNaN(amount)) {
        alert("Please enter valid text and amount.");
        return;
      }
  
      const transaction = {
        id: Date.now(),
        text,
        amount: type === "expense" ? -amount : amount,
        category
      };
  
      this.transactions.push(transaction);
      this.addTransactionDOM(transaction);
      this.updateValues();
      this.updateLocalStorage();
    }
  
    addTransactionDOM(transaction) {
      const item = document.createElement("li");
      item.classList.add(transaction.amount < 0 ? "minus" : "plus");
      item.innerHTML = `${transaction.text} <span>${transaction.amount < 0 ? "-" : "+"}$${Math.abs(transaction.amount).toFixed(2)}</span> <span class="category">${transaction.category}</span><button class="delete-btn" onclick="tracker.removeTransaction(${transaction.id})">x</button>`;
      this.list.appendChild(item);
    }
  
    removeTransaction(id) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.updateLocalStorage();
      this.updateValues();
      this.init();
    }
  
    getSelectedTransactionType() {
      for (const input of this.transactionTypeInputs) {
        if (input.checked) return input.value;
      }
      return "expense"; // Default to "expense"
    }
  
    updateValues() {
      const amounts = this.transactions.map(t => t.amount);
      const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
      const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
      const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);
  
      this.balance.textContent = `$${total}`;
      this.money_plus.textContent = `+$${income}`;
      this.money_minus.textContent = `-$${expense}`;
    }
  
    updateLocalStorage() {
      localStorage.setItem("transactions", JSON.stringify(this.transactions));
    }
  }
  
  // Initialize the app
  const tracker = new ExpenseTracker();
  