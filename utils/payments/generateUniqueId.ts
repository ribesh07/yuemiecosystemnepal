export function generateUniqueId(): string {
  const now = Date.now().toString();
  const rand = Math.floor(100000 + Math.random() * 900000).toString();
  return `${now}${rand}`;
}

