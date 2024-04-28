// Import required dependencies
const { tables } = require("../setup");

jest.mock("../setup", () => ({
  database: {
    query: jest.fn(),
  },
  tables: {
    user: {
      create: jest.fn((user) => {
        if (!user.pseudo || !user.email || !user.password) {
          return Promise.reject(new Error("Invalid user object"));
        }

        return Promise.resolve({ insertId: 1 });
      }),
    },
  },
}));

// Test suite for the create method of UserManager
describe("Create user", () => {
  it("should create a new user and respond with the new user ID", async () => {
    // Define a sample user for testing
    const newUser = {
      pseudo: `Test User ${Date.now()}`,
      email: `testuser${Date.now()}@example.com`,
      password: "password",
    };

    // Send a create request to the user table with a test user
    const insertId = await tables.user.create(newUser);

    // Assertions
    expect(insertId).toEqual({ insertId: 1 });
  });

  it("should throw when passing empty object", async () => {
    const promise = tables.user.create({});

    await expect(promise).rejects.toThrow();
  });

  it("should throw when email format is incorrect", async () => {
    const newUser = {
      pseudo: `Test User ${Date.now()}`,
      email: `testuser${Date.now()}example.com`,
      password: "password",
    };

    const promise = tables.user.create(newUser);

    await expect(promise).rejects.toThrow();
  });
});
