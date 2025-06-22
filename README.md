# Expense Tracker (Vanilla JavaScript)

A simple project to track income and expenses.

## 🔧 Features
- Add income or expense
- Remove transactions
- View total balance, income, and expense
- LocalStorage data persistence
- Add category Page to add a category in each transaction

## 🚀 How to Run
1. Fork and Download the repository.
2. Open `index.html` in your browser.

## 📚 For Students
To contribute:
1. Fork this repo
2. Make your improvements (new features, better UI, charts, etc.)
3. Submit a pull request

## 💡 Bonus Ideas
- Add categories
- Include a chart
- Export transactions

# Hints to Complete the Expense Tracker Project

1. **HTML Structure**  
   - Think about what sections you need: balance, income/expense summary, transaction history, and a form to add new transactions.
   - Use input fields for text and amount, and radio buttons for selecting income or expense.

2. **Getting Elements in JavaScript**  
   - Learn how to select HTML elements using `getElementById` or similar methods.
   - Store references to the elements you will update or read from.

3. **Handling Form Submission**  
   - Prevent the default form action so the page doesn’t reload.
   - Read the values from the input fields and radio buttons when the form is submitted.

4. **Storing Transactions**  
   - Use an array to keep track of all transactions.
   - Each transaction should have a unique id, a description, an amount, and a type (income or expense).

5. **Updating the UI**  
   - When a new transaction is added, update the transaction list in the HTML.
   - Update the balance, income, and expense values.

6. **Persisting Data**  
   - Use `localStorage` to save the transactions array so data stays after refreshing.
   - Load transactions from `localStorage` when the app starts.

7. **Deleting Transactions**  
   - Add a way to remove a transaction (like an "x" button).
   - When a transaction is deleted, update the array, UI, and `localStorage`.

8. **Testing**  
   - Try adding, deleting, and refreshing to make sure everything works as expected.

9. **Styling**  
   - Use CSS to make your app look clean and organized.

10. **Debugging**  
    - Use `console.log()` to check values and understand what your code is doing at each step.

---
Take it step by step
