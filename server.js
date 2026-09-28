import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  testConnection,
  getAllTravelers,
  getTravelerById,
  createTraveler,
  updateTraveler,
  deleteTraveler
} from "./db.js";
import { validateTraveler } from "./store.js";
import { calculateFare, BUS_TYPE_RATES, BUS_OPERATORS, POPULAR_CITIES, SEATER_LAYOUT, SLEEPER_LAYOUT_2PLUS1 } from "./pricing.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Hardcoded demo admin credentials
const ADMIN_USER = process.env.ADMIN_USER || "sa";
const ADMIN_PASS = process.env.ADMIN_PASS || "Venky@221927704071999#RedBusAppDevelop";
const ADMIN_SECRET_TOKEN = "redbus_admin_session_token_xyz890";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".sql": "text/plain; charset=utf-8"
};

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  res.end(JSON.stringify(data));
}

function isAdminAuthenticated(req) {
  const authHeader = req.headers["authorization"] || "";
  if (authHeader.startsWith("Bearer ") && authHeader.slice(7) === ADMIN_SECRET_TOKEN) {
    return true;
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split("?");
  const pathname = urlParts[0];

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    return res.end();
  }

  // --- REST API ENDPOINTS ---

  // POST /api/admin/login
  if (pathname === "/api/admin/login" && req.method === "POST") {
    try {
      const { username, password } = await parseJsonBody(req);
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        return sendJson(res, 200, {
          success: true,
          token: ADMIN_SECRET_TOKEN,
          user: { username: ADMIN_USER, role: "admin", name: "RedBus Fleet Admin" }
        });
      }
      return sendJson(res, 401, { success: false, error: "Invalid admin username or password. (Hint: admin / redbus123)" });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // GET /api/health - check DB
  if (pathname === "/api/health" && req.method === "GET") {
    const status = await testConnection();
    return sendJson(res, 200, {
      status: "ok",
      database: "RedBusDB",
      server: ".\\SQLEXPRESS",
      connected: status.connected,
      totalTravelers: status.total,
      ssmsManaged: true
    });
  }

  // GET /api/fare - calculate dynamic cost
  if (pathname === "/api/fare" && req.method === "GET") {
    const searchParams = new URLSearchParams(urlParts[1] || "");
    const fromCity = searchParams.get("from") || "";
    const toCity = searchParams.get("to") || "";
    const busType = searchParams.get("busType") || "AC Sleeper";
    const travelDate = searchParams.get("date") || "";
    const seatCount = searchParams.get("seats") || 1;
    const selectedSeats = (searchParams.get("selectedSeats") || "").split(",").map(s => s.trim()).filter(Boolean);

    const fareResult = calculateFare({ fromCity, toCity, busType, travelDate, seatCount, selectedSeats });
    return sendJson(res, 200, { success: true, data: fareResult });
  }

  // GET /api/seats - get booked seats for a route, date, and bus operator (NO USER PII RETURNED)
  if (pathname === "/api/seats" && req.method === "GET") {
    const searchParams = new URLSearchParams(urlParts[1] || "");
    const fromCity = (searchParams.get("from") || "").trim().toLowerCase();
    const toCity = (searchParams.get("to") || "").trim().toLowerCase();
    const travelDate = (searchParams.get("date") || "").slice(0, 10);
    const busOperator = (searchParams.get("operator") || "").trim().toLowerCase();
    const excludeId = searchParams.get("excludeId");

    try {
      const all = await getAllTravelers();
      const booked = new Set();
      for (const t of all) {
        if (t.id === excludeId || (t.status || "").toLowerCase() === "inactive") continue;
        const tFrom = (t.fromCity || t.city || "").trim().toLowerCase();
        const tTo = (t.toCity || "").trim().toLowerCase();
        const tDate = (t.travelDate || "").slice(0, 10);
        const tOp = (t.busOperator || "").trim().toLowerCase();

        // Check matching route, date, and operator
        if (tFrom === fromCity && tTo === toCity && tDate === travelDate && (!busOperator || tOp === busOperator)) {
          const sList = (t.selectedSeats || "").split(",").map(s => s.trim()).filter(Boolean);
          for (const s of sList) booked.add(s);
        }
      }

      // Notice: Only returns the booked seat identifiers (e.g. ['U1', 'L2A']), NOT names, emails, phones!
      return sendJson(res, 200, {
        success: true,
        bookedSeats: Array.from(booked),
        layouts: {
          seater: SEATER_LAYOUT,
          sleeper: SLEEPER_LAYOUT_2PLUS1
        }
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // GET /api/buses - available buses for route & date
  if (pathname === "/api/buses" && req.method === "GET") {
    const searchParams = new URLSearchParams(urlParts[1] || "");
    const fromCity = searchParams.get("from") || "Bengaluru";
    const toCity = searchParams.get("to") || "Hyderabad";
    const travelDate = searchParams.get("date") || new Date().toISOString().slice(0, 10);

    const buses = BUS_OPERATORS.map(op => {
      const isSleeper = op.busType.toLowerCase().includes("sleeper");
      const baseType = isSleeper ? (op.busType.toLowerCase().includes("non-ac") ? "Non-AC Sleeper" : "AC Sleeper") : (op.busType.toLowerCase().includes("non-ac") ? "Non-AC Seater" : "AC Seater");
      const fare = calculateFare({ fromCity, toCity, busType: baseType, travelDate, seatCount: 1 });
      return {
        ...op,
        baseBusType: baseType,
        startingFare: fare.seatPrice,
        distanceKm: fare.distanceKm,
        dateSurge: fare.dateFactor.label
      };
    });

    return sendJson(res, 200, { success: true, buses, operators: BUS_OPERATORS });
  }

  // GET /api/travelers - ADMIN ONLY! Regular users cannot see other travelers' identities.
  if (pathname === "/api/travelers" && req.method === "GET") {
    const isAdmin = isAdminAuthenticated(req);
    if (!isAdmin) {
      return sendJson(res, 403, {
        success: false,
        error: "Access Denied. Traveler directory and personal booking details are restricted to verified RedBus Fleet Administrators."
      });
    }

    try {
      const travelers = await getAllTravelers();
      return sendJson(res, 200, { success: true, data: travelers });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // POST /api/travelers - Any user can book their own ticket
  if (pathname === "/api/travelers" && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const existing = await getAllTravelers();
      const validation = validateTraveler(body, existing, null);
      if (!validation.valid) {
        return sendJson(res, 400, { success: false, errors: validation.errors });
      }

      const fare = calculateFare({
        fromCity: body.fromCity || body.city,
        toCity: body.toCity,
        busType: body.preference || "AC Sleeper",
        travelDate: body.travelDate,
        selectedSeats: body.selectedSeats || [],
        seatCount: body.seatCount || 1
      });
      body.totalFare = fare.totalFare;
      body.seatCount = fare.seatCount;

      const created = await createTraveler(body);
      return sendJson(res, 201, { success: true, data: created });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Match /api/travelers/:id
  const travelerIdMatch = pathname.match(/^\/api\/travelers\/([^/]+)$/);
  if (travelerIdMatch) {
    const id = decodeURIComponent(travelerIdMatch[1]);

    // GET /api/travelers/:id - Admin only
    if (req.method === "GET") {
      if (!isAdminAuthenticated(req)) {
        return sendJson(res, 403, { success: false, error: "Admin authentication required" });
      }
      try {
        const traveler = await getTravelerById(id);
        if (!traveler) return sendJson(res, 404, { success: false, error: "Not found" });
        return sendJson(res, 200, { success: true, data: traveler });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // PUT /api/travelers/:id - Admin only
    if (req.method === "PUT") {
      if (!isAdminAuthenticated(req)) {
        return sendJson(res, 403, { success: false, error: "Admin authentication required to edit existing booking records." });
      }
      try {
        const body = await parseJsonBody(req);
        const existing = await getAllTravelers();
        const validation = validateTraveler(body, existing, id);
        if (!validation.valid) {
          return sendJson(res, 400, { success: false, errors: validation.errors });
        }

        const fare = calculateFare({
          fromCity: body.fromCity || body.city,
          toCity: body.toCity,
          busType: body.preference || "AC Sleeper",
          travelDate: body.travelDate,
          selectedSeats: body.selectedSeats || [],
          seatCount: body.seatCount || 1
        });
        body.totalFare = fare.totalFare;
        body.seatCount = fare.seatCount;

        const updated = await updateTraveler(id, body);
        return sendJson(res, 200, { success: true, data: updated });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // DELETE /api/travelers/:id - Admin only
    if (req.method === "DELETE") {
      if (!isAdminAuthenticated(req)) {
        return sendJson(res, 403, { success: false, error: "Admin authentication required to delete bookings from SQL Server." });
      }
      try {
        const deleted = await deleteTraveler(id);
        return sendJson(res, 200, { success: true, data: deleted });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(__dirname, pathname === "/" ? "index.html" : pathname);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(__dirname, "index.html");
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Internal Server Error");
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`RedBus Studio Running on http://ssms-svc:${PORT}`);
  console.log(`Bus Operators & Routes Engine: Ready!`);
  console.log(`2+1 Sleeper & 2+2 Seater Layouts: Ready!`);
  console.log(`Privacy Guard: Booked user details hidden for regular users`);
  console.log(`Admin Portal: Login (admin / redbus123) to view SSMS roster`);
  console.log(`Database connected: RedBusDB on .\\SQLEXPRESS`);
  console.log(`====================================================`);
});
