class ExpenseTracker {
  constructor() {
    this.balance = document.getElementById("balance");
    this.money_plus = document.getElementById("money-plus");
    this.money_minus = document.getElementById("money-minus");
    this.list = document.getElementById("list");
    this.form = document.getElementById("form");
    this.text = document.getElementById("text");
    this.amount = document.getElementById("amount");
    this.transactionTypeInputs = document.getElementsByName("transactionType");
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Initialize the app
   this.init();

    // Add event listener for form submission
   this.form.addEventListener("submit", this.addTransaction.bind(this));
  }

  // Step 1: Only keep addTransaction active, comment others

  addTransaction(event) {
    event.preventDefault();

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
    };

    // Add transaction to the array
   this.transactions.push(transaction);
    
    // Add transaction to DOM
   this.addTransactionDOM(transaction);
    
    // Update values
   this.updateValues();
    
    // Update localStorage
    this.updateLocalStorage();
    
    // Clear form
    this.text.value = "";
    this.amount.value = "";
  }

  // Step 2: Uncomment this to add transaction to DOM
  addTransactionDOM(transaction) {
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
      ${transaction.text} <span>${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
      <button class="delete-btn" onclick="tracker.removeTransaction(${transaction.id})">x</button>
    `;
    this.list.appendChild(item);
  }

  // Step 3: Uncomment to update values
  updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    
    // Calculate income and expense
    const income = amounts.filter(amount => amount > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = Math.abs(amounts.filter(amount => amount < 0).reduce((acc, item) => acc + item, 0)).toFixed(2);
    
    // Update the DOM elements
    this.balance.innerText = `$${total}`;
    this.money_plus.innerText = `+$${income}`;
    this.money_minus.innerText = `-$${expense}`;
  }

  // Step 4: Uncomment to get selected transaction type
  getSelectedTransactionType() {
    for (const input of this.transactionTypeInputs) {
      if (input.checked) return input.value;
    }
    return "expense"; // default
  }

  // Step 5: Uncomment to remove transaction
  removeTransaction(id) {
    this.transactions = this.transactions.filter(transaction => transaction.id !== id);
    this.updateLocalStorage();
    this.init();
  }

  // Step 6: Uncomment to update local storage
  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  // Step 7: Uncomment to initialize
  init() {
    this.list.innerHTML = "";
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
  }
}

// Create instance of ExpenseTracker
const tracker = new ExpenseTracker();
