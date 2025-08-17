let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  "The best way to get started is to quit talking and begin doing.",
  "Don’t let yesterday take up too much of today.",
  "It’s not whether you get knocked down, it’s whether you get up."
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = quotes[randomIndex]; // ✅ Task 0 requires innerHTML
}

// Add a new quote
function addQuote(newQuote) {
  if (newQuote.trim() !== "") {
    quotes.push(newQuote);
    saveQuotes();
    updateQuotesList();
    displayRandomQuote(); // optional: show immediately
  }
}

// Update the quotes list in the DOM
function updateQuotesList() {
  const list = document.getElementById("quotesList");
  list.innerHTML = "";
  quotes.forEach((quote) => {
    const li = document.createElement("li");
    li.innerHTML = quote; // ✅ innerHTML again
    list.appendChild(li);
  });
}

// Event listener for “Show New Quote” button
document
  .getElementById("newQuoteButton")
  .addEventListener("click", displayRandomQuote);

// Handle Add Quote form
document
  .getElementById("addQuoteForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const newQuoteInput = document.getElementById("newQuote");
    addQuote(newQuoteInput.value);
    newQuoteInput.value = "";
  });

// Export quotes as JSON file
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateQuotesList();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format. Please upload a JSON array of quotes.");
      }
    } catch (error) {
      alert("Error reading file: " + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize app
window.onload = function () {
  updateQuotesList();
  displayRandomQuote();
};
