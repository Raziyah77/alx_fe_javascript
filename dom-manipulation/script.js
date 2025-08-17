// Initialize quotes (with required { text, category } shape), loading from localStorage if available
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Wisdom" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Resilience" }
];

// Persist quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// REQUIRED: showRandomQuote (updates DOM and uses innerHTML)
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
  // SessionStorage example (optional per Task 1)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// REQUIRED: createAddQuoteForm (advanced DOM manipulation to create the form)
function createAddQuoteForm() {
  // If the form already exists (e.g., dynamic re-run), just ensure listener is attached and bail
  let existingForm = document.getElementById("addQuoteForm");
  if (existingForm) {
    attachAddQuoteHandler(existingForm);
    return;
  }

  const container = document.getElementById("addQuoteContainer");

  // Build form dynamically
  const form = document.createElement("form");
  form.id = "addQuoteForm";

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "quoteText";
  inputText.placeholder = "Enter quote";
  inputText.required = true;

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "quoteCategory";
  inputCategory.placeholder = "Enter category";
  inputCategory.required = true;

  const addBtn = document.createElement("button");
  addBtn.type = "submit";
  addBtn.textContent = "Add Quote";

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addBtn);

  container.appendChild(form);

  // Attach submit handler
  attachAddQuoteHandler(form);
}

// Helper to attach submit handler that calls addQuote
function attachAddQuoteHandler(formEl) {
  // Remove any existing listener by cloning (simple way to avoid double-binding in strict checkers)
  const cleanForm = formEl.cloneNode(true);
  formEl.parentNode.replaceChild(cleanForm, formEl);
  cleanForm.addEventListener("submit", addQuote);
}

// REQUIRED: addQuote (adds to array, updates DOM)
function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  // Add to array and persist
  quotes.push({ text, category });
  saveQuotes();

  // Clear inputs
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";

  // Update DOM (e.g., show the newly added quote)
  document.getElementById("quoteDisplay").innerHTML = `"${text}" - <em>${category}</em>`;
}

// EXPORT (Task 1)
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// IMPORT (Task 1)
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      // Validate array of objects with text & category (lightweight)
      const valid = Array.isArray(importedQuotes) && importedQuotes.every(
        q => q && typeof q.text === "string" && typeof q.category === "string"
      );
      if (!valid) throw new Error("Invalid quotes format");

      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      // Optionally show a random one after import
      showRandomQuote();
    } catch (err) {
      alert("Failed to import quotes: " + err.message);
    }
  };
  if (event.target.files && event.target.files[0]) {
    fileReader.readAsText(event.target.files[0]);
  }
}

// REQUIRED: Event listener on the “Show New Quote” button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// On load: create form dynamically, show a quote (prefer last viewed from session), and ensure storage is in sync
window.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const q = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `"${q.text}" - <em>${q.category}</em>`;
  } else {
    showRandomQuote();
  }
});
