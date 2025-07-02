class ExpenseTracker {
  constructor() {
    this.balance = document.getElementById("balance");
    this.money_plus = document.getElementById("money-plus");
    this.money_minus = document.getElementById("money-minus");
    this.list = document.getElementById("list");
    this.form = document.getElementById("form");
    this.text = document.getElementById("text");
    this.amount = document.getElementById("amount");
    this.categorySelect = document.getElementById("category");
    this.transactionTypeInputs = document.getElementsByName("transactionType");
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    this.init();
    this.form.addEventListener("submit", this.addTransaction.bind(this));
  }

  addTransaction(e) {
    e.preventDefault();

    if (
      this.text.value.trim() === "" ||
      this.amount.value.trim() === "" ||
      this.categorySelect.value === ""
    ) {
      alert("Please enter text, amount, and select a category");
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

    this.transactions.push(transaction);
    this.addTransactionDOM(transaction);
    this.updateValues();
    this.updateLocalStorage();

    this.text.value = "";
    this.amount.value = "";
    this.categorySelect.value = "";
  }

  addTransactionDOM(transaction) {
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    const sign = transaction.amount < 0 ? "-" : "+";
    const amountFormatted = `${sign}$${Math.abs(transaction.amount).toFixed(2)}`;

    item.innerHTML = `
      <span class="transaction-text">${transaction.text} <em>(${transaction.category})</em></span>
      <div style="display: flex; align-items: center;">
        <span class="transaction-amount">${amountFormatted}</span>
        <button class="delete-btn" onclick="tracker.removeTransaction(${transaction.id})">&times;</button>
      </div>
    `;

    this.list.appendChild(item);
  }

  updateValues() {
    const amounts = this.transactions.map((t) => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts
      .filter((a) => a > 0)
      .reduce((acc, item) => acc + item, 0)
      .toFixed(2);
    const expense = (
      amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) * -1
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
    this.transactions = this.transactions.filter((t) => t.id !== id);
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

const tracker = new ExpenseTracker();
