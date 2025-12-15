import { jest } from "@jest/globals";

// Mock the auth service before importing the controller
const mockFindUserByEmail = jest.fn();
const mockValidatePassword = jest.fn();
const mockGenerateToken = jest.fn();
const mockUpdateUserToken = jest.fn();

jest.unstable_mockModule("../services/authServices.js", () => ({
  findUserByEmail: mockFindUserByEmail,
  validatePassword: mockValidatePassword,
  generateToken: mockGenerateToken,
  updateUserToken: mockUpdateUserToken,
}));

// Import controller after mocking
const { login } = await import("../controllers/authControllers.js");

describe("Login Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();
  });

  test("should return status code 200 on successful login", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
      subscription: "starter",
    };

    mockFindUserByEmail.mockResolvedValue(mockUser);
    mockValidatePassword.mockResolvedValue(true);
    mockGenerateToken.mockReturnValue("test-token-123");
    mockUpdateUserToken.mockResolvedValue([1]);

    await login(req, res, next);

    expect(res.json).toHaveBeenCalled();
    // Check that next was not called with an error
    expect(next).not.toHaveBeenCalled();
  });

  test("should return token in response", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
      subscription: "starter",
    };
    const expectedToken = "test-token-123";

    mockFindUserByEmail.mockResolvedValue(mockUser);
    mockValidatePassword.mockResolvedValue(true);
    mockGenerateToken.mockReturnValue(expectedToken);
    mockUpdateUserToken.mockResolvedValue([1]);

    await login(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expectedToken,
      })
    );
  });

  test("should return user object with email and subscription as strings", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
      subscription: "starter",
    };

    mockFindUserByEmail.mockResolvedValue(mockUser);
    mockValidatePassword.mockResolvedValue(true);
    mockGenerateToken.mockReturnValue("test-token-123");
    mockUpdateUserToken.mockResolvedValue([1]);

    await login(req, res, next);

    const responseCall = res.json.mock.calls[0][0];

    // Check user object exists with 2 fields
    expect(responseCall.user).toBeDefined();
    expect(Object.keys(responseCall.user)).toHaveLength(2);

    // Check email field exists and is a string
    expect(responseCall.user.email).toBeDefined();
    expect(typeof responseCall.user.email).toBe("string");

    // Check subscription field exists and is a string
    expect(responseCall.user.subscription).toBeDefined();
    expect(typeof responseCall.user.subscription).toBe("string");
  });

  test("should call next with 401 error for wrong email", async () => {
    mockFindUserByEmail.mockResolvedValue(null);

    await login(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.status).toBe(401);
  });

  test("should call next with 401 error for wrong password", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
      subscription: "starter",
    };

    mockFindUserByEmail.mockResolvedValue(mockUser);
    mockValidatePassword.mockResolvedValue(false);

    await login(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.status).toBe(401);
  });
});
