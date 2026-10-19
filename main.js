// -------------------- PWA INSTALL HANDLING --------------------
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = "block";
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("ONS installed");
    }
    deferredPrompt = null;
    installBtn.style.display = "none";
  });
}

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  if (installBtn) installBtn.style.display = "none";
});

// -------------------- MODAL HANDLING --------------------
function openLetter(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeLetter(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = "none";
  document.body.style.overflow = "";
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
    document.body.style.overflow = "";
  }
});

// Close modal with Escape key
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.style.display = "none";
    });
    document.body.style.overflow = "";
  }
});

// -------------------- PLAYLIST POLISH --------------------
function initPlaylist() {
  const players = document.querySelectorAll("audio");
  
  if (players.length === 0) return; // No audio on this page
  
  players.forEach(player => {
    player.addEventListener("play", () => {
      // Pause other songs when one plays
      players.forEach(other => {
        if (other !== player) other.pause();
      });
      player.parentElement.classList.add("playing");
    });
    
    player.addEventListener("pause", () => {
      player.parentElement.classList.remove("playing");
    });
    
    player.addEventListener("ended", () => {
      player.parentElement.classList.remove("playing");
    });
  });
}

// -------------------- UPDATE PROMPT --------------------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "NEW_VERSION") {
      const refreshBanner = document.createElement("div");
      refreshBanner.className = "update-banner";
      refreshBanner.textContent = "✨ New version available — Tap to update";
      document.body.appendChild(refreshBanner);

      refreshBanner.addEventListener("click", () => {
        refreshBanner.classList.add("fade-out");
        setTimeout(() => {
          window.location.reload();
        }, 400);
      });
    }
  });
}

// -------------------- RELATIONSHIP CARD --------------------
function updateRelationshipCard() {
  // Brother: change this one date (YYYY-MM-DD) to update all relationship counters.
  const startDate = new Date("2026-06-19"); // <-- UPDATE THIS DATE
  
  const today = new Date();
  
  // Validate start date isn't in the future
  if (startDate > today) {
    console.warn("Start date is in the future!");
    return;
  }

  const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const elapsedMonths = (today.getFullYear() - startDate.getFullYear()) * 12 + today.getMonth() - startDate.getMonth() - (today.getDate() < startDate.getDate() ? 1 : 0);
  const daysTogetherEl = document.getElementById("daysTogether");
  if (daysTogetherEl) daysTogetherEl.textContent = diffDays.toLocaleString();
  const weeksTogetherEl = document.getElementById("weeksTogether");
  if (weeksTogetherEl) weeksTogetherEl.textContent = Math.floor(diffDays / 7).toLocaleString();
  const monthsTogetherEl = document.getElementById("monthsTogether");
  if (monthsTogetherEl) monthsTogetherEl.textContent = Math.max(0, elapsedMonths).toLocaleString();

  // Monthiversary Countdown (days until last day of current month)
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const countdown = Math.ceil((lastDayOfMonth - today) / (1000 * 60 * 60 * 24));
  
  const anniversaryCountdownEl = document.getElementById("anniversaryCountdown");
  if (anniversaryCountdownEl) {
    anniversaryCountdownEl.textContent = countdown + " days left";
  }
}

function page1() {
  window.location.href="images.html"
}

function page2() {
  window.location.href="W&C.html"
}

function page3() {
  window.location.href="songs.html"
}

// -------------------- INITIALIZE EVERYTHING --------------------
document.addEventListener("DOMContentLoaded", () => {
  // Initialize playlist if on playlist page
  initPlaylist();
  
  // Update relationship counters if on index page
  updateRelationshipCard();
  
  // Update counters every hour
  setInterval(updateRelationshipCard, 1000 * 60 * 60);
});
