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

  
    this.init();


    this.form.addEventListener("submit", this.addTransaction.bind(this));
  }

  // Step 1: Only keep addTransaction active, comment others
  getSelectedTransactionType() {
    for (const input of this.transactionTypeInputs) {
      if (input.checked) return input.value;
    }
    return "expense";
  }

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
      amount: amt
    };

    this.transactions.push(transaction);
    this.addTransactionDOM(transaction);
    this.updateValues();
    this.updateLocalStorage();

    this.text.value = "";
    this.amount.value = "";
  }
  
  // Step 2: Uncomment this to add transaction to DOM
  addTransactionDOM(transaction) {
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
  <span>${transaction.text}</span>
  <span>${transaction.amount < 0 ? "-" : "+"}$${Math.abs(transaction.amount).toFixed(2)}</span>
  <button 
    onclick="tracker.removeTransaction(${transaction.id})" 
    style="
      background-color: #e74c3c;
      border: none;
      color: #fff;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
    "
    onmouseover="this.style.opacity='0.85'" 
    onmouseout="this.style.opacity='1'"
  > × </button>
`;


    this.list.appendChild(item);
  }

  // Step 3: Uncomment to update values
  updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts
      .filter(item => item > 0)
      .reduce((acc, item) => acc + item, 0)
      .toFixed(2);
    const expense = (
      amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    this.balance.innerText = `$${total}`;
    this.money_plus.innerText = `+$${income}`;
    this.money_minus.innerText = `-$${expense}`;
  }
  // Step 4
  removeTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.updateLocalStorage();
    this.init();
  }
  //step 5
  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  init() {
    this.list.innerHTML = "";
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
  }
}

// Initialize the tracker instance globally so delete button onclick works
const tracker = new ExpenseTracker();
