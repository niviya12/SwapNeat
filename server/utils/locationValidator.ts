import { ALL_38_DISTRICTS, DISTRICT_MAP, isValidTamilNaduDistrict, isValidTamilNaduCity, NON_TN_BLOCKED_MESSAGE } from '../../src/data/tamilNaduLocations.ts';

export function validateLocationBackend(state: unknown, district: unknown, city?: unknown): { valid: boolean; error?: string } {
  // 1. Strict State Check
  if (typeof state !== 'string' || state.trim().toLowerCase() !== 'tamil nadu') {
    return {
      valid: false,
      error: NON_TN_BLOCKED_MESSAGE
    };
  }

  // 2. Strict District Check - must match one of the 38 districts of Tamil Nadu
  if (typeof district !== 'string' || !isValidTamilNaduDistrict(district.trim())) {
    return {
      valid: false,
      error: `SwapNeat operates exclusively in Tamil Nadu. "${district}" is not a recognized Tamil Nadu district.`
    };
  }

  // 3. City/Town check (if provided)
  if (city && typeof city === 'string') {
    const validCity = isValidTamilNaduCity(district, city);
    if (!validCity) {
      return {
        valid: false,
        error: `Selected town/city "${city}" does not match Tamil Nadu district "${district}".`
      };
    }
  }

  return { valid: true };
}

export { ALL_38_DISTRICTS, DISTRICT_MAP, isValidTamilNaduDistrict, isValidTamilNaduCity, NON_TN_BLOCKED_MESSAGE };
