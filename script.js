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

    // Event listener for removing items (event delegation)
    this.list.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = +e.target.getAttribute("data-id");
        this.removeTransaction(id);
      }
    });
  }

  addTransaction(event) {
    event.preventDefault();

    const textValue = this.text.value.trim();
    const amountValue = this.amount.value.trim();

    if (textValue === "" || amountValue === "") {
      alert("Please enter text and amount");
      return;
    }

    let amt = Math.abs(+amountValue);
    const type = this.getSelectedTransactionType();
    if (type === "expense") amt = -amt;

    const transaction = {
      id: Date.now(),
      text: textValue,
      amount: amt,
    };

    this.transactions.push(transaction);
    this.addTransactionDOM(transaction);
    this.updateValues();
    this.updateLocalStorage();

    this.text.value = "";
    this.amount.value = "";
  }

  addTransactionDOM(transaction) {
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
  <span class="text">${transaction.text}</span>
  <span class="amount">${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
  <button class="delete-btn" data-id="${transaction.id}">x</button>
`;

    this.list.appendChild(item);
  }

  updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);

    const income = amounts
      .filter(val => val > 0)
      .reduce((acc, val) => acc + val, 0)
      .toFixed(2);

    const expense = Math.abs(
      amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0)
    ).toFixed(2);

    this.balance.innerText = `$${total}`;
    this.money_plus.innerText = `+$${income}`;
    this.money_minus.innerText = `-$${expense}`;
  }

  getSelectedTransactionType() {
    for (const input of this.transactionTypeInputs) {
      if (input.checked) {
        return input.value;
      }
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

// Create instance of ExpenseTracker
const tracker = new ExpenseTracker();
