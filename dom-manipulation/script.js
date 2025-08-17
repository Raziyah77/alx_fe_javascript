// Quotes array with text and category properties
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not in what you have, but who you are.", category: "Success" }
];

// Load quotes and selected filter from localStorage
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

let lastFilter = localStorage.getItem("selectedCategory") || "all";

// Display a random quote
function displayRandomQuote() {
  let filteredQuotes = quotes;

  if (lastFilter !== "all") {
    filteredQuotes = quotes.filter(q => q.category === lastFilter);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" - ${quote.category}`;
}

// Add a new quote
function addQuote(event) {
  event.preventDefault();
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (text && category) {
    quotes.push({ text, category });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories(); // update categories dynamically
    displayRandomQuote();
    document.getElementById("addQuoteForm").reset();
  }
}

// Populate category dropdown dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const select = document.getElementById("categoryFilter");

  // Reset dropdown
  select.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  // Restore last selected filter
  select.value = lastFilter;
}

// Filter quotes based on selected category
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  lastFilter = selected;
  localStorage.setItem("selectedCategory", lastFilter);
  displayRandomQuote();
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        displayRandomQuote();
      }
    } catch (err) {
      alert("Invalid file format.");
    }
  };
  reader.readAsText(file);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteForm").addEventListener("submit", addQuote);

// Initialize on load
window.onload = function() {
  populateCategories();
  filterQuotes(); // ensures correct category + random quote shown on load
};
