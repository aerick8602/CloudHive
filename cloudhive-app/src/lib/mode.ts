// lib/mode.ts

let mode: "production" | "development" | "maintenance" = "production";

export function getAppMode() {
  return mode;
}

export function setAppMode(
  value: "production" | "development" | "maintenance"
) {
  mode = value;
}
