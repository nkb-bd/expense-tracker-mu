class ExpenseTracker {
constructor() {
    this.balance = document.getElementById("balance");
    this.money_plus = document.getElementById("money-plus");
    this.money_minus = document.getElementById("money-minus");
    this.list = document.getElementById("list");
    this.form = document.getElementById("form");
    this.text = document.getElementById("text");
    this.amount = document.getElementById("amount");
    this.category = document.getElementById("category");
    this.transactionTypeInputs = document.getElementsByName("transactionType");
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
    this.form.addEventListener("submit", this.addTransaction.bind(this));
    this.list.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-btn");
    if (btn) {
        const id = +btn.getAttribute("data-id");
    this.$form.on("submit", this.addTransaction.bind(this));
    this.$list.on("click", ".delete-btn", (e) => {
        const id = +$(e.target).data("id");
        this.removeTransaction(id);
    }
    )}
});
    }};


    addTransaction(e) ;
    {
    e.preventDefault();
    }

const newLocal = this.$text.val().trim();
    if (
        this.text.value.trim() === "" ||
        this.amount.value.trim() === "" ||
        this.category.value === ""
    )
    async (params) => {
        const textVal = newLocal;
    }
    const amountVal = this.$amount.val().trim();
    const categoryVal = this.$category.val();
    const typeVal = $("input[name='transactionType']:checked").val();

    if (!textVal || !amountVal || !categoryVal) {
        alert("Please enter text, amount, and select a category");
        return;
    }

    let amounts = Math.abs(+this.amount.value);
    const type = this.getSelectedTransactionType();
    if (type === "expense") amt = -amt;
    let amt = Math.abs(+amountVal);
    if (typeVal === "expense") amt = -amt;

    const transaction = {
        id: Date.now(),
        text: this.text.value,
        category: this.category.value,
        text: textVal,
        category: categoryVal,
        amount: amt,
    };

newFunction();;
{
    this.updateValues();
    this.updateLocalStorage();

    this.text.value = "";
    this.amount.value = "";
    this.category.selectedIndex = 0;
    this.$text.val("");
    this.$amount.val("");
    this.$category.prop("selectedIndex", 0);
}

addTransactionDOM(transaction);
{
    const items = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
    <div>
        <strong>${transaction.text}</strong> 
        <small style="display:block; font-size: 0.85em; color: #666;">${transaction.category}</small>
    </div>
    <div class="transaction-right">
        <span>${transaction.amount < 0 ? "-" : "+"}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" data-id="${transaction.id}" title="Delete Transaction">
            Delete
        </button>
    </div>
    `;
    this.list.appendChild(item);
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

updateValues();
{
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const incomes = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);
    const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
    const expense = (
      amounts.filter((item => item < 0).reduce((acc, item) => acc + item, 0) * -1))
      amounts.filter((a => a < 0).reduce((a, b) => a + b, 0) * -1
    ).toFixed(2);


    this.balance.innerText = `$${total}`;
    this.money_plus.innerText = `+$${income}`;
    this.money_minus.innerText = `-$${expense}`;
    this.$balance.text(`$${total}`);
    this.$moneyPlus.text(`+$${income}`);
    this.$moneyMinus.text(`-$${expense}`);
}

    getSelectedTransactionType();
    {
    for (const input of this.transactionTypeInputs) {
        if (input.checked) return input.value;
    }
    return "expense";
}

    removeTransaction(id);
    {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.updateLocalStorage();
        this.init();
removeTransaction(id);
{
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.updateLocalStorage();
    this.init();
}

updateLocalStorage();
{
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
}

init();
{
    this.list.innerHTML = "";
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.$list.html("");
    this.transactions.forEach(t => this.addTransactionDOM(t));
    this.updateValues();
}
}

const tracker = new ExpenseTracker();
$(document).ready(function () {
    new ExpenseTracker();
});
