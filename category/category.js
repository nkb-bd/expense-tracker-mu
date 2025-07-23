const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const summary = {};

transactions.forEach(t => {
  if (!summary[t.category]) {
    summary[t.category] = 0;
  }
  summary[t.category] += t.amount;
});

const tbody = document.getElementById("category-summary-body");

for (const category in summary) {
  const row = document.createElement("tr");

  const catCell = document.createElement("td");
  catCell.textContent = category;

  const amtCell = document.createElement("td");
  amtCell.textContent = (summary[category] < 0 ? "-" : "+") + "$" + Math.abs(summary[category].toFixed(2));
  amtCell.className = summary[category] >= 0 ? "income" : "expense";

  row.appendChild(catCell);
  row.appendChild(amtCell);

  tbody.appendChild(row);
}
