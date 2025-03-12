/**
 * Test helper functions
 */

/**
 * Normalizes dates in objects for comparison in tests
 * Converts Date objects to strings and vice versa to ensure consistent comparison
 * @param obj The object to normalize
 * @returns A new object with normalized dates
 */
export function normalizeDates<T>(obj: T): T {
  if (!obj) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => normalizeDates(item)) as unknown as T;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const result = { ...obj };
    
    for (const key in result) {
      const value = result[key];
      
      // Handle Date objects
      if (value instanceof Date) {
        result[key] = value.toISOString();
      } 
      // Handle date strings
      else if (typeof value === 'string' && isISODateString(value)) {
        result[key] = value;
      } 
      // Recursively process nested objects
      else if (typeof value === 'object' && value !== null) {
        result[key] = normalizeDates(value);
      }
    }
    
    return result as T;
  }
  
  return obj;
}

/**
 * Checks if a string is in ISO date format
 * @param str The string to check
 * @returns True if the string is in ISO date format
 */
function isISODateString(str: string): boolean {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  return isoDatePattern.test(str);
} 