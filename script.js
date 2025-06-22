class ExpenseTracker {
    constructor() {
      this.$balance = $("#balance");
      this.$money_plus = $("#money-plus");
      this.$money_minus = $("#money-minus");
      this.$list = $("#list");
      this.$form = $("#form");
      this.$text = $("#text");
      this.$amount = $("#amount");
      this.$transactionTypeInputs = $("input[name='transactionType']");
  
      this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  
      this.$form.on("submit", this.addTransaction.bind(this));
      this.$list.on("click", ".delete-btn", (e) => {
        const id = parseInt($(e.target).data("id"));
        this.removeTransaction(id);
      });
  
      this.init();
    }
  
    getSelectedTransactionType() {
      return this.$transactionTypeInputs.filter(":checked").val();
    }
  
    addTransaction(e) {
      e.preventDefault();
  
      const text = this.$text.val().trim();
      const amountVal = this.$amount.val().trim();
      const type = this.getSelectedTransactionType();
  
      if (!text || !amountVal) {
        alert("Please enter text and amount");
        return;
      }
  
      let amount = Math.abs(parseFloat(amountVal));
      if (type === "expense") amount = -amount;
  
      const transaction = {
        id: Date.now(),
        text,
        amount
      };
  
      this.transactions.push(transaction);
      this.updateLocalStorage();
      this.init();
  
      this.$text.val("");
      this.$amount.val("");
    }
  
    addTransactionDOM(transaction) {
      const sign = transaction.amount < 0 ? "-" : "+";
      const className = transaction.amount < 0 ? "minus" : "plus";
  
      const $item = $(`
        <li class="${className}">
          ${transaction.text} 
          <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
          <span class="delete-btn" data-id="${transaction.id}">x</span>
        </li>
      `);
  
      this.$list.append($item);
    }
  
    updateValues() {
      const amounts = this.transactions.map(t => t.amount);
      const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
      const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
      const expense = Math.abs(amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0)).toFixed(2);
  
      this.$balance.text(`$${total}`);
      this.$money_plus.text(`+$${income}`);
      this.$money_minus.text(`-$${expense}`);
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
      this.$list.empty();
      this.transactions.forEach(t => this.addTransactionDOM(t));
      this.updateValues();
    }
  }
  
  const tracker = new ExpenseTracker();
  
