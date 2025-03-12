/**
 * Browser session management utilities
 */

// Generate a random session ID
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Get the current session ID from localStorage or create a new one
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return ''; // Return empty string for server-side rendering
  }
  
  let sessionId = localStorage.getItem('todoSessionId');
  
  // If no session ID exists, create one and store it
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('todoSessionId', sessionId);
  }
  
  return sessionId;
} 