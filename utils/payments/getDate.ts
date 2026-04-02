export function getDate(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  // ConnectIPS loginpage spec requires TXNDATE in DD-MM-YYYY (length 10)
  return `${dd}-${mm}-${yyyy}`;
}
