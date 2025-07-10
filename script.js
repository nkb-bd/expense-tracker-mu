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
    this.categoryForm = document.getElementById("category-form");
    this.categoryName = document.getElementById("category-name");
    this.categoryTypeInputs = document.getElementsByName("categoryType");
    this.incomeCategories = document.getElementById("income-categories");
    this.expenseCategories = document.getElementById("expense-categories");
    
    // Load data from localStorage
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    this.categories = JSON.parse(localStorage.getItem("categories")) || this.getDefaultCategories();
    
    this.init();
    this.setupEventListeners();
  }

  getDefaultCategories() {
    return [
      { id: 1, name: "Salary", type: "income" },
      { id: 2, name: "Freelance", type: "income" },
      { id: 3, name: "Investment", type: "income" },
      { id: 4, name: "Food", type: "expense" },
      { id: 5, name: "Transportation", type: "expense" },
      { id: 6, name: "Entertainment", type: "expense" },
      { id: 7, name: "Shopping", type: "expense" },
      { id: 8, name: "Bills", type: "expense" }
    ];
  }

  setupEventListeners() {
    // Form submission
    this.form.addEventListener("submit", this.addTransaction.bind(this));
    
    // Category form submission
    this.categoryForm.addEventListener("submit", this.addCategory.bind(this));
    
    // Transaction type change
    this.transactionTypeInputs.forEach(input => {
      input.addEventListener("change", this.updateCategoryOptions.bind(this));
    });
    
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', this.switchTab.bind(this));
    });
    
    // Delete transaction
    this.list.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        this.removeTransaction(parseInt(e.target.dataset.id));
      }
    });
    
    // Delete category
    this.incomeCategories.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-delete-btn')) {
        this.removeCategory(parseInt(e.target.dataset.id));
      }
    });
    
    this.expenseCategories.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-delete-btn')) {
        this.removeCategory(parseInt(e.target.dataset.id));
      }
    });
  }

  switchTab(e) {
    const targetTab = e.target.dataset.tab;
    
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Show target content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(targetTab).classList.add('active');
    
    // Update categories display if switching to categories tab
    if (targetTab === 'categories') {
      this.updateCategoriesDisplay();
    }
  }

  addTransaction(e) {
    e.preventDefault();

    if (this.text.value.trim() === "" || this.amount.value.trim() === "" || this.category.value === "") {
      alert("Please fill in all fields including category");
      return;
    }

    let amt = Math.abs(+this.amount.value);
    const type = this.getSelectedTransactionType();
    if (type === "expense") amt = -amt;

    const transaction = {
      id: Date.now(),
      text: this.text.value,
      amount: amt,
      categoryId: parseInt(this.category.value),
      type: type
    };

    this.transactions.push(transaction);
    this.addTransactionDOM(transaction);
    this.updateValues();
    this.updateLocalStorage();
    
    // Clear form
    this.text.value = "";
    this.amount.value = "";
    this.category.value = "";
  }

  addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const category = this.categories.find(cat => cat.id === transaction.categoryId);
    const categoryName = category ? category.name : "Unknown";
    
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
      <div class="transaction-info">
        <div>${transaction.text}</div>
        <div class="transaction-category">${categoryName}</div>
      </div>
      <div>
        ${sign}$${Math.abs(transaction.amount).toFixed(2)}
        <button class="delete-btn" data-id="${transaction.id}">×</button>
      </div>
    `;
    this.list.appendChild(item);
  }

  updateValues() {
    const amounts = this.transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts
      .filter(item => item > 0)
      .reduce((acc, item) => acc + item, 0)
      .toFixed(2);
    const expense = (amounts
      .filter(item => item < 0)
      .reduce((acc, item) => acc + item, 0) * -1)
      .toFixed(2);

    this.balance.innerText = `$${total}`;
    this.money_plus.innerText = `+$${income}`;
    this.money_minus.innerText = `-$${expense}`;
  }

  getSelectedTransactionType() {
    for (const input of this.transactionTypeInputs) {
      if (input.checked) return input.value;
    }
    return "expense"; // default
  }

  getSelectedCategoryType() {
    for (const input of this.categoryTypeInputs) {
      if (input.checked) return input.value;
    }
    return "expense"; // default
  }

  removeTransaction(id) {
    this.transactions = this.transactions.filter(transaction => transaction.id !== id);
    this.updateLocalStorage();
    this.init();
  }

  updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
    localStorage.setItem("categories", JSON.stringify(this.categories));
  }

  updateCategoryOptions() {
    const selectedType = this.getSelectedTransactionType();
    const filteredCategories = this.categories.filter(cat => cat.type === selectedType);
    
    this.category.innerHTML = '<option value="">Select Category</option>';
    filteredCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      this.category.appendChild(option);
    });
  }

  addCategory(e) {
    e.preventDefault();
    
    const name = this.categoryName.value.trim();
    const type = this.getSelectedCategoryType();
    
    if (name === "") {
      alert("Please enter a category name");
      return;
    }
    
    // Check if category already exists
    const exists = this.categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && cat.type === type
    );
    
    if (exists) {
      alert("This category already exists!");
      return;
    }
    
    const category = {
      id: Date.now(),
      name: name,
      type: type
    };
    
    this.categories.push(category);
    this.updateLocalStorage();
    this.updateCategoriesDisplay();
    this.updateCategoryOptions();
    
    // Clear form
    this.categoryName.value = "";
  }

  removeCategory(id) {
    // Check if category is being used
    const isUsed = this.transactions.some(transaction => transaction.categoryId === id);
    
    if (isUsed) {
      alert("Cannot delete this category as it is being used in transactions!");
      return;
    }
    
    if (confirm("Are you sure you want to delete this category?")) {
      this.categories = this.categories.filter(category => category.id !== id);
      this.updateLocalStorage();
      this.updateCategoriesDisplay();
      this.updateCategoryOptions();
    }
  }

  updateCategoriesDisplay() {
    this.incomeCategories.innerHTML = "";
    this.expenseCategories.innerHTML = "";
    
    this.categories.forEach(category => {
      const li = document.createElement('li');
      li.classList.add(`${category.type}-category`);
      li.innerHTML = `
        <span>${category.name}</span>
        <button class="category-delete-btn" data-id="${category.id}">Delete</button>
      `;
      
      if (category.type === 'income') {
        this.incomeCategories.appendChild(li);
      } else {
        this.expenseCategories.appendChild(li);
      }
    });
  }

  init() {
    this.list.innerHTML = "";
    this.transactions.forEach(this.addTransactionDOM.bind(this));
    this.updateValues();
    this.updateCategoryOptions();
    this.updateCategoriesDisplay();
  }
}

// Initialize the expense tracker
const tracker = new ExpenseTracker();