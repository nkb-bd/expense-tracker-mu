
// ---------- Category Storage ----------
function getCategories() {
  try {
    const raw = localStorage.getItem('categories');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function setCategories(cats) {
  localStorage.setItem('categories', JSON.stringify(cats));
}
function ensureDefaultCategories() {
  const existing = getCategories();
  if (existing.length === 0) {
    setCategories(['General', 'Food', 'Transport', 'Shopping', 'Salary']);
  }
}

// ---------- Expense Tracker ----------
class ExpenseTracker {
  constructor() {

    this.balance = document.getElementById("balance");
    this.money_plus = document.getElementById("money-plus");
    this.money_minus = document.getElementById("money-minus");
    this.list = document.getElementById("list");
    this.empty = document.getElementById("empty");
    this.form = document.getElementById("form");
    this.text = document.getElementById("text");
    this.amount = document.getElementById("amount");
    this.transactionTypeInputs = document.getElementsByName("transactionType");
    this.categorySelect = document.getElementById("category");

    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];


    ensureDefaultCategories();
    this.populateCategoryDropdown();


    if (this.form) {
      this.form.addEventListener("submit", this.addTransaction.bind(this));
    }

 
    this.init();
  }

  getCategories(){ return getCategories(); }

  populateCategoryDropdown() {
    if (!this.categorySelect) return;
    const categories = this.getCategories();
    this.categorySelect.innerHTML = "";
    for (const cat of categories) {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      this.categorySelect.appendChild(opt);
    }
  }

  refreshInlineCategorySelects() {
    if (!this.list) return;
    const categories = this.getCategories();
    this.list.querySelectorAll("select.category-inline").forEach(select => {
      const current = select.value;
      select.innerHTML = "";
      for (const cat of categories) {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
      }
      select.value = categories.includes(current) ? current : "General";
      select.dispatchEvent(new Event('change'));
    });
  }

  getSelectedTransactionType() {
    for (const input of this.transactionTypeInputs) {
      if (input.checked) return input.value;
    }
    return "expense";
  }

  addTransaction(e) {
    e.preventDefault();

    const text = this.text.value.trim();
    const amountVal = this.amount.value.trim();
    const category = (this.categorySelect?.value || "General").trim();

    if (text === "" || amountVal === "") {
      alert("Please enter text and amount");
      return;
    }

    let amt = Math.abs(+amountVal);
    const type = this.getSelectedTransactionType();
    if (type === "expense") amt = -amt;

    const transaction = {
      id: Date.now(),
      text,
      amount: amt,
      category
    };

    this.transactions.push(transaction);
    this.updateLocalStorage();
    this.addTransactionDOM(transaction);
    this.updateValues();


    this.text.value = "";
    this.amount.value = "";
    if (this.categorySelect) this.categorySelect.value = category;
  }

  addTransactionDOM(transaction) {
    if (!this.list) return;
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.dataset.id = String(transaction.id);


    const left = document.createElement("div");
    left.className = "left";

    const title = document.createElement("span");
    title.className = "title";
    title.textContent = transaction.text;

    const catWrap = document.createElement("div");
    catWrap.className = "cat-wrap";

    const catBadge = document.createElement("span");
    catBadge.className = "category-badge";
    catBadge.textContent = transaction.category;

    const catSelect = document.createElement("select");
    catSelect.className = "category-inline";
    for (const cat of this.getCategories()) {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    }
    catSelect.value = transaction.category;
    catSelect.addEventListener("change", () => {
      transaction.category = catSelect.value;
      catBadge.textContent = transaction.category;
      this.updateLocalStorage();
    });

    catWrap.appendChild(catBadge);
    catWrap.appendChild(catSelect);

    left.appendChild(title);
    left.appendChild(catWrap);

  
    const right = document.createElement("div");
    right.className = "right";

    const amount = document.createElement("span");
    amount.className = "amount";
    amount.textContent = `${sign}$${Math.abs(transaction.amount).toFixed(2)}`;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.setAttribute("aria-label", "Remove transaction");
    del.innerHTML = "✕";
    del.addEventListener("click", () => this.removeTransaction(transaction.id));

    right.appendChild(amount);
    right.appendChild(del);

    item.appendChild(left);
    item.appendChild(right);

    this.list.appendChild(item);
  }

  updateValues() {
    const amounts = this.transactions.map((t) => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0);
    const income = amounts.filter((item) => item > 0).reduce((acc, item) => acc + item, 0);
    const expense = amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0);

    if (this.balance) this.balance.textContent = `$${total.toFixed(2)}`;
    if (this.money_plus) this.money_plus.textContent = `+$${income.toFixed(2)}`;
    if (this.money_minus) this.money_minus.textContent = `-$${Math.abs(expense).toFixed(2)}`;


    if (this.empty) this.empty.hidden = this.transactions.length !== 0;
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
    if (this.list) this.list.innerHTML = "";
    this.transactions.forEach((t) => this.addTransactionDOM(t));
    this.updateValues();
  }
}


let catListEl, catForm, catName;

function bindCategoryDom() {
  catListEl = document.getElementById('cat-list');
  catForm = document.getElementById('cat-form');
  catName = document.getElementById('cat-name');
}

function renderCategories() {
  ensureDefaultCategories();
  if (!catListEl) return;
  const cats = getCategories();
  catListEl.innerHTML = '';
  cats.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${cat}</span>
      <span><button class="delete-btn" data-cat="${cat}" title="Delete">✕</button></span>
    `;
    catListEl.appendChild(li);
  });

  catListEl.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      removeCategory(cat);
    });
  });

  if (window.expenseApp) {
    window.expenseApp.populateCategoryDropdown();
    window.expenseApp.refreshInlineCategorySelects();
    window.expenseApp.init();
  }
}

function removeCategory(cat) {
  if (cat === 'General') {
    alert('Cannot delete the default "General" category.');
    return;
  }
  if (!confirm(`Delete "${cat}"? Transactions will be moved to "General".`)) {
    return;
  }

  const updatedCats = getCategories().filter(c => c !== cat);
  setCategories(updatedCats);

  const tx = JSON.parse(localStorage.getItem('transactions')) || [];
  tx.forEach(t => { if (t.category === cat) t.category = 'General'; });
  localStorage.setItem('transactions', JSON.stringify(tx));

  renderCategories();
}

document.addEventListener("DOMContentLoaded", () => {
  ensureDefaultCategories();


  const form = document.getElementById('form');
  if (form) {
    window.expenseApp = new ExpenseTracker();
  }


  bindCategoryDom();
  if (catForm) {
    catForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = catName.value.trim();

      if (!name) { alert('Category name cannot be empty.'); return; }

      const cats = getCategories();
      if (cats.some(c => c.toLowerCase() === name.toLowerCase())) {
        alert('Category already exists.');
        return;
      }

      cats.push(name);
      setCategories(cats);
      catName.value = '';
      renderCategories();
    });
  }
  if (document.getElementById('view-categories')) {
    renderCategories();
  }
});
