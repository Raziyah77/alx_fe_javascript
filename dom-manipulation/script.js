// Initial quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

// Display random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerText = `"${quotes[randomIndex].text}" - Category: ${quotes[randomIndex].category}`;
}

// Create add quote form
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteFormContainer");
  container.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter quote" />
    <input type="text" id="newQuoteCategory" placeholder="Enter category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Add quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    filterQuotes(); // refresh display
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("selectedCategory") || "all";

  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}" ${cat === selected ? "selected" : ""}>${cat}</option>`)
    .join("");
}

// Filter quotes
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    document.getElementById("quoteDisplay").innerText = `"${filtered[randomIndex].text}" - Category: ${filtered[randomIndex].category}`;
  } else {
    document.getElementById("quoteDisplay").innerText = "No quotes available for this category.";
  }
}

// --- ✅ TASK 3: Server Sync & Conflict Resolution ---

// Simulated server API (JSONPlaceholder or mock)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Sync with server
async function syncWithServer() {
  try {
    // Simulate fetching latest server data
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Transform server data into quotes format (simulate categories)
    const serverQuotes = serverData.slice(0, 5).map((item, index) => ({
      text: item.title,
      category: ["Motivation", "Inspiration", "Resilience"][index % 3]
    }));

    // --- Conflict Resolution: Server takes precedence ---
    quotes = serverQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Update UI
    populateCategories();
    filterQuotes();
    showNotification("Quotes synced with server (server data replaced local).");

  } catch (error) {
    showNotification("Error syncing with server.");
  }
}

// Show notifications
function showNotification(msg) {
  const notification = document.getElementById("syncNotification");
  notification.innerText = msg;
  setTimeout(() => (notification.innerText = ""), 3000);
}

// --- Initialize everything ---
document.getElementById("newQuoteBtn").addEventListener("click", showRandomQuote);
document.getElementById("syncBtn").addEventListener("click", syncWithServer);
createAddQuoteForm();
populateCategories();
filterQuotes();
