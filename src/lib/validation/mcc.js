/** Returns true when value is a valid 4-digit MCC code. */
export function isValidMccCode(value) {
  return /^\d{4}$/.test(String(value || '').trim());
}

/** Parse raw input into valid unique 4-digit MCC codes. */
export function parseMccCodes(raw) {
  return [...new Set(
    String(raw || '').trim().split(/[\s,;]+/).filter(isValidMccCode)
  )];
}
