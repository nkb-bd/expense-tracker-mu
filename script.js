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
    this.categoryInput = document.getElementById("category");
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    this.init();
    this.form.addEventListener("submit", this.addTransaction.bind(this));
  }

  addTransaction(e) {
    e.preventDefault();

    const textValue = this.text.value.trim();
    const amountValue = this.amount.value.trim();
    const categoryValue = this.categoryInput.value;

    if (textValue === "" || amountValue === "" || isNaN(amountValue)) {
      alert("Please enter valid text and amount.");
      return;
    }

    if (categoryValue === "Category") {
      alert("Please select a valid category");
      return;
    }

    let amt = Math.abs(+amountValue);
    const type = this.getSelectedTransactionType();
    if (type === "expense") amt = -amt;

    const transaction = {
      id: Date.now(),
      text: textValue,
      amount: amt,
      category: categoryValue,
    };

    this.transactions.push(transaction);
    this.addTransactionDOM(transaction);
    this.updateValues();
    this.updateLocalStorage();

    this.text.value = "";
    this.amount.value = "";
    this.categoryInput.value = "Category";
  }

  addTransactionDOM(transaction) {
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
      ${transaction.text} <span>(${transaction.category})</span>
      <span>${transaction.amount < 0 ? "-" : "+"}$${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="tracker.removeTransaction(${transaction.id})">x</button>
    `;
    this.list.appendChild(item);
  }

  updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts
      .filter(item => item > 0)
      .reduce((acc, item) => acc + item, 0)
      .toFixed(2);
    const expense = (
      amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    this.balance.innerText = `$${total}`;
    this.money_plus.innerText = `+$${income}`;
    this.money_minus.innerText = `-$${expense}`;
  }

  getSelectedTransactionType() {
    for (const input of this.transactionTypeInputs) {
      if (input.checked) return input.value;
    }
    return "expense";
  }

  removeTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.updateLocalStorage();
    this.init();
  }

  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  init() {
    this.list.innerHTML = "";
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
  }
}

// Global tracker instance for delete button access
const tracker = new ExpenseTracker();