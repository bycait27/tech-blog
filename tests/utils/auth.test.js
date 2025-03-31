const withAuth = require('../../utils/auth');

describe('Authentication Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;
  
  beforeEach(() => {
    // set up fresh mocks for each test
    mockRequest = {
      session: {}
    };
    mockResponse = {
      redirect: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should call next() when user is logged in', () => {
    // arrange: set up the session with logged_in = true
    mockRequest.session.logged_in = true;
    
    // act: call the middleware
    withAuth(mockRequest, mockResponse, nextFunction);
    
    // assert: next() should be called, redirect should not be called
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.redirect).not.toHaveBeenCalled();
  });

  it('should redirect to /login when user is not logged in', () => {
    // arrange: set up the session with logged_in = false
    mockRequest.session.logged_in = false;
    
    // act: call the middleware
    withAuth(mockRequest, mockResponse, nextFunction);
    
    // assert: redirect should be called with '/login', next() should not be called
    expect(mockResponse.redirect).toHaveBeenCalledWith('/login');
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should redirect to /login when session is undefined', () => {
    // arrange: set up with no session
    mockRequest.session = undefined;
    
    // act: call the middleware
    withAuth(mockRequest, mockResponse, nextFunction);
    
    // assert: redirect should be called with '/login', next() should not be called
    expect(mockResponse.redirect).toHaveBeenCalledWith('/login');
    expect(nextFunction).not.toHaveBeenCalled();
  });
  
  it('should redirect to /login when session exists but logged_in is undefined', () => {
    // arrange: set up with session but no logged_in property
    mockRequest.session = {}; // logged_in is undefined
    
    // act: call the middleware
    withAuth(mockRequest, mockResponse, nextFunction);
    
    // assert: redirect should be called with '/login', next() should not be called
    expect(mockResponse.redirect).toHaveBeenCalledWith('/login');
    expect(nextFunction).not.toHaveBeenCalled();
  });
});