# RedBus Clone - Traveler Registration, Seat Selection & Dynamic Fare Studio (SSMS Integrated)

A modern, responsive RedBus-themed bus booking studio with an operator **Bus Gallery**, an interactive 2+1 sleeper / 2+2 seater selection engine and dynamic fare matrix, backed by **Microsoft SQL Server (SSMS)**.

---

## 💺 Interactive Seat Selection & Seat-Tier Pricing

The application features live visual diagrams for both **Seater** and **Sleeper** buses:

### 1. Seater Buses (`AC Seater`, `Non-AC Seater`):
- **Layout:** Standard 2 + 2 layout with center aisle and front driver cabin.
- **Window Seats:** Identified with window tags and automatically adds **+₹100 premium** per seat.
- **Aisle Seats:** Base dynamic fare.

### 2. Sleeper Buses (`AC Sleeper`, `Non-AC Sleeper`):
- **Layout:** Two-tier deck arrangement (**Lower Deck** and **Upper Deck**).
- **Single Sleeper Berths (Window, Solo):** Carries a **+₹150 premium** per berth for single travelers wanting complete privacy.
- **Double Sleeper Window Berths:** Carries a **+₹100 premium**.
- **Double Sleeper Aisle Berths:** Standard dynamic fare.

### 3. Live Availability & Real-Time Collision Prevention:
- **Empty / Available Seats:** Interactive white/cream clickable cards with tags.
- **Selected Seats:** High-contrast RedBus crimson (`#d84950`).
- **Booked Seats:** Disabled in slate gray. When any traveler books seats on a given **route and date**, those seats are marked as booked and cannot be double-booked by another traveler.

---

## 🚌 Dynamic Route & Date Fare Matrix

- **Location / Distance:** Real-time road distance calculation between Indian cities (e.g., *Mumbai ➔ Pune:* 150 km, *Bengaluru ➔ Hyderabad:* 570 km, *Mumbai ➔ Goa:* 590 km).
- **Travel Date Surges:**
  - **Weekend Travel (Fri, Sat, Sun):** +25% weekend demand surge.
  - **Last-Minute Departures (Today / Tomorrow):** +15% urgency surcharge.
  - **Advance Booking (14+ days):** -5% early bird discount.
- **Taxes:** 5% standard road passenger transport GST calculated on final seat price.

---

## 🚌 Bus Gallery & Passenger Privacy

- Passenger bookings are inserted straight into **SQL Server (`RedBusDB`)** — no login is required to book a ticket.
- Public visitors only receive **booked/empty seat IDs** (`GET /api/seats`). The traveler roster endpoint (`GET /api/travelers`) still answers **403 Access Denied** without the admin bearer token, but it is no longer reachable from the browser UI.
- The right-hand panel is now a **Bus Gallery**: it shows coach photos of the operator selected in *step 2* (VRL, SRS, Orange, KPN, IntrCity, Zingbus) together with the fleet bus number, timings and amenities.
- Every operator ships two photos in `assets/buses/` (credits: `assets/buses/CREDITS.md`). The thumbnails switch the hero photo and the *Switch Operator Fleet* row re-selects an operator and repaints the 2+1 / 2+2 seat diagram.
- **The admin login, passenger roster table and CSV export have been removed from the UI.** Admin credentials stay server-side only (`ADMIN_USER` / `ADMIN_PASS` env vars in `server.js`).

## 🗄️ SQL Server / SSMS Table Schema (`dbo.Travelers`)

Database: `RedBusDB` on `.\SQLEXPRESS`

| Column | Type | Description |
| :--- | :--- | :--- |
| `Id` | `NVARCHAR(50) PRIMARY KEY` | Traveler ID (`trv_...`) |
| `Name` | `NVARCHAR(100)` | Full Name |
| `Email` | `NVARCHAR(150) UNIQUE` | Email address |
| `Phone` | `NVARCHAR(20) UNIQUE` | 10-digit mobile number |
| `City` | `NVARCHAR(100)` | Passenger city (= departure hub) |
| `BusOperator` | `NVARCHAR(120)` | Fleet operator (VRL, SRS, Orange, KPN, IntrCity, Zingbus) |
| `BusNumber` | `NVARCHAR(50)` | Operator fleet registration number |
| `FromCity` | `NVARCHAR(100)` | Departure hub |
| `ToCity` | `NVARCHAR(100)` | Destination hub |
| `TravelDate` | `DATE` | Journey date |
| `Preference` | `NVARCHAR(50)` | Bus class (`AC Sleeper`, `AC Seater`, etc.) |
| `Gender` | `NVARCHAR(20)` | Passenger gender (optional) |
| `SeatCount` | `INT` | Number of booked seats |
| `SelectedSeats` | `NVARCHAR(150)` | Selected seat IDs (e.g. `U1`, `1W,1A`) |
| `TotalFare` | `DECIMAL(10,2)` | Final calculated price with GST & premiums |
| `Status` | `NVARCHAR(20)` | `Active` / `Inactive` |
| `CreatedAt` | `DATETIME2` | Registration timestamp |
| `UpdatedAt` | `DATETIME2` | Last update timestamp |

---

## 🚀 How to Run the App

1. **Start the server:**
   ```powershell
   npm start
   ```
2. **Open in browser:**
   Navigate to **[http://localhost:3000](http://localhost:3000)**.
3. **Verify in SSMS:**
   Open **SQL Server Management Studio (SSMS)**, connect to `.\SQLEXPRESS`, and query:
   ```sql
   USE RedBusDB;
   SELECT Id, Name, FromCity, ToCity, TravelDate, Preference, SelectedSeats, TotalFare, Status 
   FROM dbo.Travelers 
   ORDER BY CreatedAt DESC;
   ```

---

## 🧪 Automated Testing
```powershell
npm test
```
Runs unit tests verifying seat layouts, window seat +₹100, single sleeper +₹150, duplicate seat collision detection, SQL store CRUD operations, anonymous SQL-mode persistence (`store.isSqlMode`), live seat fetches (`store.fetchBookedSeats`), per-operator fleet bus numbers, the per-operator bus gallery photo assets and the removal of the admin login / roster UI from the page.

All done and verified. Here's the summary:

## What changed

### ❌ Removed from the UI (whole admin surface)
| Removed | Where |
|---|---|
| Top-bar **Admin Login** pill + `#auth-status-container` | `index.html` header, `app.js` `updateAdminViewMode()`/login handlers |
| **Admin Authentication** dialog (`#login-dialog`, `admin/redbus123`) | HTML + JS + session `redbus_admin_token` logic |
| **Fleet Traveler Roster** panel (search, operator/status filters, passenger rows, view/edit/delete buttons, CSV export) | HTML right panel + `renderList()`, `showDetails()`, `promptDelete()`, `setEditMode()`, `store.toCSV` wiring |
| **"Booked Passenger Details Are Protected"** privacy-locked panel + hint | HTML + CSS |
| Traveler detail & delete-confirm dialogs, booking-status field, "Cancel editing" button, `Admin Roster` nav link, role badge | HTML + JS |
| Dead CSS: `.admin-locked-box`, `.locked-icon-shield`, `.admin-status-pill`, `.login-toggle-btn*`, `.privacy-hint*`, `#auth-status-container`, 540px media block | `styles.css` |

The page now has **no way to log in, view, edit, export or delete passenger records** — only seat availability (`/api/seats`) is public.

### ✅ New right-hand panel: **Bus Gallery** (operator-driven)
- Big hero coach photo, live-fleet badge, `1 / 2` counter, operator name + rating, fleet bus number, timings, amenities, photo caption with credit.
- Thumbnail strip (click to swap the hero photo) and a **Switch Operator Fleet** row (6 clickable fleet cards).
- Everything is driven by `currentOperator`: clicking an operator in the gallery row **or** in step 2's operator cards instantly updates photo, chip, fleet details and the 2+1 / 2+2 seat diagram.
- 12 real coach photos in `assets/buses/` (2 per operator, 900 px, offline — no external requests), attributed in `assets/buses/CREDITS.md`.

### Files touched
- `index.html` (25.3 KB → 20.0 KB) — new `#gallery-section` panel, static badge, updated privacy copy, only the Info dialog remains.
- `app.js` (43.2 KB → 31.6 KB) — added `renderBusGallery()`, `getOperatorFleet()`, `operatorPhotos()`, `activePhotoIndex`, `bus`/`camera` icons; all admin code deleted; `syncWithServer()` now called without a token.
- `pricing.js` — each operator gained `photos[]` (`src`, `caption`, `credit`, `source`).
- `styles.css` — admin CSS removed, gallery styles appended.
- `server.js` — MIME map now serves `.jpg/.jpeg/.webp` as `image/*` (required for the photos).
- `test.js` — 2 new regression tests (gallery assets exist for every operator; admin/roster UI + JS references are gone) → **8/8 pass**.
- `README.md` — "🔐 Admin Access" section replaced by "🚌 Bus Gallery & Passenger Privacy".

### Verification performed
- `node --check` on all modules ✅, `npm test` **8/8** ✅.
- Static wiring check: every `getElementById()` target in `app.js` exists in `index.html` ✅.
- **Headless Edge (real browser)**: gallery renders (`hero=assets/buses/vrl-1.jpg`, 2 thumbs, 6 fleet cards, 24 sleeper seats); clicking the Orange card → `orange-1.jpg` + form operator synced; clicking thumbnail 2 → `orange-2.jpg`, counter `2 / 2`; clicking the Zingbus card in step 2 → gallery follows (`zingbus-1.jpg`); all images loaded; computed CSS correct (`aspect-ratio 16/9`, `object-fit: cover`, active thumb border `#d84950`, 3-column fleet grid), 315 CSS rules parsed with zero dead admin selectors.
- **Live SQL Server round trip**: `POST /api/travelers` → 201 (rows 7→8), `GET /api/seats` reported `["W9"]` booked, anonymous `GET /api/travelers` → **403**, admin-token `DELETE` → 200, seat freed and **RedBusDB back to 7 rows** ✅.

Notes: the admin REST endpoints (`/api/admin/login`, `GET /api/travelers`, `DELETE`) still exist server-side for SSMS-side management, but they are unreachable from the browser UI; credentials are env-driven (`ADMIN_USER`/`ADMIN_PASS`). The pre-existing stale `venky` row (NULL operator/seats) is still in the DB — it can be removed with a one-off SQL statement since the UI no longer deletes records.