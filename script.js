class ExpenseTracker {
  constructor() {
    this.$balance = $("#balance");
    this.$money_plus = $("#money-plus");
    this.$money_minus = $("#money-minus");
    this.$list = $("#list");
    this.$form = $("#form");
    this.$text = $("#text");
    this.$amount = $("#amount");
    this.$category = $("#category");
    this.$transactionTypeInputs = $("input[name='transactionType']");

    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    this.init();
    this.$form.on("submit", this.addTransaction.bind(this));
  }

  addTransaction(e) {
    e.preventDefault();

    if (
      this.$text.val().trim() === "" ||
      this.$amount.val().trim() === "" ||
      this.$category.val() === null ||
      this.$category.val() === ""
    ) {
      alert("Please enter text, amount, and category");
      return;
    }

    let amt = Math.abs(+this.$amount.val());
    const type = this.getSelectedTransactionType();
    if (type === "expense") amt = -amt;

    const transaction = {
      id: Date.now(),
      text: this.$text.val().trim(),
      amount: amt,
      category: this.$category.val().trim(),
    };

    this.transactions.push(transaction);
    this.addTransactionDOM(transaction);
    this.updateValues();
    this.updateLocalStorage();

    // Clear inputs
    this.$text.val("");
    this.$amount.val("");
    this.$category.val("");
  }

  addTransactionDOM(transaction) {
    const itemClass = transaction.amount < 0 ? "minus" : "plus";
    const sign = transaction.amount < 0 ? "-" : "+";
    const amount = Math.abs(transaction.amount).toFixed(2);

    const $item = $(`
      <li class="${itemClass}">
        <div>
          <strong>${transaction.text}</strong> 
          <span class="category">(${transaction.category})</span>
        </div>
        <span>${sign}$${amount}</span>
        <button class="delete-btn">x</button>
      </li>
    `);

    $item.find(".delete-btn").on("click", () => this.removeTransaction(transaction.id));
    this.$list.append($item);
  }

  updateValues() {
    const amounts = this.transactions.map((t) => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => acc + item, 0)
      .toFixed(2);
    const expense = (
      amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    this.$balance.text(`$${total}`);
    this.$money_plus.text(`+$${income}`);
    this.$money_minus.text(`-$${expense}`);
  }

  getSelectedTransactionType() {
    return this.$transactionTypeInputs.filter(":checked").val() || "expense";
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
    this.$list.empty();
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
  }
}

$(document).ready(function () {
  window.tracker = new ExpenseTracker();
});
