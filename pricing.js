// City-to-City standard distances (approx road km)
export const ROUTE_DISTANCES = {
  "bengaluru-hyderabad": 570,
  "hyderabad-bengaluru": 570,
  "mumbai-pune": 150,
  "pune-mumbai": 150,
  "chennai-bengaluru": 350,
  "bengaluru-chennai": 350,
  "pune-goa": 450,
  "goa-pune": 450,
  "delhi-jaipur": 280,
  "jaipur-delhi": 280,
  "mumbai-goa": 590,
  "goa-mumbai": 590,
  "bengaluru-goa": 560,
  "goa-bengaluru": 560,
  "delhi-chandigarh": 250,
  "chandigarh-delhi": 250,
  "hyderabad-pune": 560,
  "pune-hyderabad": 560,
  "kolkata-puri": 500,
  "puri-kolkata": 500,
  "bengaluru-kochi": 540,
  "kochi-bengaluru": 540,
  "chennai-coimbatore": 500,
  "coimbatore-chennai": 500,
  "mumbai-ahmedabad": 525,
  "ahmedabad-mumbai": 525,
  "delhi-agra": 230,
  "agra-delhi": 230
};

// Bus Operators & fleet details
export const BUS_OPERATORS = [
  { id: "vrl", name: "VRL Travels", busNumber: "KA-01-F-2024", rating: "4.8 ★", busType: "AC Sleeper 2+1", departureTime: "21:00", arrivalTime: "06:30", amenity: "WiFi · Live Track · Water Bottle", photos: [
    { src: "assets/buses/vrl-1.jpg", caption: "Sleeper coach with a 2+1 berth deck", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Adhi_Prima_(ap-452)_Legacy_SR2_Suites_Class_Laksana.jpg" },
    { src: "assets/buses/vrl-2.jpg", caption: "Club-class sleeper coach on an intercity run", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:NWKRTC%27S_Airavata-CLUBCLASS.jpg" }
  ] },
  { id: "srs", name: "SRS Travels", busNumber: "MH-12-Q-4455", rating: "4.6 ★", busType: "AC Seater 2+2", departureTime: "07:30", arrivalTime: "11:30", amenity: "Charging Points · Reading Light", photos: [
    { src: "assets/buses/srs-1.jpg", caption: "SRS Travels Volvo B11R multi-axle coach", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Srs_travelsb11r.jpg" },
    { src: "assets/buses/srs-2.jpg", caption: "Blue intercity coach with 2+2 pushback seating", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:MSRTC-Volvo-Shivneri.jpg" }
  ] },
  { id: "orange", name: "Orange Tours & Travels", busNumber: "AP-09-V-7890", rating: "4.9 ★", busType: "AC Sleeper 2+1", departureTime: "22:15", arrivalTime: "07:45", amenity: "Blanket · Pillow · Snacks", photos: [
    { src: "assets/buses/orange-1.jpg", caption: "Multi-axle coach in orange intercity livery", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:MSRTC-Ashwameh-Volvo.jpg" },
    { src: "assets/buses/orange-2.jpg", caption: "Curtained Volvo coach on an overnight service", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:GARUDA_VOLVO_B7R.JPG" }
  ] },
  { id: "kpn", name: "KPN Travels", busNumber: "TN-01-AB-1234", rating: "4.5 ★", busType: "Non-AC Sleeper 2+1", departureTime: "20:30", arrivalTime: "05:45", amenity: "Reading Lamp · Fan", photos: [
    { src: "assets/buses/kpn-1.jpg", caption: "Ultra-deluxe coach with 2+2 pushback seats", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:AC_Seater_bus.jpg" },
    { src: "assets/buses/kpn-2.jpg", caption: "Tourist coach holding on a ghat-section hill route", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Harisons_travels_2014-06-17_02-52.jpeg" }
  ] },
  { id: "intrcity", name: "IntrCity SmartBus", busNumber: "MH-14-TR-9900", rating: "4.7 ★", busType: "AC Sleeper 2+1", departureTime: "23:00", arrivalTime: "08:00", amenity: "Smart AC · Clean Washroom · GPS", photos: [
    { src: "assets/buses/intrcity-1.jpg", caption: "Blue multi-axle coach with live tracking", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Hyderabad_volvo.JPG" },
    { src: "assets/buses/intrcity-2.jpg", caption: "City-to-city AC coach at a boarding point", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:AC_Volvo_Bus_Service,_Kolkata.jpg" }
  ] },
  { id: "zingbus", name: "Zingbus Plus", busNumber: "DL-01-RT-5678", rating: "4.8 ★", busType: "AC Seater 2+2", departureTime: "18:00", arrivalTime: "23:30", amenity: "Premium Lounges · Water", photos: [
    { src: "assets/buses/zingbus-1.jpg", caption: "White multi-axle coach waiting at the depot", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:RSRTC_Volvo_Bus_Jodhpur_To_Delhi.jpg" },
    { src: "assets/buses/zingbus-2.jpg", caption: "Night boarding - luggage bay open before departure", credit: "Wikimedia Commons", source: "https://commons.wikimedia.org/wiki/File:Haryana_Roadways_%27Saarthi%27_Volvo_at_ISBT_17,_Chandigarh.jpg" }
  ] },
];

// Base rate per kilometer in INR by bus class
export const BUS_TYPE_RATES = {
  "AC Sleeper": {
    baseFare: 450,
    perKm: 1.85,
    tag: "Luxury Flat Bed (2+1)",
    category: "sleeper"
  },
  "AC Seater": {
    baseFare: 300,
    perKm: 1.35,
    tag: "Pushback AC (2+2)",
    category: "seater"
  },
  "Non-AC Sleeper": {
    baseFare: 250,
    perKm: 1.15,
    tag: "Economy Sleeper (2+1)",
    category: "sleeper"
  },
  "Non-AC Seater": {
    baseFare: 180,
    perKm: 0.95,
    tag: "Budget Express (2+2)",
    category: "seater"
  }
};

/**
 * 2 + 1 SLEEPER BUS LAYOUT (Standard Indian 2+1 Sleeper)
 * Left side: Single Berths (Window, Solo - no sharing): +150
 * Center: Walking Aisle
 * Right side: Double Berths (Inner Aisle: 0, Outer Window: +100)
 */
export const SLEEPER_LAYOUT_2PLUS1 = {
  lower: [
    // Row 1
    { id: "L1",  num: "L1",  type: "single-sleeper", deck: "lower", label: "Lower Single Window", premium: 150 },
    { id: "L2A", num: "L2",  type: "aisle",          deck: "lower", label: "Lower Double (Aisle)", premium: 0 },
    { id: "L2W", num: "L3",  type: "window",         deck: "lower", label: "Lower Double (Window)", premium: 100 },
    // Row 2
    { id: "L4",  num: "L4",  type: "single-sleeper", deck: "lower", label: "Lower Single Window", premium: 150 },
    { id: "L5A", num: "L5",  type: "aisle",          deck: "lower", label: "Lower Double (Aisle)", premium: 0 },
    { id: "L5W", num: "L6",  type: "window",         deck: "lower", label: "Lower Double (Window)", premium: 100 },
    // Row 3
    { id: "L7",  num: "L7",  type: "single-sleeper", deck: "lower", label: "Lower Single Window", premium: 150 },
    { id: "L8A", num: "L8",  type: "aisle",          deck: "lower", label: "Lower Double (Aisle)", premium: 0 },
    { id: "L8W", num: "L9",  type: "window",         deck: "lower", label: "Lower Double (Window)", premium: 100 },
    // Row 4
    { id: "L10",  num: "L10", type: "single-sleeper", deck: "lower", label: "Lower Single Window", premium: 150 },
    { id: "L11A", num: "L11", type: "aisle",          deck: "lower", label: "Lower Double (Aisle)", premium: 0 },
    { id: "L11W", num: "L12", type: "window",         deck: "lower", label: "Lower Double (Window)", premium: 100 }
  ],
  upper: [
    // Row 1
    { id: "U1",  num: "U1",  type: "single-sleeper", deck: "upper", label: "Upper Single Window", premium: 150 },
    { id: "U2A", num: "U2",  type: "aisle",          deck: "upper", label: "Upper Double (Aisle)", premium: 0 },
    { id: "U2W", num: "U3",  type: "window",         deck: "upper", label: "Upper Double (Window)", premium: 100 },
    // Row 2
    { id: "U4",  num: "U4",  type: "single-sleeper", deck: "upper", label: "Upper Single Window", premium: 150 },
    { id: "U5A", num: "U5",  type: "aisle",          deck: "upper", label: "Upper Double (Aisle)", premium: 0 },
    { id: "U5W", num: "U6",  type: "window",         deck: "upper", label: "Upper Double (Window)", premium: 100 },
    // Row 3
    { id: "U7",  num: "U7",  type: "single-sleeper", deck: "upper", label: "Upper Single Window", premium: 150 },
    { id: "U8A", num: "U8",  type: "aisle",          deck: "upper", label: "Upper Double (Aisle)", premium: 0 },
    { id: "U8W", num: "U9",  type: "window",         deck: "upper", label: "Upper Double (Window)", premium: 100 },
    // Row 4
    { id: "U10",  num: "U10", type: "single-sleeper", deck: "upper", label: "Upper Single Window", premium: 150 },
    { id: "U11A", num: "U11", type: "aisle",          deck: "upper", label: "Upper Double (Aisle)", premium: 0 },
    { id: "U11W", num: "U12", type: "window",         deck: "upper", label: "Upper Double (Window)", premium: 100 }
  ]
};

/**
 * 2 + 2 SEATER BUS LAYOUT
 */
export const SEATER_LAYOUT = [
  // Row 1
  { id: "1W", num: "1", type: "window", deck: "lower", label: "Row 1 Window", premium: 100 },
  { id: "1A", num: "2", type: "aisle",  deck: "lower", label: "Row 1 Aisle",  premium: 0 },
  { id: "1B", num: "3", type: "aisle",  deck: "lower", label: "Row 1 Aisle",  premium: 0 },
  { id: "2W", num: "4", type: "window", deck: "lower", label: "Row 1 Window", premium: 100 },
  // Row 2
  { id: "3W", num: "5", type: "window", deck: "lower", label: "Row 2 Window", premium: 100 },
  { id: "2A", num: "6", type: "aisle",  deck: "lower", label: "Row 2 Aisle",  premium: 0 },
  { id: "2B", num: "7", type: "aisle",  deck: "lower", label: "Row 2 Aisle",  premium: 0 },
  { id: "4W", num: "8", type: "window", deck: "lower", label: "Row 2 Window", premium: 100 },
  // Row 3
  { id: "5W", num: "9",  type: "window", deck: "lower", label: "Row 3 Window", premium: 100 },
  { id: "3A", num: "10", type: "aisle",  deck: "lower", label: "Row 3 Aisle",  premium: 0 },
  { id: "3B", num: "11", type: "aisle",  deck: "lower", label: "Row 3 Aisle",  premium: 0 },
  { id: "6W", num: "12", type: "window", deck: "lower", label: "Row 3 Window", premium: 100 },
  // Row 4
  { id: "7W", num: "13", type: "window", deck: "lower", label: "Row 4 Window", premium: 100 },
  { id: "4A", num: "14", type: "aisle",  deck: "lower", label: "Row 4 Aisle",  premium: 0 },
  { id: "4B", num: "15", type: "aisle",  deck: "lower", label: "Row 4 Aisle",  premium: 0 },
  { id: "8W", num: "16", type: "window", deck: "lower", label: "Row 4 Window", premium: 100 }
];

export function getRouteDistance(fromCity = "", toCity = "") {
  const from = (fromCity || "").trim().toLowerCase();
  const to = (toCity || "").trim().toLowerCase();
  if (!from || !to || from === to) return 0;

  const key = `${from}-${to}`;
  if (ROUTE_DISTANCES[key]) return ROUTE_DISTANCES[key];

  let hash = 0;
  for (let i = 0; i < (from + to).length; i++) {
    hash = (hash << 5) - hash + (from + to).charCodeAt(i);
  }
  return 250 + (Math.abs(hash) % 550);
}

export function getDatePricingFactor(dateString = "") {
  if (!dateString) return { multiplier: 1.0, isWeekend: false, isSurge: false, label: "Standard Fare" };

  try {
    const travelDate = new Date(dateString + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.round((travelDate - today) / (1000 * 60 * 60 * 24));
    const dayOfWeek = travelDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

    let multiplier = 1.0;
    let reasons = [];

    if (isWeekend) {
      multiplier += 0.25;
      reasons.push("Weekend Surge (+25%)");
    }

    if (diffDays <= 1 && diffDays >= 0) {
      multiplier += 0.15;
      reasons.push("Last-Minute (+15%)");
    } else if (diffDays >= 14) {
      multiplier -= 0.05;
      reasons.push("Early Bird (-5%)");
    }

    return {
      multiplier: Math.round(multiplier * 100) / 100,
      isWeekend,
      isSurge: multiplier > 1.0,
      label: reasons.length > 0 ? reasons.join(" · ") : "Regular Weekday Rate"
    };
  } catch (err) {
    return { multiplier: 1.0, isWeekend: false, isSurge: false, label: "Standard Fare" };
  }
}

export function getSeatInfo(seatId = "", busType = "AC Sleeper") {
  const cleanId = (seatId || "").trim();
  const isSleeper = (busType || "").toLowerCase().includes("sleeper");

  if (isSleeper) {
    const allBerths = [...SLEEPER_LAYOUT_2PLUS1.lower, ...SLEEPER_LAYOUT_2PLUS1.upper];
    const found = allBerths.find(s => s.id === cleanId);
    if (found) return found;

    // Single sleeper berth format: L1, L4, L7, L10, U1, U4, U7, U10 etc
    if (/^[UL](1|4|7|10)$/i.test(cleanId) || (!cleanId.includes("A") && !cleanId.includes("W") && /^[UL]\d+$/i.test(cleanId))) {
      return { id: cleanId, num: cleanId, type: "single-sleeper", deck: cleanId.startsWith("U") ? "upper" : "lower", label: "Single Sleeper (Window)", premium: 150 };
    }
    if (cleanId.endsWith("W")) {
      return { id: cleanId, num: cleanId, type: "window", deck: cleanId.startsWith("U") ? "upper" : "lower", label: "Double Window Berth", premium: 100 };
    }
    return { id: cleanId, num: cleanId, type: "aisle", deck: cleanId.startsWith("U") ? "upper" : "lower", label: "Double Aisle Berth", premium: 0 };
  } else {
    const found = SEATER_LAYOUT.find(s => s.id === cleanId);
    if (found) return found;

    if (cleanId.endsWith("W")) {
      return { id: cleanId, num: cleanId, type: "window", deck: "lower", label: "Window Seat", premium: 100 };
    }
    return { id: cleanId, num: cleanId, type: "aisle", deck: "lower", label: "Aisle Seat", premium: 0 };
  }
}

export function calculateFare({
  fromCity = "",
  toCity = "",
  busType = "AC Sleeper",
  travelDate = "",
  seatCount = 1,
  selectedSeats = []
} = {}) {
  const from = (fromCity || "").trim();
  const to = (toCity || "").trim();
  const cleanBusType = BUS_TYPE_RATES[busType] ? busType : "AC Sleeper";

  let seats = [];
  if (Array.isArray(selectedSeats)) {
    seats = selectedSeats.map(s => String(s).trim()).filter(Boolean);
  } else if (typeof selectedSeats === "string") {
    seats = selectedSeats.split(",").map(s => s.trim()).filter(Boolean);
  }

  const numSeats = seats.length > 0 ? seats.length : Math.max(1, Math.min(10, parseInt(seatCount, 10) || 1));

  if (!from || !to || from.toLowerCase() === to.toLowerCase()) {
    return {
      isValidRoute: false,
      distanceKm: 0,
      baseFare: 0,
      seatPrice: 0,
      seatCount: numSeats,
      selectedSeats: seats,
      seatDetails: [],
      totalPremiums: 0,
      subtotal: 0,
      gst: 0,
      totalFare: 0,
      dateFactor: { multiplier: 1.0, label: "Please choose valid source and destination" }
    };
  }

  const distanceKm = getRouteDistance(from, to);
  const busConfig = BUS_TYPE_RATES[cleanBusType];
  const dateFactor = getDatePricingFactor(travelDate);

  const basePerSeat = busConfig.baseFare + (distanceKm * busConfig.perKm);
  const surgeAdjustedPerSeat = Math.round(basePerSeat * dateFactor.multiplier);

  const seatDetails = [];
  let totalPremiums = 0;

  if (seats.length > 0) {
    for (const sId of seats) {
      const sInfo = getSeatInfo(sId, cleanBusType);
      const prem = sInfo.premium || 0;
      totalPremiums += prem;
      seatDetails.push({
        id: sId,
        label: sInfo.label,
        type: sInfo.type,
        premium: prem,
        effectivePrice: surgeAdjustedPerSeat + prem
      });
    }
  } else {
    for (let i = 0; i < numSeats; i++) {
      seatDetails.push({
        id: `Seat ${i + 1}`,
        label: "Standard Seat",
        type: "aisle",
        premium: 0,
        effectivePrice: surgeAdjustedPerSeat
      });
    }
  }

  const subtotal = (surgeAdjustedPerSeat * numSeats) + totalPremiums;
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const finalPayable = subtotal + gst;

  return {
    isValidRoute: true,
    distanceKm,
    busType: cleanBusType,
    busTag: busConfig.tag,
    perKmRate: busConfig.perKm,
    baseFare: busConfig.baseFare,
    rawSeatPrice: Math.round(basePerSeat),
    seatPrice: surgeAdjustedPerSeat,
    seatCount: numSeats,
    selectedSeats: seats,
    seatDetails,
    totalPremiums,
    subtotal,
    gst,
    totalFare: finalPayable,
    dateFactor
  };
}

export const POPULAR_CITIES = [
  "Bengaluru",
  "Hyderabad",
  "Mumbai",
  "Pune",
  "Chennai",
  "Delhi",
  "Goa",
  "Jaipur",
  "Kolkata",
  "Kochi",
  "Coimbatore",
  "Ahmedabad",
  "Chandigarh"
];
