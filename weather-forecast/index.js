const fs = require("fs");
const path = require("path");

/**
 * Helper to load environment variables from .env if present.
 * Looks in the current folder (weather-forecast/.env) or project root.
 */
function loadEnv() {
  const possiblePaths = [
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "../.env"),
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      if (typeof process.loadEnvFile === "function") {
        try {
          process.loadEnvFile(envPath);
          return;
        } catch {
          // fallback to manual parse if error
        }
      }
      try {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#")) {
            const [key, ...rest] = trimmed.split("=");
            const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
            if (key && !process.env[key.trim()]) {
              process.env[key.trim()] = val;
            }
          }
        }
      } catch {
        // ignore read error
      }
      break;
    }
  }
}

loadEnv();

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Format date string "YYYY-MM-DD" into "EEE, dd MMM yyyy"
 * e.g., "2021-04-23" -> "Fri, 23 Apr 2021"
 */
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dayName = DAYS[date.getDay()];
  const monthName = MONTHS[date.getMonth()];
  return `${dayName}, ${day} ${monthName} ${year}`;
}

async function getWeatherForecast() {
  const isMock = process.argv.includes("--mock");
  const city = "Jakarta";
  const apiKey =
    process.env.OPENWEATHER_API_KEY ||
    process.env.API_KEY ||
    process.argv.find((arg) => !arg.startsWith("-") && arg !== process.argv[0] && arg !== process.argv[1]);

  if (!isMock && !apiKey) {
    console.error("Error: OpenWeatherMap API key is required.\n");
    console.error("Please provide your API key in one of the following ways:");
    console.error("  1. In a .env file:");
    console.error("     OPENWEATHER_API_KEY=your_api_key_here\n");
    console.error("  2. As an environment variable:");
    console.error("     OPENWEATHER_API_KEY=your_api_key_here node weather-forecast/index.js\n");
    console.error("  3. As a command-line argument:");
    console.error("     node weather-forecast/index.js your_api_key_here\n");
    console.error("Tip: You can also run with '--mock' to test the output format without an API key:");
    console.error("     node weather-forecast/index.js --mock\n");
    process.exit(1);
  }

  let data;

  if (isMock) {
    // Mock data matching the example output in the prompt
    data = {
      cod: "200",
      list: [
        { dt_txt: "2021-04-23 09:00:00", main: { temp: 16.72 } },
        { dt_txt: "2021-04-23 12:00:00", main: { temp: 17.50 } },
        { dt_txt: "2021-04-24 09:00:00", main: { temp: 18.57 } },
        { dt_txt: "2021-04-25 09:00:00", main: { temp: 22.35 } },
        { dt_txt: "2021-04-26 09:00:00", main: { temp: 20.42 } },
        { dt_txt: "2021-04-27 09:00:00", main: { temp: 23.46 } },
        { dt_txt: "2021-04-28 09:00:00", main: { temp: 22.07 } },
      ],
    };
  } else {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    try {
      const response = await fetch(url);
      data = await response.json();

      if (!response.ok || data.cod !== "200") {
        console.error(`Error (${data.cod || response.status}): ${data.message || "Failed to fetch weather data."}`);
        process.exit(1);
      }
    } catch (error) {
      console.error("Network or execution error:", error.message);
      process.exit(1);
    }
  }

    // Group forecast data by date, keeping one temperature per day
    const dailyForecasts = new Map();

    for (const item of data.list) {
      // dt_txt format: "YYYY-MM-DD HH:mm:ss"
      const dateKey = item.dt_txt.split(" ")[0];

      // Pick the first temperature entry recorded for each calendar day
      if (!dailyForecasts.has(dateKey)) {
        dailyForecasts.set(dateKey, item.main.temp);
      }
    }

    console.log("Weather Forecast:");
    for (const [dateKey, temp] of dailyForecasts) {
      console.log(`${formatDate(dateKey)}: ${Number(temp).toFixed(2)}°C`);
    }
}

getWeatherForecast();
