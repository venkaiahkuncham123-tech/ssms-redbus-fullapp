import { calculateFare, BUS_OPERATORS } from "./pricing.js";

export const INITIAL_TRAVELERS = [
  {
    id: "trv_101",
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    phone: "9876543210",
    city: "Bengaluru",
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    busOperator: "VRL Travels",
    busNumber: "KA-01-F-2024",
    travelDate: "2026-09-28",
    gender: "Female",
    preference: "AC Sleeper",
    seatCount: 1,
    selectedSeats: "U1",
    totalFare: 1450,
    status: "Active",
    createdAt: "2026-03-01T09:30:00.000Z",
    updatedAt: "2026-03-01T09:30:00.000Z"
  },
  {
    id: "trv_102",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "9823456781",
    city: "Mumbai",
    fromCity: "Mumbai",
    toCity: "Pune",
    busOperator: "SRS Travels",
    busNumber: "MH-12-Q-4455",
    travelDate: "2026-09-27",
    gender: "Male",
    preference: "AC Seater",
    seatCount: 1,
    selectedSeats: "1W",
    totalFare: 680,
    status: "Active",
    createdAt: "2026-03-05T14:15:00.000Z",
    updatedAt: "2026-03-05T14:15:00.000Z"
  },
  {
    id: "trv_103",
    name: "Pooja Reddy",
    email: "pooja.reddy@example.com",
    phone: "9740123456",
    city: "Hyderabad",
    fromCity: "Hyderabad",
    toCity: "Bengaluru",
    busOperator: "Orange Tours & Travels",
    busNumber: "AP-09-V-7890",
    travelDate: "2026-09-29",
    gender: "Female",
    preference: "AC Sleeper",
    seatCount: 2,
    selectedSeats: "U2,U3",
    totalFare: 2900,
    status: "Active",
    createdAt: "2026-03-10T11:00:00.000Z",
    updatedAt: "2026-03-10T11:00:00.000Z"
  },
  {
    id: "trv_104",
    name: "Karthik Sundaram",
    email: "karthik.s@example.com",
    phone: "9445123987",
    city: "Chennai",
    fromCity: "Chennai",
    toCity: "Bengaluru",
    busOperator: "KPN Travels",
    busNumber: "TN-01-AB-1234",
    travelDate: "2026-09-30",
    gender: "Male",
    preference: "Non-AC Sleeper",
    seatCount: 1,
    selectedSeats: "L1",
    totalFare: 820,
    status: "Active",
    createdAt: "2026-03-14T16:45:00.000Z",
    updatedAt: "2026-03-14T16:45:00.000Z"
  },
  {
    id: "trv_105",
    name: "Rohan Deshmukh",
    email: "rohan.d@example.com",
    phone: "9922114455",
    city: "Pune",
    fromCity: "Pune",
    toCity: "Goa",
    busOperator: "IntrCity SmartBus",
    busNumber: "MH-14-TR-9900",
    travelDate: "2026-10-01",
    gender: "Male",
    preference: "AC Seater",
    seatCount: 1,
    selectedSeats: "4W",
    totalFare: 1150,
    status: "Inactive",
    createdAt: "2026-03-18T08:20:00.000Z",
    updatedAt: "2026-03-19T10:00:00.000Z"
  },
  {
    id: "trv_106",
    name: "Meera Sen",
    email: "meera.sen@example.com",
    phone: "9811223344",
    city: "Delhi",
    fromCity: "Delhi",
    toCity: "Jaipur",
    busOperator: "Zingbus Plus",
    busNumber: "DL-01-RT-5678",
    travelDate: "2026-09-28",
    gender: "Female",
    preference: "AC Sleeper",
    seatCount: 1,
    selectedSeats: "L7",
    totalFare: 950,
    status: "Active",
    createdAt: "2026-03-22T13:10:00.000Z",
    updatedAt: "2026-03-22T13:10:00.000Z"
  }
];

export const STORAGE_KEY = "redbus_clone_travelers_v4";

export function validateTraveler(data, existingList = [], currentId = null) {
  const errors = {};
  const name = (data.name || "").trim();
  if (!name) errors.name = "Full name is required.";
  else if (name.length < 2) errors.name = "Full name must be at least 2 characters.";
  else if (!/^[A-Za-z\s.'-]+$/.test(name)) errors.name = "Name can only contain letters, spaces, hyphens, and dots.";

  const email = (data.email || "").trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email) errors.email = "Email address is required.";
  else if (!emailRegex.test(email)) errors.email = "Please enter a valid email address.";
  else if (existingList.some(t => t.id !== currentId && t.email.toLowerCase() === email)) {
    errors.email = "This email is already registered.";
  }

  const phone = (data.phone || "").trim().replace(/\s|-/g, "");
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone) errors.phone = "Mobile number is required.";
  else if (!phoneRegex.test(phone)) errors.phone = "Enter a valid 10-digit Indian mobile number (starts with 6-9).";
  else if (existingList.some(t => t.id !== currentId && t.phone.replace(/\s|-/g, "") === phone)) {
    errors.phone = "This mobile number is already registered.";
  }

  const fromCity = (data.fromCity || data.city || "").trim();
  if (!fromCity) errors.fromCity = "Departure city is required.";

  const toCity = (data.toCity || "").trim();
  if (!toCity) errors.toCity = "Destination city is required.";
  else if (fromCity && toCity.toLowerCase() === fromCity.toLowerCase()) {
    errors.toCity = "Destination must be different from departure city.";
  }

  const travelDate = (data.travelDate || "").trim();
  if (!travelDate) {
    errors.travelDate = "Journey date is required.";
  }

  const busOperator = (data.busOperator || "").trim();
  if (!busOperator) {
    errors.busOperator = "Please choose a bus operator.";
  }

  // Selected seats validation
  const seats = Array.isArray(data.selectedSeats)
    ? data.selectedSeats
    : (typeof data.selectedSeats === "string" ? data.selectedSeats.split(",").map(s => s.trim()).filter(Boolean) : []);

  if (seats.length === 0 && (!data.seatCount || Number(data.seatCount) < 1)) {
    errors.selectedSeats = "Please select at least one seat/berth from the bus layout.";
  }

  // Check seat collisions for the same operator, route, and date
  if (seats.length > 0 && fromCity && toCity && travelDate) {
    const conflictingBooking = existingList.find(t => {
      if (t.id === currentId || (t.status || "").toLowerCase() === "inactive") return false;
      const sameRoute = (t.fromCity || t.city || "").toLowerCase() === fromCity.toLowerCase() &&
                        (t.toCity || "").toLowerCase() === toCity.toLowerCase();
      const sameDate = (t.travelDate || "").slice(0, 10) === travelDate.slice(0, 10);
      const sameOp = !busOperator || (t.busOperator || "").toLowerCase() === busOperator.toLowerCase();

      if (!sameRoute || !sameDate || !sameOp) return false;

      const bookedSeats = Array.isArray(t.selectedSeats)
        ? t.selectedSeats
        : (t.selectedSeats || "").split(",").map(s => s.trim()).filter(Boolean);
      return seats.some(s => bookedSeats.includes(s));
    });

    if (conflictingBooking) {
      errors.selectedSeats = "One or more chosen seats were already booked on this bus & date. Please pick another seat.";
    }
  }

  if (data.requireConsent && !data.consent) {
    errors.consent = "Please confirm consent to save traveler details.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export class TravelerStore {
  constructor(storage = null, useApi = false) {
    this.storage = storage || (typeof window !== "undefined" && window.localStorage ? window.localStorage : null);
    this.useApi = useApi;
    this.isAdminMode = false;
    this.travelers = this._loadLocal();
    this.listeners = new Set();
    this.isSqlMode = false;
  }

  _loadLocal() {
    if (this.storage) {
      try {
        const raw = this.storage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error("Storage load error", e);
      }
    }
    const init = JSON.parse(JSON.stringify(INITIAL_TRAVELERS));
    this._persist(init);
    return init;
  }

  _persist(list) {
    if (this.storage) {
      try {
        this.storage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.error("Storage persist error", e);
      }
    }
  }

  _notify() {
    for (const l of this.listeners) {
      try { l(this.travelers); } catch (e) { console.error(e); }
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getAll() {
    return [...this.travelers];
  }

  getById(id) {
    return this.travelers.find(t => t.id === id) || null;
  }

  /**
   * Returns list of seat IDs already booked for a specific operator, route and date
   */
  getBookedSeats({ fromCity = "", toCity = "", travelDate = "", busOperator = "", excludeId = null } = {}) {
    const from = (fromCity || "").trim().toLowerCase();
    const to = (toCity || "").trim().toLowerCase();
    const date = (travelDate || "").slice(0, 10);
    const op = (busOperator || "").trim().toLowerCase();
    if (!from || !to || !date) return [];

    const booked = new Set();
    for (const t of this.travelers) {
      if (t.id === excludeId || (t.status || "").toLowerCase() === "inactive") continue;
      const tFrom = (t.fromCity || t.city || "").trim().toLowerCase();
      const tTo = (t.toCity || "").trim().toLowerCase();
      const tDate = (t.travelDate || "").slice(0, 10);
      const tOp = (t.busOperator || "").trim().toLowerCase();

      if (tFrom === from && tTo === to && tDate === date && (!op || tOp === op)) {
        const sList = Array.isArray(t.selectedSeats)
          ? t.selectedSeats
          : (t.selectedSeats || "").split(",").map(s => s.trim()).filter(Boolean);
        for (const s of sList) booked.add(s);
      }
    }
    return Array.from(booked);
  }

  filter({ query = "", status = "all", busType = "all", busOperator = "all" } = {}) {
    const q = (query || "").trim().toLowerCase();
    const st = (status || "all").toLowerCase();
    const bt = (busType || "all").toLowerCase();
    const bo = (busOperator || "all").toLowerCase();

    return this.travelers.filter(t => {
      if (st !== "all" && (t.status || "").toLowerCase() !== st) return false;
      if (bt !== "all" && (t.preference || "").toLowerCase() !== bt) return false;
      if (bo !== "all" && (t.busOperator || "").toLowerCase() !== bo) return false;
      if (!q) return true;
      return (
        (t.name || "").toLowerCase().includes(q) ||
        (t.email || "").toLowerCase().includes(q) ||
        (t.busOperator || "").toLowerCase().includes(q) ||
        (t.fromCity || t.city || "").toLowerCase().includes(q) ||
        (t.toCity || "").toLowerCase().includes(q) ||
        (t.selectedSeats || "").toLowerCase().includes(q) ||
        (t.phone || "").includes(q)
      );
    });
  }

  getStats() {
    const total = this.travelers.length;
    const active = this.travelers.filter(t => t.status === "Active").length;
    const cities = new Set(
      this.travelers.flatMap(t => [t.fromCity || t.city, t.toCity]).filter(Boolean).map(c => c.trim().toLowerCase())
    ).size;
    const totalRevenue = this.travelers.reduce((sum, t) => sum + (Number(t.totalFare) || 0), 0);
    return { total, active, cities, totalRevenue };
  }

  /**
   * Connects the store to the Node API + RedBusDB.
   * SQL mode is switched on for EVERY visitor as soon as the server reports a live
   * database connection, so passenger bookings are written straight into SQL Server.
   * The confidential traveler roster is only downloaded for verified admins.
   */
  async syncWithServer(adminToken = null) {
    if (typeof fetch === "undefined") return false;

    try {
      const healthRes = await fetch("/api/health");
      if (!healthRes.ok) {
        this.isSqlMode = false;
        this.isAdminMode = false;
        return false;
      }

      const health = await healthRes.json();
      if (!health.connected) {
        this.isSqlMode = false;
        this.isAdminMode = false;
        return false;
      }

      // Server + RedBusDB reachable: inserts/updates/deletes go to SQL Server
      this.isSqlMode = true;

      if (adminToken) {
        const listRes = await fetch("/api/travelers", {
          headers: { "Authorization": "Bearer " + adminToken }
        });
        if (listRes.ok) {
          const listData = await listRes.json();
          if (listData.success && Array.isArray(listData.data)) {
            this.travelers = listData.data;
            this.isAdminMode = true;
            this._persist(this.travelers);
            this._notify();
          }
        } else {
          this.isAdminMode = false;
        }
      } else {
        // Anonymous passenger: local list is only kept for offline seat hints
        this.isAdminMode = false;
      }

      return true;
    } catch (e) {
      this.isSqlMode = false;
      this.isAdminMode = false;
      return false;
    }
  }

  /**
   * Server-authoritative booked seat list (seat IDs only, never passenger PII).
   * Returns null when the API is unreachable so callers can fall back to the cache.
   */
  async fetchBookedSeats({ fromCity = "", toCity = "", travelDate = "", busOperator = "", excludeId = null } = {}) {
    if (typeof fetch === "undefined") return null;
    try {
      const params = new URLSearchParams();
      params.set("from", fromCity);
      params.set("to", toCity);
      params.set("date", (travelDate || "").slice(0, 10));
      params.set("operator", busOperator || "");
      if (excludeId) params.set("excludeId", excludeId);

      const res = await fetch("/api/seats?" + params.toString());
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.success && Array.isArray(data.bookedSeats)) return data.bookedSeats;
      return null;
    } catch (e) {
      return null;
    }
  }

  async create(data) {
    const validation = validateTraveler(data, this.travelers, null);
    if (!validation.valid) {
      const err = new Error("Validation failed");
      err.errors = validation.errors;
      throw err;
    }

    const seats = Array.isArray(data.selectedSeats)
      ? data.selectedSeats
      : (typeof data.selectedSeats === "string" ? data.selectedSeats.split(",").map(s => s.trim()).filter(Boolean) : []);
    const seatCount = seats.length > 0 ? seats.length : (Number(data.seatCount) || 1);

    const breakdown = calculateFare({
      fromCity: data.fromCity || data.city,
      toCity: data.toCity,
      busType: data.preference || "AC Sleeper",
      travelDate: data.travelDate,
      selectedSeats: seats,
      seatCount
    });

    const payload = {
      ...data,
      fromCity: (data.fromCity || data.city || "").trim(),
      city: (data.fromCity || data.city || "").trim(),
      toCity: (data.toCity || "").trim(),
      busOperator: (data.busOperator || "VRL Travels").trim(),
      busNumber: (data.busNumber || "KA-01-F-2024").trim(),
      travelDate: data.travelDate || "",
      preference: data.preference || "AC Sleeper",
      seatCount,
      selectedSeats: seats.join(","),
      totalFare: breakdown.totalFare
    };

    if (this.isSqlMode && typeof fetch !== "undefined") {
      const res = await fetch("/api/travelers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        if (resData.errors) {
          const err = new Error("Validation failed");
          err.errors = resData.errors;
          throw err;
        }
        throw new Error(resData.error || "Failed to create traveler in SQL Server");
      }
      const newTraveler = resData.data;
      if (this.isAdminMode) {
        // Only admins mirror the private roster locally; passenger bookings live in SQL Server
        this.travelers = [newTraveler, ...this.travelers.filter(t => t.id !== newTraveler.id)];
      }
      this._persist(this.travelers);
      this._notify();
      return newTraveler;
    }

    const cleanPhone = (payload.phone || "").trim().replace(/\s|-/g, "");
    const newTraveler = {
      id: "trv_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: cleanPhone,
      city: payload.city,
      fromCity: payload.fromCity,
      toCity: payload.toCity,
      busOperator: payload.busOperator,
      busNumber: payload.busNumber,
      travelDate: payload.travelDate,
      gender: payload.gender || "Prefer not to say",
      preference: payload.preference,
      seatCount: payload.seatCount,
      selectedSeats: payload.selectedSeats,
      totalFare: payload.totalFare,
      status: payload.status || "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.travelers = [newTraveler, ...this.travelers];
    this._persist(this.travelers);
    this._notify();
    return newTraveler;
  }

  async update(id, data, adminToken = null) {
    const index = this.travelers.findIndex(t => t.id === id);
    if (index === -1) throw new Error(`Traveler ${id} not found.`);

    const current = this.travelers[index];
    const validationData = {
      ...current,
      ...data
    };

    const validation = validateTraveler(validationData, this.travelers, id);
    if (!validation.valid) {
      const err = new Error("Validation failed");
      err.errors = validation.errors;
      throw err;
    }

    const seats = data.selectedSeats !== undefined
      ? (Array.isArray(data.selectedSeats) ? data.selectedSeats : String(data.selectedSeats).split(",").map(s => s.trim()).filter(Boolean))
      : (current.selectedSeats ? current.selectedSeats.split(",").map(s => s.trim()).filter(Boolean) : []);
    const seatCount = seats.length > 0 ? seats.length : (data.seatCount !== undefined ? Number(data.seatCount) : (current.seatCount || 1));

    const breakdown = calculateFare({
      fromCity: data.fromCity || data.city || current.fromCity,
      toCity: data.toCity !== undefined ? data.toCity : current.toCity,
      busType: data.preference || current.preference,
      travelDate: data.travelDate !== undefined ? data.travelDate : current.travelDate,
      selectedSeats: seats,
      seatCount
    });

    const payload = {
      ...current,
      ...data,
      fromCity: (data.fromCity || data.city || current.fromCity).trim(),
      city: (data.fromCity || data.city || current.city).trim(),
      toCity: (data.toCity !== undefined ? data.toCity : current.toCity).trim(),
      busOperator: (data.busOperator || current.busOperator || "VRL Travels").trim(),
      busNumber: (data.busNumber || current.busNumber || "KA-01-F-2024").trim(),
      travelDate: data.travelDate !== undefined ? data.travelDate : current.travelDate,
      preference: data.preference !== undefined ? data.preference : current.preference,
      seatCount,
      selectedSeats: seats.join(","),
      totalFare: breakdown.totalFare
    };

    if (this.isSqlMode && typeof fetch !== "undefined") {
      const headers = { "Content-Type": "application/json" };
      if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

      const res = await fetch(`/api/travelers/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        if (resData.errors) {
          const err = new Error("Validation failed");
          err.errors = resData.errors;
          throw err;
        }
        throw new Error(resData.error || "Failed to update traveler in SQL Server");
      }
      const updated = resData.data;
      this.travelers[index] = updated;
      this._persist(this.travelers);
      this._notify();
      return updated;
    }

    const cleanPhone = (payload.phone || "").trim().replace(/\s|-/g, "");
    const updated = {
      ...current,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: cleanPhone,
      city: payload.city,
      fromCity: payload.fromCity,
      toCity: payload.toCity,
      busOperator: payload.busOperator,
      busNumber: payload.busNumber,
      travelDate: payload.travelDate,
      gender: payload.gender !== undefined ? payload.gender : current.gender,
      preference: payload.preference,
      seatCount: payload.seatCount,
      selectedSeats: payload.selectedSeats,
      totalFare: payload.totalFare,
      status: payload.status || current.status,
      updatedAt: new Date().toISOString()
    };

    this.travelers[index] = updated;
    this._persist(this.travelers);
    this._notify();
    return updated;
  }

  async delete(id, adminToken = null) {
    const existing = this.travelers.find(t => t.id === id);
    if (!existing) throw new Error(`Traveler ${id} not found.`);

    if (this.isSqlMode && typeof fetch !== "undefined") {
      const headers = {};
      if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

      const res = await fetch(`/api/travelers/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to delete traveler in SQL Server");
      }
    }

    this.travelers = this.travelers.filter(t => t.id !== id);
    this._persist(this.travelers);
    this._notify();
    return existing;
  }

  resetToDefaults() {
    this.travelers = JSON.parse(JSON.stringify(INITIAL_TRAVELERS));
    this._persist(this.travelers);
    this._notify();
    return this.travelers;
  }

  toCSV() {
    const headers = ["ID", "Name", "Email", "Phone", "From", "To", "Operator", "Bus Number", "Travel Date", "Bus Type", "Seats", "Selected Seats", "Total Fare (INR)", "Status", "Created At"];
    const rows = this.travelers.map(t => [
      t.id,
      `"${(t.name || "").replace(/"/g, '""')}"`,
      `"${t.email || ""}"`,
      `"${t.phone || ""}"`,
      `"${(t.fromCity || t.city || "").replace(/"/g, '""')}"`,
      `"${(t.toCity || "").replace(/"/g, '""')}"`,
      `"${(t.busOperator || "").replace(/"/g, '""')}"`,
      `"${(t.busNumber || "").replace(/"/g, '""')}"`,
      `"${t.travelDate || ""}"`,
      `"${t.preference || ""}"`,
      t.seatCount || 1,
      `"${t.selectedSeats || ""}"`,
      t.totalFare || 0,
      `"${t.status || ""}"`,
      `"${t.createdAt || ""}"`
    ]);
    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }
}
