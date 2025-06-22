class ExpenseTracker {
  constructor() {
    // UI Elements
    this.$balance = $("#balance");
    this.$money_plus = $("#money-plus");
    this.$money_minus = $("#money-minus");
    this.$list = $("#list");
    this.$form = $("#form");
    this.$text = $("#text");
    this.$amount = $("#amount");
    this.$transactionTypeInputs = $("input[name='transactionType']");
    this.$categorySelect = $("#category");

    // Load transactions from localStorage
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Event Listener
    this.$form.on("submit", this.addTransaction.bind(this));

    // Initialize
    this.init();
  }

  init() {
    this.$list.empty();
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
  }

  addTransaction(e) {
    e.preventDefault();

    const text = this.$text.val().trim();
    const amount = parseFloat(this.$amount.val());
    const type = this.getSelectedTransactionType();
    const category = this.$categorySelect.val();

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

    // Clear form
    this.$text.val("");
    this.$amount.val("");
  }

  addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const absAmount = Math.abs(transaction.amount).toFixed(2);
    const liClass = transaction.amount < 0 ? "minus" : "plus";

    const $item = $(`
      <li class="${liClass}">
        ${transaction.text}
        <span>${sign}$${absAmount}</span>
        <span class="category">${transaction.category}</span>
        <button class="delete-btn" data-id="${transaction.id}">x</button>
      </li>
    `);

    $item.find(".delete-btn").on("click", () => this.removeTransaction(transaction.id));
    this.$list.append($item);
  }

  removeTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.updateLocalStorage();
    this.init();
  }

  getSelectedTransactionType() {
    return this.$transactionTypeInputs.filter(":checked").val() || "expense";
  }

  updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = Math.abs(amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0)).toFixed(2);

    this.$balance.text(`$${total}`);
    this.$money_plus.text(`+$${income}`);
    this.$money_minus.text(`-$${expense}`);
  }

  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }
}

// Initialize app on DOM ready
$(document).ready(() => {
  window.tracker = new ExpenseTracker();
});
