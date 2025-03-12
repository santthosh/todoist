// Import jest-dom for DOM element assertions
import '@testing-library/jest-dom';

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      pass,
      message: () => `expected ${received} to be in the document`,
    };
  },
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock fetch API
global.fetch = jest.fn();

// Mock Web API objects needed for Next.js
global.Headers = class Headers {
  constructor(init) {
    this.headers = {};
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers[key.toLowerCase()] = value;
      });
    }
  }
  
  get(name) {
    return this.headers[name.toLowerCase()] || null;
  }
  
  set(name, value) {
    this.headers[name.toLowerCase()] = value;
  }
  
  has(name) {
    return name.toLowerCase() in this.headers;
  }
};

// Define Request for Next.js
global.Request = class Request {
  constructor(input, init) {
    this.url = input;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
    this.body = init?.body;
  }
};

// Mock NextRequest and NextResponse
jest.mock('next/server', () => {
  class MockNextRequest {
    constructor(url, init = {}) {
      this._url = url;
      this.method = init.method || 'GET';
      this._headers = new Headers(init.headers);
      this._body = init.body;
    }
    
    get url() {
      return this._url;
    }
    
    get headers() {
      return this._headers;
    }
    
    async json() {
      return JSON.parse(this._body);
    }
  }
  
  class MockNextResponse {
    constructor(body, init = {}) {
      this._body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || '';
      this._headers = new Headers(init.headers);
    }
    
    get headers() {
      return this._headers;
    }
    
    async json() {
      return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
    }
    
    static json(body, init) {
      const response = new MockNextResponse(
        typeof body === 'string' ? body : JSON.stringify(body),
        init
      );
      return response;
    }
  }
  
  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
}); 