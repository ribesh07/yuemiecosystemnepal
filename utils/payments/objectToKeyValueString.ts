export function objectToKeyValueString(
  payload: Record<string, unknown>
): string {
  return Object.entries(payload)
    .map(([key, value]) => `${key}=${value ?? ""}`)
    .join(",");
}

