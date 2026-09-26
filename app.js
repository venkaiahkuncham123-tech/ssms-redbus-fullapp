import { TravelerStore, validateTraveler } from "./store.js";
import { calculateFare, BUS_TYPE_RATES, BUS_OPERATORS, getRouteDistance, SEATER_LAYOUT, SLEEPER_LAYOUT_2PLUS1 } from "./pricing.js";

const ICONS = {
  grid: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
  users: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  "user-plus": '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
  "user-check": '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>',
  user: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  mail: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  "map-pin": '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  calendar: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  "credit-card": '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  sparkles: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>',
  info: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  shield: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  "arrow-right": '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  lock: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  search: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  download: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  ticket: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3z"/></svg>',
  edit: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
  eye: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  x: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  "check-circle": '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  database: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  disc: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/></svg>',
  bus: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M3 11h18"/><circle cx="7.5" cy="19" r="1.6"/><circle cx="16.5" cy="19" r="1.6"/></svg>',
  camera: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>'
};

function renderIcons() {
  document.querySelectorAll("i[data-icon]").forEach(el => {
    const key = el.getAttribute("data-icon");
    if (ICONS[key]) el.innerHTML = ICONS[key];
  });
}

function formatINR(val = 0) {
  return "₹" + Number(val || 0).toLocaleString("en-IN");
}

function getOperatorBusNumber(operatorName = "") {
  const op = BUS_OPERATORS.find(o => o.name === operatorName);
  return (op && op.busNumber) || "KA-01-F-2024";
}

export async function initApp() {
  const store = new TravelerStore();

  const form = document.getElementById("traveler-form");
  const formTitle = document.getElementById("form-title");
  const formSubtitle = document.getElementById("form-subtitle");
  const submitLabel = document.getElementById("submit-label");
  const idInput = document.getElementById("traveler-id");
  const calculatedFareInput = document.getElementById("calculated-fare");
  const selectedSeatsInput = document.getElementById("selected-seats-input");
  const selectedOperatorInput = document.getElementById("selected-operator");

  const nameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const genderInput = document.getElementById("gender");
  const fromCityInput = document.getElementById("from-city");
  const toCityInput = document.getElementById("to-city");
  const travelDateInput = document.getElementById("travel-date");
  const prefInput = document.getElementById("preference");
  const consentBox = document.getElementById("consent");

  // Fare live display elements
  const fareDisplayTotal = document.getElementById("fare-display-total");
  const fareSurgeBadge = document.getElementById("fare-surge-badge");
  const fareRouteInfo = document.getElementById("fare-route-info");
  const fareSelectedSeatsLabel = document.getElementById("fare-selected-seats-label");
  const fareBaseSeatPrice = document.getElementById("fare-base-seat-price");
  const farePremiumsRow = document.getElementById("fare-premiums-row");
  const farePremiumsAmount = document.getElementById("fare-premiums-amount");
  const fareGst = document.getElementById("fare-gst");

  const seatContainer = document.getElementById("seat-layout-container");
  const operatorCardsContainer = document.getElementById("operator-list-cards");

  // Fleet bus gallery elements (coach photos follow the selected operator)
  const galleryChip = document.getElementById("gallery-chip");
  const gallerySubText = document.getElementById("gallery-sub-text");
  const busHeroImg = document.getElementById("bus-hero-img");
  const busHeroOperator = document.getElementById("bus-hero-operator");
  const busHeroRating = document.getElementById("bus-hero-rating");
  const busHeroMeta = document.getElementById("bus-hero-meta");
  const busHeroCaption = document.getElementById("bus-hero-caption");
  const busPhotoCounter = document.getElementById("bus-photo-counter");
  const busThumbStrip = document.getElementById("bus-thumb-strip");
  const operatorPhotoRow = document.getElementById("operator-photo-row");

  const infoDialog = document.getElementById("info-dialog");
  const demoInfoBtn = document.getElementById("demo-info");
  const toast = document.getElementById("toast");
  const toastText = toast ? toast.querySelector("span") : null;
  const dismissToast = document.getElementById("dismiss-toast");

  const storageIndicator = document.getElementById("storage-indicator");

  let toastTimer = null;
  let currentlySelectedSeats = new Set();
  let currentOperator = "VRL Travels";

  // Server-authoritative seat availability cache (seat IDs only - never passenger PII)
  const serverSeatCache = new Map();

  function seatCacheKey(from, to, date, operator) {
    return [
      (from || "").trim().toLowerCase(),
      (to || "").trim().toLowerCase(),
      (date || "").slice(0, 10),
      (operator || "").trim().toLowerCase()
    ].join("|");
  }

  /** Pulls live booked seats from RedBusDB (via /api/seats) and repaints the bus diagram */
  async function refreshServerBookedSeats() {
    const from = (fromCityInput.value || "").trim();
    const to = (toCityInput.value || "").trim();
    const date = travelDateInput.value || "";
    if (!from || !to || !date) return;

    const operator = currentOperator;
    const key = seatCacheKey(from, to, date, operator);
    const booked = await store.fetchBookedSeats({
      fromCity: from,
      toCity: to,
      travelDate: date,
      busOperator: operator,
      excludeId: idInput.value || null
    });

    if (!booked) return;
    const previous = serverSeatCache.get(key) || [];
    serverSeatCache.set(key, booked);
    if (previous.join(",") !== booked.join(",")) renderSeatMap();
  }

  function getAllBookedSeats({ fromCity, toCity, travelDate, busOperator, excludeId }) {
    const local = store.getBookedSeats({ fromCity, toCity, travelDate, busOperator, excludeId });
    const remote = serverSeatCache.get(seatCacheKey(fromCity, toCity, travelDate, busOperator)) || [];
    return Array.from(new Set([...local, ...remote]));
  }

  renderIcons();

  if (travelDateInput && !travelDateInput.value) {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    const yyyy = tmrw.getFullYear();
    const mm = String(tmrw.getMonth() + 1).padStart(2, "0");
    const dd = String(tmrw.getDate()).padStart(2, "0");
    travelDateInput.value = `${yyyy}-${mm}-${dd}`;
    travelDateInput.min = new Date().toISOString().slice(0, 10);
  }

  const todayEl = document.getElementById("today");
  if (todayEl) {
    const d = new Date();
    todayEl.textContent = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  function showToast(message, isError = false) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toastText.textContent = message;
    toast.classList.toggle("error", isError);
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
  }

  if (dismissToast) {
    dismissToast.addEventListener("click", () => { toast.hidden = true; });
  }

  /**
   * FLEET BUS GALLERY
   * Shows coach photos of the operator the passenger currently has selected.
   */
  let activePhotoIndex = 0;

  function getOperatorFleet(operatorName = "") {
    return BUS_OPERATORS.find(o => o.name === operatorName) || BUS_OPERATORS[0];
  }

  function operatorPhotos(op) {
    return op && Array.isArray(op.photos) ? op.photos : [];
  }

  function renderBusGallery() {
    const op = getOperatorFleet(currentOperator);
    const photos = operatorPhotos(op);
    if (photos.length === 0) return;
    if (!photos[activePhotoIndex]) activePhotoIndex = 0;
    const photo = photos[activePhotoIndex];

    if (galleryChip) galleryChip.textContent = op.name;
    if (gallerySubText) gallerySubText.textContent = `${op.busType} · ${op.busNumber} · photos follow your selected operator`;
    if (busHeroImg) {
      busHeroImg.src = photo.src;
      busHeroImg.alt = `${op.name} ${op.busType} coach`;
    }
    if (busHeroOperator) busHeroOperator.textContent = op.name;
    if (busHeroRating) busHeroRating.textContent = op.rating;
    if (busPhotoCounter) busPhotoCounter.textContent = `${activePhotoIndex + 1} / ${photos.length}`;
    if (busHeroCaption) {
      busHeroCaption.textContent = [photo.caption, photo.credit ? `Photo: ${photo.credit}` : ""].filter(Boolean).join(" · ");
    }
    if (busHeroMeta) {
      busHeroMeta.innerHTML = `
        <span><i data-icon="ticket"></i> ${op.busNumber}</span>
        <span><i data-icon="calendar"></i> ${op.departureTime} ➔ ${op.arrivalTime}</span>
        <span><i data-icon="map-pin"></i> ${op.amenity}</span>
      `;
    }

    if (busThumbStrip) {
      busThumbStrip.innerHTML = photos.map((p, i) => `
        <button type="button" class="bus-thumb ${i === activePhotoIndex ? "active" : ""}" data-photo="${i}" aria-label="Show coach photo ${i + 1} of ${op.name}">
          <img src="${p.src}" alt="${op.name} coach photo ${i + 1}" loading="lazy">
        </button>
      `).join("");

      busThumbStrip.querySelectorAll(".bus-thumb").forEach(btn => {
        btn.addEventListener("click", () => {
          activePhotoIndex = Number(btn.getAttribute("data-photo")) || 0;
          renderBusGallery();
        });
      });
    }

    if (operatorPhotoRow) {
      operatorPhotoRow.innerHTML = BUS_OPERATORS.map(o => {
        const cover = operatorPhotos(o)[0];
        return `
          <button type="button" class="operator-photo-card ${o.name === currentOperator ? "active" : ""}" data-operator-photo="${o.name}" title="Show the ${o.name} fleet">
            <img src="${cover ? cover.src : ""}" alt="${o.name} coach" loading="lazy">
            <span class="operator-photo-name">${o.name}</span>
          </button>
        `;
      }).join("");

      operatorPhotoRow.querySelectorAll(".operator-photo-card").forEach(card => {
        card.addEventListener("click", () => {
          currentOperator = card.getAttribute("data-operator-photo");
          selectedOperatorInput.value = currentOperator;
          activePhotoIndex = 0;
          renderOperatorCards();
          renderBusGallery();
          renderSeatMap();
          updateLiveFare();
          refreshServerBookedSeats();
        });
      });
    }

    renderIcons();
  }

  function renderOperatorCards() {
    if (!operatorCardsContainer) return;
    const from = fromCityInput.value.trim();
    const to = toCityInput.value.trim();
    const date = travelDateInput.value;
    const busType = prefInput.value;

    operatorCardsContainer.innerHTML = BUS_OPERATORS.map(op => {
      const isSelected = op.name === currentOperator;
      const fare = calculateFare({ fromCity: from, toCity: to, busType, travelDate: date, seatCount: 1 });
      return `
        <div class="operator-card ${isSelected ? 'selected' : ''}" data-operator="${op.name}">
          <div class="operator-header">
            <span class="operator-name">${op.name}</span>
            <span class="operator-rating">${op.rating}</span>
          </div>
          <div class="operator-time">${op.departureTime} ➔ ${op.arrivalTime}</div>
          <div class="operator-bus-type">${busType} · ${formatINR(fare.seatPrice)}/seat</div>
          <div class="operator-amenities">${op.amenity}</div>
        </div>
      `;
    }).join("");

    operatorCardsContainer.querySelectorAll(".operator-card").forEach(card => {
      card.addEventListener("click", () => {
        currentOperator = card.getAttribute("data-operator");
        activePhotoIndex = 0;
        renderBusGallery();
        selectedOperatorInput.value = currentOperator;
        renderOperatorCards();
        renderSeatMap();
        updateLiveFare();
        refreshServerBookedSeats();
      });
    });
  }

  function clearErrors() {
    ["name", "email", "phone", "fromCity", "toCity", "travelDate", "selectedSeats", "consent"].forEach(field => {
      const errEl = document.getElementById(`${field}-error`);
      if (errEl) errEl.textContent = "";
      const inp = document.getElementById(field === "name" ? "full-name" : (field === "fromCity" ? "from-city" : (field === "toCity" ? "to-city" : (field === "travelDate" ? "travel-date" : field))));
      if (inp) inp.removeAttribute("aria-invalid");
    });
  }

  function showErrors(errors) {
    clearErrors();
    for (const [key, msg] of Object.entries(errors)) {
      const fieldId = key === "name" ? "full-name" : (key === "fromCity" ? "from-city" : (key === "toCity" ? "to-city" : (key === "travelDate" ? "travel-date" : key)));
      const inp = document.getElementById(fieldId);
      const errEl = document.getElementById(`${key}-error`);
      if (inp) inp.setAttribute("aria-invalid", "true");
      if (errEl) errEl.textContent = msg;
    }
    const firstInvalid = document.querySelector("[aria-invalid='true']");
    if (firstInvalid) firstInvalid.focus();
  }

  function updateLiveFare() {
    const from = (fromCityInput.value || "").trim();
    const to = (toCityInput.value || "").trim();
    const busType = prefInput.value || "AC Sleeper";
    const date = travelDateInput.value || "";
    const seatArray = Array.from(currentlySelectedSeats);

    selectedSeatsInput.value = seatArray.join(",");

    const result = calculateFare({
      fromCity: from,
      toCity: to,
      busType,
      travelDate: date,
      selectedSeats: seatArray,
      seatCount: seatArray.length > 0 ? seatArray.length : 1
    });

    if (!result.isValidRoute) {
      fareDisplayTotal.textContent = "₹0";
      fareSurgeBadge.textContent = "Select departure & destination";
      fareSurgeBadge.className = "surge-badge";
      fareRouteInfo.textContent = "Choose 2 cities to see road distance";
      fareSelectedSeatsLabel.textContent = seatArray.length > 0 ? seatArray.join(", ") : "None selected";
      fareBaseSeatPrice.textContent = "₹0";
      farePremiumsRow.hidden = true;
      fareGst.textContent = "₹0";
      calculatedFareInput.value = "0";
      return;
    }

    calculatedFareInput.value = result.totalFare;
    fareDisplayTotal.textContent = formatINR(result.totalFare);
    fareRouteInfo.textContent = `${currentOperator} · ${result.distanceKm} km · ${result.busType}`;

    if (seatArray.length > 0) {
      fareSelectedSeatsLabel.innerHTML = seatArray.map(s => `<span class="seat-pill-badge">${s}</span>`).join(" ");
    } else {
      fareSelectedSeatsLabel.textContent = "Pick seats above (or default 1)";
    }

    fareBaseSeatPrice.textContent = `${formatINR(result.seatPrice)} / seat`;

    if (result.totalPremiums > 0) {
      farePremiumsRow.hidden = false;
      farePremiumsAmount.textContent = `+${formatINR(result.totalPremiums)}`;
    } else {
      farePremiumsRow.hidden = true;
    }

    fareGst.textContent = formatINR(result.gst);

    fareSurgeBadge.textContent = result.dateFactor.label;
    if (result.dateFactor.isSurge) {
      fareSurgeBadge.className = "surge-badge surge-high";
    } else {
      fareSurgeBadge.className = "surge-badge";
    }
  }

  /**
   * Renders the standard 2+1 Sleeper (Upper & Lower) or 2+2 Seater
   */
  function renderSeatMap() {
    const busType = prefInput.value || "AC Sleeper";
    const isSleeper = busType.toLowerCase().includes("sleeper");
    const from = fromCityInput.value.trim();
    const to = toCityInput.value.trim();
    const date = travelDateInput.value;
    const currentId = idInput.value || null;

    const bookedSeats = getAllBookedSeats({
      fromCity: from,
      toCity: to,
      travelDate: date,
      busOperator: currentOperator,
      excludeId: currentId
    });

    let html = `
      <div class="steering-wheel">
        <span>FRONT CABIN / DRIVER</span>
        <i data-icon="disc"></i>
      </div>
    `;

    if (isSleeper) {
      // Standard Indian 2+1 Sleeper Layout (Lower & Upper Deck)
      html += `
        <div class="sleeper-container">
          <!-- LOWER DECK (2+1) -->
          <div>
            <div class="deck-title">LOWER DECK (2+1 SLEEPER) <span></span></div>
            <div class="sleeper-2plus1-deck">
      `;

      // 4 rows of 2+1 sleeper
      for (let r = 0; r < 4; r++) {
        const sIndex = r * 3;
        const singleS = SLEEPER_LAYOUT_2PLUS1.lower[sIndex];
        const doubleAisle = SLEEPER_LAYOUT_2PLUS1.lower[sIndex + 1];
        const doubleWin = SLEEPER_LAYOUT_2PLUS1.lower[sIndex + 2];

        const isBooked1 = bookedSeats.includes(singleS.id);
        const isSel1 = currentlySelectedSeats.has(singleS.id);

        const isBooked2 = bookedSeats.includes(doubleAisle.id);
        const isSel2 = currentlySelectedSeats.has(doubleAisle.id);

        const isBooked3 = bookedSeats.includes(doubleWin.id);
        const isSel3 = currentlySelectedSeats.has(doubleWin.id);

        html += `
          <div class="sleeper-row-2plus1">
            <div class="single-side">
              <button type="button" class="sleeper-btn ${isSel1 ? 'selected' : ''} ${isBooked1 ? 'booked' : ''}" data-seat="${singleS.id}" ${isBooked1 ? 'disabled' : ''} title="${singleS.label} (+₹${singleS.premium})">
                <span>${singleS.num}</span>
                <span class="seat-tag single-tag">+₹150 Solo</span>
              </button>
            </div>
            <div class="aisle-corridor">Aisle</div>
            <div class="double-side">
              <button type="button" class="sleeper-btn ${isSel2 ? 'selected' : ''} ${isBooked2 ? 'booked' : ''}" data-seat="${doubleAisle.id}" ${isBooked2 ? 'disabled' : ''} title="${doubleAisle.label}">
                <span>${doubleAisle.num}</span>
                <span class="seat-tag">Aisle</span>
              </button>
              <button type="button" class="sleeper-btn ${isSel3 ? 'selected' : ''} ${isBooked3 ? 'booked' : ''}" data-seat="${doubleWin.id}" ${isBooked3 ? 'disabled' : ''} title="${doubleWin.label} (+₹${doubleWin.premium})">
                <span>${doubleWin.num}</span>
                <span class="seat-tag window-tag">+₹100 Win</span>
              </button>
            </div>
          </div>
        `;
      }

      html += `
            </div>
          </div>

          <!-- UPPER DECK (2+1) -->
          <div>
            <div class="deck-title">UPPER DECK (2+1 SLEEPER) <span></span></div>
            <div class="sleeper-2plus1-deck">
      `;

      for (let r = 0; r < 4; r++) {
        const sIndex = r * 3;
        const singleS = SLEEPER_LAYOUT_2PLUS1.upper[sIndex];
        const doubleAisle = SLEEPER_LAYOUT_2PLUS1.upper[sIndex + 1];
        const doubleWin = SLEEPER_LAYOUT_2PLUS1.upper[sIndex + 2];

        const isBooked1 = bookedSeats.includes(singleS.id);
        const isSel1 = currentlySelectedSeats.has(singleS.id);

        const isBooked2 = bookedSeats.includes(doubleAisle.id);
        const isSel2 = currentlySelectedSeats.has(doubleAisle.id);

        const isBooked3 = bookedSeats.includes(doubleWin.id);
        const isSel3 = currentlySelectedSeats.has(doubleWin.id);

        html += `
          <div class="sleeper-row-2plus1">
            <div class="single-side">
              <button type="button" class="sleeper-btn ${isSel1 ? 'selected' : ''} ${isBooked1 ? 'booked' : ''}" data-seat="${singleS.id}" ${isBooked1 ? 'disabled' : ''} title="${singleS.label} (+₹${singleS.premium})">
                <span>${singleS.num}</span>
                <span class="seat-tag single-tag">+₹150 Solo</span>
              </button>
            </div>
            <div class="aisle-corridor">Aisle</div>
            <div class="double-side">
              <button type="button" class="sleeper-btn ${isSel2 ? 'selected' : ''} ${isBooked2 ? 'booked' : ''}" data-seat="${doubleAisle.id}" ${isBooked2 ? 'disabled' : ''} title="${doubleAisle.label}">
                <span>${doubleAisle.num}</span>
                <span class="seat-tag">Aisle</span>
              </button>
              <button type="button" class="sleeper-btn ${isSel3 ? 'selected' : ''} ${isBooked3 ? 'booked' : ''}" data-seat="${doubleWin.id}" ${isBooked3 ? 'disabled' : ''} title="${doubleWin.label} (+₹${doubleWin.premium})">
                <span>${doubleWin.num}</span>
                <span class="seat-tag window-tag">+₹100 Win</span>
              </button>
            </div>
          </div>
        `;
      }

      html += `
            </div>
          </div>
        </div>
      `;
    } else {
      // 2+2 Seater Grid
      html += `<div class="seater-grid">`;
      for (let i = 0; i < SEATER_LAYOUT.length; i++) {
        const s = SEATER_LAYOUT[i];
        const isBooked = bookedSeats.includes(s.id);
        const isSelected = currentlySelectedSeats.has(s.id);
        const isWin = s.type === "window";
        const isAisleGap = (i % 4 === 1);

        html += `
          <button type="button" class="seat-btn ${isAisleGap ? 'aisle-gap' : ''} ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}" data-seat="${s.id}" ${isBooked ? 'disabled' : ''} title="${s.label}">
            <span>${s.num}</span>
            <span class="seat-tag ${isWin ? 'window-tag' : ''}">${isWin ? '+₹100' : 'Aisle'}</span>
          </button>
        `;
      }
      html += `</div>`;
    }

    seatContainer.innerHTML = html;
    renderIcons();

    seatContainer.querySelectorAll("button[data-seat]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sId = btn.getAttribute("data-seat");
        if (currentlySelectedSeats.has(sId)) {
          currentlySelectedSeats.delete(sId);
        } else {
          if (currentlySelectedSeats.size >= 6) {
            showToast("Maximum 6 seats can be selected per passenger booking", true);
            return;
          }
          currentlySelectedSeats.add(sId);
        }
        renderSeatMap();
        updateLiveFare();
      });
    });
  }

  [fromCityInput, toCityInput, travelDateInput, prefInput].forEach(el => {
    if (el) {
      el.addEventListener("change", () => {
        renderOperatorCards();
        renderSeatMap();
        updateLiveFare();
        refreshServerBookedSeats();
      });
    }
  });

  fromCityInput.addEventListener("input", updateLiveFare);
  toCityInput.addEventListener("input", updateLiveFare);

  function resetForm() {
    clearErrors();
    form.reset();
    idInput.value = "";
    currentlySelectedSeats.clear();
    formTitle.textContent = "Select Route, Bus & Seats";
    formSubtitle.textContent = "Choose bus operator, pick 2+1 sleeper or 2+2 seater seats, and confirm your ticket.";
    submitLabel.textContent = "Confirm Booking & Pay";
    consentBox.checked = false;
    consentBox.closest(".consent").style.display = "";

    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    const yyyy = tmrw.getFullYear();
    const mm = String(tmrw.getMonth() + 1).padStart(2, "0");
    const dd = String(tmrw.getDate()).padStart(2, "0");
    travelDateInput.value = `${yyyy}-${mm}-${dd}`;

    currentOperator = "VRL Travels";
    selectedOperatorInput.value = currentOperator;

    renderOperatorCards();
    renderSeatMap();
    updateLiveFare();
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const from = fromCityInput.value.trim();
    const to = toCityInput.value.trim();
    const date = travelDateInput.value;
    const busType = prefInput.value;
    const seatArray = Array.from(currentlySelectedSeats);

    if (seatArray.length === 0) {
      showErrors({ selectedSeats: "Please select at least 1 seat/berth from the bus diagram." });
      return;
    }

    const breakdown = calculateFare({
      fromCity: from,
      toCity: to,
      busType,
      travelDate: date,
      selectedSeats: seatArray,
      seatCount: seatArray.length
    });

    const payload = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      fromCity: from,
      toCity: to,
      city: from,
      busOperator: currentOperator,
      busNumber: getOperatorBusNumber(currentOperator),
      travelDate: date,
      seatCount: seatArray.length,
      selectedSeats: seatArray.join(","),
      preference: busType,
      totalFare: breakdown.totalFare,
      gender: genderInput.value,
      status: "Active",
      requireConsent: true,
      consent: consentBox.checked
    };

    try {
      submitLabel.textContent = "Confirming & Saving to SSMS...";
      await store.create(payload);
      if (store.isSqlMode) {
        showToast(`Success! Booked ${currentOperator} on seats ${payload.selectedSeats} for ${formatINR(payload.totalFare)} - saved to RedBusDB`);
      } else {
        showToast("Saved on this device only - SQL Server (RedBusDB) is unreachable. Run npm start to persist bookings.", true);
      }
      resetForm();
      await refreshServerBookedSeats();
    } catch (err) {
      if (err.errors) {
        showErrors(err.errors);
      } else {
        showToast(err.message, true);
      }
    } finally {
      submitLabel.textContent = "Confirm Booking & Pay";
    }
  });

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dialogId = btn.getAttribute("data-close");
      const d = document.getElementById(dialogId);
      if (d && typeof d.close === "function") d.close();
    });
  });

  [infoDialog].forEach(d => {
    if (!d) return;
    d.addEventListener("click", e => {
      const rect = d.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inDialog) d.close();
    });
  });

  if (demoInfoBtn && infoDialog) {
    demoInfoBtn.addEventListener("click", () => infoDialog.showModal());
  }

  [nameInput, emailInput, phoneInput, fromCityInput, toCityInput, travelDateInput, consentBox].forEach(inp => {
    if (inp) {
      inp.addEventListener("input", () => {
        inp.removeAttribute("aria-invalid");
        const key = inp.id === "full-name" ? "name" : (inp.id === "from-city" ? "fromCity" : (inp.id === "to-city" ? "toCity" : (inp.id === "travel-date" ? "travelDate" : inp.id)));
        const errEl = document.getElementById(`${key}-error`);
        if (errEl) errEl.textContent = "";
      });
    }
  });

  store.subscribe(() => {
    renderSeatMap();
  });

  // Connect to backend
  const connectedToSql = await store.syncWithServer();
  if (connectedToSql) {
    if (storageIndicator) {
      storageIndicator.innerHTML = '<span class="connection-dot"></span> SQL Server (RedBusDB in SSMS)';
    }
  } else {
    if (storageIndicator) {
      storageIndicator.innerHTML = '<span class="connection-dot"></span> Local workspace (start server for SSMS)';
    }
  }

  renderOperatorCards();
  renderSeatMap();
  updateLiveFare();
  renderBusGallery();
  // Pull the latest booked seats from RedBusDB for the default route, date and operator
  await refreshServerBookedSeats();

  return { store };
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", initApp);
}
