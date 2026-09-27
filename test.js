import test from "node:test";
import fs from "node:fs";

import assert from "node:assert/strict";
import { TravelerStore, validateTraveler, INITIAL_TRAVELERS } from "./store.js";
import { calculateFare, getRouteDistance, getDatePricingFactor, SEATER_LAYOUT, SLEEPER_LAYOUT_2PLUS1, BUS_OPERATORS } from "./pricing.js";

// Mock localStorage for node environment
class MockLocalStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
  clear() {
    this.map.clear();
  }
}

test("pricing engine dynamic calculation with 2+1 seat premiums", () => {
  // 1. Test Window Seat vs Aisle Seat on Seater Bus (+100)
  const seaterAisle = calculateFare({
    fromCity: "Mumbai",
    toCity: "Pune",
    busType: "AC Seater",
    travelDate: "2026-09-30",
    selectedSeats: ["1A"]
  });

  const seaterWindow = calculateFare({
    fromCity: "Mumbai",
    toCity: "Pune",
    busType: "AC Seater",
    travelDate: "2026-09-30",
    selectedSeats: ["1W"]
  });

  assert.equal(seaterWindow.totalPremiums, 100);
  assert.equal(seaterAisle.totalPremiums, 0);
  assert.equal(seaterWindow.totalFare - seaterAisle.totalFare, 105);

  // 2. Test 2+1 Sleeper Layout: Single Solo Berth vs Double Window vs Double Aisle (+150 for single, +100 for window)
  const sleeperSingle = calculateFare({
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    busType: "AC Sleeper",
    travelDate: "2026-09-30",
    selectedSeats: ["U1"] // Single Sleeper (+150)
  });

  const sleeperWindow = calculateFare({
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    busType: "AC Sleeper",
    travelDate: "2026-09-30",
    selectedSeats: ["U2W"] // Double Window (+100)
  });

  const sleeperAisle = calculateFare({
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    busType: "AC Sleeper",
    travelDate: "2026-09-30",
    selectedSeats: ["U2A"] // Double Aisle (0)
  });

  assert.equal(sleeperSingle.totalPremiums, 150);
  assert.equal(sleeperWindow.totalPremiums, 100);
  assert.equal(sleeperAisle.totalPremiums, 0);
  assert.ok(sleeperSingle.totalFare > sleeperWindow.totalFare);
  assert.ok(sleeperWindow.totalFare > sleeperAisle.totalFare);
});

test("2+1 sleeper and 2+2 seater layouts definition check", () => {
  assert.ok(SEATER_LAYOUT.length >= 16);
  assert.ok(SLEEPER_LAYOUT_2PLUS1.lower.length >= 12);
  assert.ok(SLEEPER_LAYOUT_2PLUS1.upper.length >= 12);
  assert.ok(SLEEPER_LAYOUT_2PLUS1.lower.some(s => s.type === "single-sleeper" && s.premium === 150));
  assert.ok(SLEEPER_LAYOUT_2PLUS1.lower.some(s => s.type === "window" && s.premium === 100));
  assert.ok(SLEEPER_LAYOUT_2PLUS1.lower.some(s => s.type === "aisle" && s.premium === 0));

  assert.ok(BUS_OPERATORS.length >= 5);
  assert.ok(BUS_OPERATORS.some(o => o.name === "VRL Travels"));
});

test("validateTraveler validation logic with operator & seats", () => {
  const validRes = validateTraveler({
    name: "Deepak Verma",
    email: "deepak.verma@example.com",
    phone: "9876541230",
    fromCity: "Delhi",
    toCity: "Jaipur",
    busOperator: "Zingbus Plus",
    travelDate: "2026-10-01",
    selectedSeats: ["1W", "1A"],
    seatCount: 2,
    consent: true,
    requireConsent: true
  }, INITIAL_TRAVELERS);
  assert.equal(validRes.valid, true);

  // Missing operator
  const noOp = validateTraveler({
    name: "Deepak Verma",
    email: "deepak.verma@example.com",
    phone: "9876541230",
    fromCity: "Delhi",
    toCity: "Jaipur",
    busOperator: "",
    travelDate: "2026-10-01",
    selectedSeats: ["1W"]
  }, INITIAL_TRAVELERS);
  assert.equal(noOp.valid, false);
  assert.ok(noOp.errors.busOperator);

  // Duplicate seat collision test on same operator, route and date
  const collisionRes = validateTraveler({
    name: "Collision Test",
    email: "collision@example.com",
    phone: "9876599999",
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    busOperator: "VRL Travels",
    travelDate: "2026-09-28", // same as Ananya Sharma
    selectedSeats: ["U1"] // Already booked by Ananya on VRL
  }, INITIAL_TRAVELERS);
  assert.equal(collisionRes.valid, false);
  assert.ok(collisionRes.errors.selectedSeats);
});

test("TravelerStore CRUD operations with operator, 2+1 seats and booked seat detection", async () => {
  const mockStorage = new MockLocalStorage();
  const store = new TravelerStore(mockStorage);

  // Read booked seats for VRL Travels on Bengaluru -> Hyderabad on 2026-09-28
  const booked = store.getBookedSeats({
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    busOperator: "VRL Travels",
    travelDate: "2026-09-28"
  });
  assert.ok(booked.includes("U1"));

  // Book a new seat on 2+1 layout
  const created = await store.create({
    name: "Sunita Rao",
    email: "sunita.rao@example.com",
    phone: "9820011223",
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    busOperator: "VRL Travels",
    travelDate: "2026-10-02",
    gender: "Female",
    preference: "AC Sleeper",
    selectedSeats: ["U4"] // Single Solo berth
  });
  assert.ok(created.id);
  assert.equal(created.selectedSeats, "U4");
  assert.equal(created.busOperator, "VRL Travels");

  // Verify seat is now booked
  const updatedBooked = store.getBookedSeats({
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    busOperator: "VRL Travels",
    travelDate: "2026-10-02"
  });
  assert.ok(updatedBooked.includes("U4"));

  // Delete traveler
  await store.delete(created.id);
  const afterDeleteBooked = store.getBookedSeats({
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    busOperator: "VRL Travels",
    travelDate: "2026-10-02"
  });
  assert.ok(!afterDeleteBooked.includes("U4"));
});

test("anonymous passengers stay in SQL mode so bookings reach RedBusDB", async () => {
  const store = new TravelerStore(new MockLocalStorage());
  const originalFetch = globalThis.fetch;
  const posted = [];

  globalThis.fetch = async (url, options = {}) => {
    const target = String(url);
    if (target.startsWith("/api/health")) {
      return { ok: true, status: 200, json: async () => ({ status: "ok", connected: true, totalTravelers: 8 }) };
    }
    if (target.startsWith("/api/seats")) {
      return { ok: true, status: 200, json: async () => ({ success: true, bookedSeats: ["U1", "L1"] }) };
    }
    if (target.startsWith("/api/travelers") && options.method === "POST") {
      const body = JSON.parse(options.body);
      posted.push(body);
      return {
        ok: true,
        status: 201,
        json: async () => ({ success: true, data: { ...body, id: "trv_sql_101", createdAt: "2026-09-26T00:00:00.000Z", updatedAt: "2026-09-26T00:00:00.000Z" } })
      };
    }
    // Privacy guard: the confidential roster is denied for anonymous users
    return { ok: false, status: 403, json: async () => ({ success: false, error: "Access Denied" }) };
  };

  try {
    const connected = await store.syncWithServer();
    assert.equal(connected, true);
    assert.equal(store.isSqlMode, true, "anonymous visitors must still write to SQL Server");
    assert.equal(store.isAdminMode, false);

    const created = await store.create({
      name: "Ravi Kumar",
      email: "ravi.sql@example.com",
      phone: "9876501234",
      fromCity: "Bengaluru",
      toCity: "Hyderabad",
      busOperator: "VRL Travels",
      busNumber: "KA-01-F-2024",
      travelDate: "2026-11-20",
      gender: "Male",
      preference: "AC Sleeper",
      selectedSeats: ["U5"],
      consent: true,
      requireConsent: true
    });

    assert.equal(created.id, "trv_sql_101");
    assert.equal(posted.length, 1, "exactly one INSERT request must reach the API");
    assert.equal(posted[0].busOperator, "VRL Travels");
    assert.equal(posted[0].selectedSeats, "U5");
    assert.equal(posted[0].fromCity, "Bengaluru");

    const seats = await store.fetchBookedSeats({
      fromCity: "Bengaluru",
      toCity: "Hyderabad",
      travelDate: "2026-11-20",
      busOperator: "VRL Travels"
    });
    assert.deepEqual(seats, ["U1", "L1"]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("every fleet operator exposes a bus number", () => {
  for (const op of BUS_OPERATORS) {
    assert.ok(op.busNumber, "missing bus number for " + op.name);
  }

test("every fleet operator ships a two-photo bus gallery backed by local assets", () => {
  for (const op of BUS_OPERATORS) {
    assert.ok(Array.isArray(op.photos), "missing photo gallery for " + op.name);
    assert.ok(op.photos.length >= 2, op.name + " needs at least 2 gallery photos");
    for (const photo of op.photos) {
      assert.ok(photo.src.startsWith("assets/buses/"), "gallery photos must be local: " + photo.src);
      assert.ok(fs.existsSync(photo.src), "missing gallery asset: " + photo.src);
      assert.ok(photo.caption, "missing caption for " + photo.src);
      assert.equal(photo.credit, "Wikimedia Commons");
    }
  }
});

test("admin login and passenger roster UI are removed in favour of the bus gallery", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const app = fs.readFileSync("app.js", "utf8");

  for (const gone of ["admin-login-btn", "login-dialog", "admin-roster-view", "user-privacy-view", "traveler-list", "admin-section", "cancel-edit"]) {
    assert.ok(!html.includes(gone), "index.html still ships the removed admin UI: " + gone);
  }
  for (const gone of ["adminSessionToken", "adminLoginForm", "renderList", "updateAdminViewMode", "setEditMode", "redbus_admin_token", "export-button"]) {
    assert.ok(!app.includes(gone), "app.js still references removed admin code: " + gone);
  }

  assert.ok(html.includes('id="gallery-section"'), "bus gallery panel must be present");
  assert.ok(html.includes('id="bus-hero-img"'), "gallery hero image must be present");
  assert.ok(html.includes('id="operator-photo-row"'), "operator photo switcher must be present");
  assert.ok(app.includes("function renderBusGallery()"), "gallery renderer must be wired");
  assert.ok(app.includes('data-operator-photo'), "operator cards must drive the gallery");
});

});
