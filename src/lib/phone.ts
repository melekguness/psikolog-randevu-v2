export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function maskTrMobile(value: string): string {
  let d = digitsOnly(value);
  if (d.startsWith("90") && d.length > 10) d = d.slice(2);
  if (!d.startsWith("0") && d.length > 0) d = `0${d}`;
  d = d.slice(0, 11);

  const p1 = d.slice(0, 4);
  const p2 = d.slice(4, 7);
  const p3 = d.slice(7, 9);
  const p4 = d.slice(9, 11);

  if (d.length <= 4) return p1;
  if (d.length <= 7) return `${p1} ${p2}`;
  if (d.length <= 9) return `${p1} ${p2} ${p3}`;
  return `${p1} ${p2} ${p3} ${p4}`;
}

export function isValidTrMobile(value: string): boolean {
  const d = digitsOnly(value);
  const normalized =
    d.startsWith("90") && d.length === 12 ? `0${d.slice(2)}` : d;
  return /^05\d{9}$/.test(normalized);
}

export function unmaskPhone(value: string): string {
  let d = digitsOnly(value);
  if (d.startsWith("90") && d.length === 12) d = `0${d.slice(2)}`;
  if (!d.startsWith("0") && d.length === 10) d = `0${d}`;
  return d;
}

/** Privacy display: 0532 *** ** 67 */
export function obscureTrMobile(value: string): string {
  const d = unmaskPhone(value);
  if (!/^05\d{9}$/.test(d)) return maskTrMobile(value);
  return `${d.slice(0, 4)} *** ** ${d.slice(9)}`;
}
