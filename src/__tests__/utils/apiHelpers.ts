import { NextRequest } from 'next/server';

// Helper function to create a mock request with params for testing
export function createMockRequestWithParams(url: string, params: { id: string }, headers?: Record<string, string>) {
  // Create a mock request
  const request = new NextRequest(url, {
    headers: headers || {}
  });
  
  // Add params to the request
  Object.defineProperty(request, 'nextUrl', {
    get: () => ({
      pathname: url,
      searchParams: new URLSearchParams(),
    }),
  });
  
  return request;
} 