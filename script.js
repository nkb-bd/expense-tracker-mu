class ExpenseTracker {
  constructor() {
    this.balance = $("#balance");
    this.money_plus = $("#money-plus");
    this.money_minus = $("#money-minus");
    this.list = $("#list");
    this.form = $("#form");
    this.text = $("#text");
    this.amount = $("#amount");
    this.transactionTypeInputs = $("input[name='transactionType']");
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];


    this.init();

    
    this.form.on("submit", (e) => this.addTransaction(e));
  }

  
  addTransaction(e) {
    e.preventDefault();

    if (this.text.val().trim() === "" || this.amount.val().trim() === "") {
      alert("Please enter text and amount");
      return;
    }

    let amt = Math.abs(+this.amount.val());
    const type = this.getSelectedTransactionType();
    if (type === "expense") amt = -amt;

    const transaction = {
      id: Date.now(),
      text: this.text.val(),
      amount: amt,
    };

    
    this.transactions.push(transaction);

    
    this.addTransactionDOM(transaction);

    
    this.updateValues();
    this.updateLocalStorage();

    
    this.text.val('');
    this.amount.val('');
  }

  
  addTransactionDOM(transaction) {
    const item = $("<li>").addClass(transaction.amount < 0 ? "minus" : "plus");
    item.html(`
      ${transaction.text} <span>${transaction.amount}</span>
      <button class="delete-btn" data-id="${transaction.id}">x</button>
    `);
    this.list.append(item);
    
    
    item.find(".delete-btn").on("click", (e) => this.removeTransaction($(e.target).data("id")));
  }

 
  updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0).toFixed(2);

    
    this.balance.text(`$${total}`);
    this.money_plus.text(`$${income}`);
    this.money_minus.text(`$${expense}`);
  }

  
  getSelectedTransactionType() {
    let selectedType = "expense"; // default
    this.transactionTypeInputs.each(function() {
      if ($(this).prop("checked")) {
        selectedType = $(this).val();
        return false; // break loop
      }
    });
    return selectedType;
  }

  
  removeTransaction(id) {
    
    this.transactions = this.transactions.filter(transaction => transaction.id !== id);

    
    this.list.empty();
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();

   
    this.updateLocalStorage();
  }

  
  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  
  init() {
    this.list.empty();
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
  }
}


