/**
 * Formats a date string into a human-readable format
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleString(undefined, options);
}; 