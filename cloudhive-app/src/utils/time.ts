const istOffset = 5.5 * 60 * 60000; // IST is UTC+5:30
export function convertMillisToIST(millis: number): string {
  const date = new Date(millis);
  return new Date(date.getTime() + istOffset).toISOString();
}

export function convertISTToMillis(istIsoString: string): number {
  const date = new Date(istIsoString);
  return date.getTime() - istOffset;
}
