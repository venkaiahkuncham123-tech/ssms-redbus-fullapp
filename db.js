import sql from "mssql";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || "1433");
const DB_NAME = process.env.DB_NAME || "RedBusDB";
const DB_USER = process.env.DB_USER || process.env.ADMIN_USER || "sa";
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.ADMIN_PASS || process.env.MSSQL_SA_PASSWORD || "redbus123";
const DB_ENCRYPT = (process.env.DB_ENCRYPT || "false").toLowerCase() === "true";
const DB_TRUST_CERT = (process.env.DB_TRUST_CERT || "true").toLowerCase() === "true";

export const dbConfig = {
  server: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  options: {
    encrypt: DB_ENCRYPT,
    trustServerCertificate: DB_TRUST_CERT,
    enableArithAbort: true
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  connectionTimeout: 15000,
  requestTimeout: 15000
};

let poolPromise = null;
function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(dbConfig).catch((err) => {
      poolPromise = null;
      throw err;
    });
  }
  return poolPromise;
}

/**
 * Execute a parameterized query against SQL Server.
 * Keeps the old `?` placeholder style working.
 */
export function querySql(sqlText, params = []) {
  let idx = -1;
  const rewritten = sqlText.replace(/\?/g, () => `@p${++idx}`);
  return getPool().then(async (pool) => {
    const request = pool.request();
    params.forEach((value, i) => {
      request.input(`p${i}`, value === undefined ? null : value);
    });
    const result = await request.query(rewritten);
    return result.recordset || [];
  });
}

/**
 * Check if SQL Server and RedBusDB table are reachable
 */
export async function testConnection() {
  try {
    const rows = await querySql("SELECT COUNT(*) AS total FROM Travelers");
    return { connected: true, total: rows[0]?.total ?? 0 };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

/**
 * Map SQL Server column names (PascalCase) to frontend camelCase
 */
function toTravelerModel(row) {
  if (!row) return null;
  return {
    id: row.Id,
    name: row.Name,
    email: row.Email,
    phone: row.Phone,
    city: row.City,
    fromCity: row.FromCity || row.City,
    toCity: row.ToCity || "",
    busOperator: row.BusOperator || "VRL Travels",
    busNumber: row.BusNumber || "KA-01-F-2024",
    travelDate: row.TravelDate ? (typeof row.TravelDate === "string" ? row.TravelDate.slice(0, 10) : new Date(row.TravelDate).toISOString().slice(0, 10)) : "",
    gender: row.Gender || "Prefer not to say",
    preference: row.Preference || "AC Sleeper",
    seatCount: row.SeatCount !== undefined && row.SeatCount !== null ? Number(row.SeatCount) : 1,
    selectedSeats: row.SelectedSeats || "",
    totalFare: row.TotalFare !== undefined && row.TotalFare !== null ? Number(row.TotalFare) : 0,
    status: row.Status || "Active",
    createdAt: row.CreatedAt ? new Date(row.CreatedAt).toISOString() : new Date().toISOString(),
    updatedAt: row.UpdatedAt ? new Date(row.UpdatedAt).toISOString() : new Date().toISOString()
  };
}

export async function getAllTravelers() {
  const sqlText = `
    SELECT Id, Name, Email, Phone, City, FromCity, ToCity, BusOperator, BusNumber, TravelDate, Gender, Preference, SeatCount, SelectedSeats, TotalFare, Status, CreatedAt, UpdatedAt
    FROM Travelers
    ORDER BY CreatedAt DESC
  `;
  const rows = await querySql(sqlText);
  return rows.map(toTravelerModel);
}

export async function getTravelerById(id) {
  const sqlText = `
    SELECT TOP 1 Id, Name, Email, Phone, City, FromCity, ToCity, BusOperator, BusNumber, TravelDate, Gender, Preference, SeatCount, SelectedSeats, TotalFare, Status, CreatedAt, UpdatedAt
    FROM Travelers
    WHERE Id = ?
  `;
  const rows = await querySql(sqlText, [id]);
  return rows.length > 0 ? toTravelerModel(rows[0]) : null;
}

export async function createTraveler(data) {
  const id = "trv_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const phone = (data.phone || "").trim().replace(/\s|-/g, "");
  const city = (data.city || data.fromCity || "").trim();
  const fromCity = (data.fromCity || city).trim();
  const toCity = (data.toCity || "").trim();
  const busOperator = (data.busOperator || "VRL Travels").trim();
  const busNumber = (data.busNumber || "KA-01-F-2024").trim();
  const travelDate = data.travelDate || null;
  const gender = data.gender || "Prefer not to say";
  const preference = data.preference || "AC Sleeper";
  const seatCount = Number(data.seatCount) || 1;
  const selectedSeats = Array.isArray(data.selectedSeats) ? data.selectedSeats.join(",") : (data.selectedSeats || "");
  const totalFare = Number(data.totalFare) || 0;
  const status = data.status || "Active";
  const now = new Date();

  const insertSql = `
    INSERT INTO Travelers (Id, Name, Email, Phone, City, FromCity, ToCity, BusOperator, BusNumber, TravelDate, Gender, Preference, SeatCount, SelectedSeats, TotalFare, Status, CreatedAt, UpdatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await querySql(insertSql, [
    id, name, email, phone, city, fromCity, toCity, busOperator, busNumber, travelDate, gender, preference, seatCount, selectedSeats, totalFare, status, now, now
  ]);
  return getTravelerById(id);
}

export async function updateTraveler(id, data) {
  const existing = await getTravelerById(id);
  if (!existing) {
    throw new Error(`Traveler with ID ${id} not found.`);
  }

  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const phone = (data.phone || "").trim().replace(/\s|-/g, "");
  const city = (data.city || data.fromCity || existing.city).trim();
  const fromCity = (data.fromCity || city || existing.fromCity).trim();
  const toCity = (data.toCity !== undefined ? data.toCity : existing.toCity).trim();
  const busOperator = data.busOperator || existing.busOperator;
  const busNumber = data.busNumber || existing.busNumber;
  const travelDate = data.travelDate !== undefined ? data.travelDate : existing.travelDate;
  const gender = data.gender !== undefined ? data.gender : existing.gender;
  const preference = data.preference !== undefined ? data.preference : existing.preference;
  const seatCount = data.seatCount !== undefined ? Number(data.seatCount) : existing.seatCount;
  const selectedSeats = data.selectedSeats !== undefined ? (Array.isArray(data.selectedSeats) ? data.selectedSeats.join(",") : data.selectedSeats) : existing.selectedSeats;
  const totalFare = data.totalFare !== undefined ? Number(data.totalFare) : existing.totalFare;
  const status = data.status || existing.status;
  const now = new Date();

  const updateSql = `
    UPDATE Travelers
    SET Name = ?, Email = ?, Phone = ?, City = ?, FromCity = ?, ToCity = ?, BusOperator = ?, BusNumber = ?, TravelDate = ?, Gender = ?, Preference = ?, SeatCount = ?, SelectedSeats = ?, TotalFare = ?, Status = ?, UpdatedAt = ?
    WHERE Id = ?
  `;

  await querySql(updateSql, [
    name, email, phone, city, fromCity, toCity, busOperator, busNumber, travelDate, gender, preference, seatCount, selectedSeats, totalFare, status, now, id
  ]);
  return getTravelerById(id);
}

export async function deleteTraveler(id) {
  const existing = await getTravelerById(id);
  if (!existing) {
    throw new Error(`Traveler with ID ${id} not found.`);
  }

  const deleteSql = "DELETE FROM Travelers WHERE Id = ?";
  await querySql(deleteSql, [id]);
  return existing;
}
