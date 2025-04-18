export type LogEntry = {
  timestamp: string;
  level: string;
  message: string;
};

export async function fetchLogs(): Promise<LogEntry[]> {
  try {
    const res = await fetch("/api/logs");
    if (!res.ok) throw new Error("Failed to fetch logs");
    return await res.json();
  } catch (error) {
    console.error("fetchLogs error:", error);
    return [];
  }
}
