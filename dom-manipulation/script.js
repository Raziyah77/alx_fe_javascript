// =======================
// Task 3: Syncing with Server
// =======================

// Simulate fetching quotes from a mock API (JSONPlaceholder or similar)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Map mock API data into quote objects (id, text, category)
    return data.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      category: "server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// Simulate posting a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const data = await response.json();
    console.log("Posted to server:", data);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// Sync local quotes with server quotes
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Conflict resolution: server wins if duplicate ids exist
  const mergedQuotes = [...serverQuotes];
  localQuotes.forEach(lq => {
    if (!serverQuotes.some(sq => sq.id === lq.id)) {
      mergedQuotes.push(lq);
    }
  });

  // Update local storage
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));

  // Update UI
  quotes = mergedQuotes;
  filterQuotes();

  // Notify user of updates
  showNotification("Quotes synced with server. Conflicts resolved.");
}

// UI notification for sync/conflict resolution
function showNotification(message) {
  const note = document.createElement("div");
  note.textContent = message;
  note.style.background = "#4caf50";
  note.style.color = "#fff";
  note.style.padding = "8px";
  note.style.margin = "10px 0";
  note.style.borderRadius = "5px";
  document.body.insertBefore(note, document.body.firstChild);

  setTimeout(() => note.remove(), 3000);
}

// Periodically sync with server (every 30s)
setInterval(syncQuotes, 30000);
