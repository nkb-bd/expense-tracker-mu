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
  
      this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  
      this.addTransaction = this.addTransaction.bind(this);
      this.removeTransaction = this.removeTransaction.bind(this);
  
      this.init();
      this.form.addEventListener("submit", this.addTransaction);
    }
  
    init() {
      this.list.innerHTML = "";
      this.transactions.forEach(this.addTransactionDOM.bind(this));
      this.updateValues();
    }
  
    addTransaction(e) {
      e.preventDefault();
  
      const text = this.text.value.trim();
      const amountValue = this.amount.value.trim();
      const category = this.category.value;
  
      if (text === "" || amountValue === "" || isNaN(amountValue) || Number(amountValue) === 0) {
        alert("Please enter a valid text and non-zero amount.");
        return;
      }
  
      const amount = Number(amountValue);
      const type = document.querySelector('input[name="transactionType"]:checked').value;
      const signedAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);
  
      const transaction = {
        id: Date.now(),
        text,
        amount: signedAmount,
        category
      };
  
      this.transactions.push(transaction);
      this.updateLocalStorage();
      this.addTransactionDOM(transaction);
      this.updateValues();
  
      this.text.value = "";
      this.amount.value = "";
    }
  
    addTransactionDOM(transaction) {
      const sign = transaction.amount < 0 ? "-" : "+";
  
      const item = document.createElement("li");
      item.classList.add(transaction.amount < 0 ? "minus" : "plus");
      item.innerHTML = `
        ${transaction.text} <em>(${transaction.category})</em>
        <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="tracker.removeTransaction(${transaction.id})">x</button>
      `;
  
      this.list.appendChild(item);
    }
  
    updateValues() {
      const amounts = this.transactions.map(t => t.amount);
      const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
      const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
      const expense = (amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0) * -1).toFixed(2);
  
      this.balance.innerText = `$${total}`;
      this.money_plus.innerText = `+$${income}`;
      this.money_minus.innerText = `-$${expense}`;
    }
  
    removeTransaction(id) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.updateLocalStorage();
      this.init();
    }
  
    updateLocalStorage() {
      localStorage.setItem("transactions", JSON.stringify(this.transactions));
    }
  }
  
  const tracker = new ExpenseTracker();
  