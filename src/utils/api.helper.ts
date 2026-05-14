import axios from "axios";

export function getApiServiceUrl(): string {
  return process.env.API_BASE_URL || "https://api.example.com";
}

export function getUserAgent(): string {
  return process.env.USER_AGENT || "MobileAutomation/1.0";
}

export function getDefaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": getUserAgent(),
  };

  const token = process.env.ACCESS_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export { axios };
