
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Motivation" }
];


function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) quotes = parsed;
    } catch {}
  }
}
loadQuotes();


function renderQuote(quote) {
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = `"${quote.text}" <br><em>- ${quote.category}</em>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}


function showRandomQuote() {
  const filterSel = document.getElementById("categoryFilter");
  let pool = quotes;
  if (filterSel && filterSel.value && filterSel.value !== "all") {
    pool = quotes.filter(q => q.category === filterSel.value);
  }
  if (pool.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes in this category.";
    return;
  }
  const random = pool[Math.floor(Math.random() * pool.length)];
  renderQuote(random);
}

(function restoreLast() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    try {
      renderQuote(JSON.parse(last));
    } catch {}
  } else {
    showRandomQuote();
  }
})();


function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const catInput  = document.getElementById("newQuoteCategory");
  const text = (textInput?.value || "").trim();
  const category = (catInput?.value || "").trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });       // add to array
  saveQuotes();                          // persist (Task 1)
  populateCategories();                  // keep filter in sync (Task 2)

  if (textInput) textInput.value = "";
  if (catInput)  catInput.value = "";

  showRandomQuote();

  alert("Quote added successfully!");
}


function populateCategories() {
  const sel = document.getElementById("categoryFilter");
  if (!sel) return;

  const categories = [...new Set(quotes.map(q => q.category))].sort();

  sel.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    sel.appendChild(opt);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) sel.value = saved;
}

function filterQuotes() {
  const sel = document.getElementById("categoryFilter");
  if (!sel) return;
  localStorage.setItem("selectedCategory", sel.value);

  if (sel.value === "all") {
    showRandomQuote();
  } else {
    const pool = quotes.filter(q => q.category === sel.value);
    if (pool.length) {
      renderQuote(pool[Math.floor(Math.random() * pool.length)]);
    } else {
      document.getElementById("quoteDisplay").innerHTML = "No quotes in this category.";
    }
  }
}

populateCategories();


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

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes = imported;
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format: expected an array.");
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  const file = event.target.files?.[0];
  if (file) fileReader.readAsText(file);
}


function createAddQuoteForm() {
  let textInput = document.getElementById("newQuoteText");
  let catInput  = document.getElementById("newQuoteCategory");
  let addBtn    = document.getElementById("add-quote-btn");

  if (!textInput || !catInput) {
    const container = document.createElement("div");
    textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "newQuoteText";
    textInput.placeholder = "Enter a new quote";

    catInput = document.createElement("input");
    catInput.type = "text";
    catInput.id = "newQuoteCategory";
    catInput.placeholder = "Enter quote category";

    addBtn = document.createElement("button");
    addBtn.id = "add-quote-btn";
    addBtn.textContent = "Add Quote";
    addBtn.addEventListener("click", addQuote);

    container.appendChild(textInput);
    container.appendChild(catInput);
    container.appendChild(addBtn);
    document.body.appendChild(container);
  } else {
    if (!addBtn) {
      addBtn = document.createElement("button");
      addBtn.id = "add-quote-btn";
      addBtn.textContent = "Add Quote";
      addBtn.addEventListener("click", addQuote);
      textInput.insertAdjacentElement("afterend", addBtn);
    } else {
      addBtn.onclick = null;
      addBtn.addEventListener("click", addQuote);
    }
  }
}

createAddQuoteForm();


document.getElementById("newQuote")?.addEventListener("click", showRandomQuote);
