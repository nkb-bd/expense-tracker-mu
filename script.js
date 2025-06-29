class ExpenseTracker {
constructor() {
    this.$balance = $("#balance");
    this.$moneyPlus = $("#money-plus");
    this.$moneyMinus = $("#money-minus");
    this.$list = $("#list");
    this.$form = $("#form");
    this.$text = $("#text");
    this.$amount = $("#amount");
    this.$category = $("#category");

    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    this.init();
    this.$form.on("submit", this.addTransaction.bind(this));
    this.$list.on("click", ".delete-btn", (e) => {
        const id = +$(e.target).data("id");
        this.removeTransaction(id);
    });
}

    addTransaction(e) {
    e.preventDefault();

    const textVal = this.$text.val().trim();
    const amountVal = this.$amount.val().trim();
    const categoryVal = this.$category.val();
    const typeVal = $("input[name='transactionType']:checked").val();

    if (!textVal || !amountVal || !categoryVal) {
        alert("Please enter text, amount, and select a category");
        return;
    }

    let amt = Math.abs(+amountVal);
    if (typeVal === "expense") amt = -amt;

    const transaction = {
        id: Date.now(),
        text: textVal,
        category: categoryVal,
        amount: amt,
    };

    this.transactions.push(transaction);
    this.addTransactionDOM(transaction);
    this.updateValues();
    this.updateLocalStorage();

    this.$text.val("");
    this.$amount.val("");
    this.$category.prop("selectedIndex", 0);
}

addTransactionDOM(transaction) {
    const typeClass = transaction.amount < 0 ? "minus" : "plus";
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = $(`
    <li class="${typeClass}">
        <div>
            <strong>${transaction.text}</strong> 
            <small style="display:block; font-size: 0.85em; color: #666;">${transaction.category}</small>
        </div>
        <div class="transaction-right">
            <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
            <button class="delete-btn" data-id="${transaction.id}">Delete</button>
        </div>
    </li>
    `);

    this.$list.append(item);
}

updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
    const expense = (
      amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1
    ).toFixed(2);

    this.$balance.text(`$${total}`);
    this.$moneyPlus.text(`+$${income}`);
    this.$moneyMinus.text(`-$${expense}`);
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
    this.$list.html("");
    this.transactions.forEach(t => this.addTransactionDOM(t));
    this.updateValues();
}
}

$(document).ready(function () {
    new ExpenseTracker();
});
